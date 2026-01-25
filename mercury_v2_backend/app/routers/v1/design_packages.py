from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from datetime import datetime, timedelta

from app.deps.db import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.responses import SuccessResponse
from app.schemas.design_package import (
    DesignPackageCreate,
    DesignPackageUpdate,
    DesignPackageCreateResponse,
    DesignPackageListItem,
    DesignPackageDetailResponse,
    DesignImageResponse,
    MarketReportResponse,
    PDFExportRequest,
    PDFExportResponse,
    ShareLinkRequest,
    ShareLinkResponse,
    Production2DRequest,
    Production2DResponse,
    Production3DRequest,
    Production3DResponse,
    ProductionStatusResponse,
    ProductionAssetStatus,
    ProductionRetryRequest,
    ProductionRetryResponse,
    FinalizeResponse
)
from app.services import design_package_service
from app.core.exceptions import NotFoundException, ForbiddenException

router = APIRouter(prefix="/design-packages", tags=["design-packages"])


@router.post("", response_model=SuccessResponse[DesignPackageCreateResponse], status_code=status.HTTP_201_CREATED)
async def create_design_package(
    data: DesignPackageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new design package."""
    from app.tasks.design_package_tasks import marketing_report_task
    
    try:
        package = await design_package_service.create_design_package(
            db, current_user.id, data
        )
        
        # Start marketing report generation in background
        task = marketing_report_task.delay(
            str(package.id),
            data.context or {}
        )
        
        response = DesignPackageCreateResponse(
            design_package_id=package.id,
            status=package.status,
            message="패키지가 생성되었습니다. 마케팅 리포트를 분석 중입니다.",
            estimated_time="30s"
        )
        
        return SuccessResponse(data=response, message="Success")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=SuccessResponse[dict])
async def list_design_packages(
    project_id: uuid.UUID = None,
    page: int = 1,
    page_size: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get list of design packages."""
    skip = (page - 1) * page_size
    packages = await design_package_service.get_design_packages(
        db, current_user.id, project_id, skip, page_size
    )
    
    return SuccessResponse(
        data={
            "items": [DesignPackageListItem.model_validate(p) for p in packages],
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": len(packages),
                "total_pages": 1
            }
        },
        message="Success"
    )


@router.get("/{package_id}", response_model=SuccessResponse[DesignPackageDetailResponse])
async def get_design_package(
    package_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get design package details."""
    try:
        package = await design_package_service.get_design_package(
            db, package_id, current_user.id
        )
        images = await design_package_service.get_design_images(db, package_id)
        market_report = await design_package_service.get_market_report(db, package_id)
        
        response = DesignPackageDetailResponse(
            id=package.id,
            title=package.title,
            description=package.description,
            project_id=package.project_id,
            status=package.status,
            package_metadata=package.package_metadata,
            color_palette=package.color_palette,
            images=[DesignImageResponse.model_validate(img) for img in images],
            market_report=MarketReportResponse.model_validate(market_report) if market_report else None,
            created_at=package.created_at,
            updated_at=package.updated_at
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.put("/{package_id}", response_model=SuccessResponse[dict])
async def update_design_package(
    package_id: uuid.UUID,
    data: DesignPackageUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update design package."""
    try:
        package = await design_package_service.update_design_package(
            db, package_id, current_user.id, data
        )
        
        return SuccessResponse(
            data={
                "id": package.id,
                "title": package.title,
                "description": package.description,
                "updated_at": package.updated_at
            },
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_design_package(
    package_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete design package."""
    try:
        await design_package_service.delete_design_package(
            db, package_id, current_user.id
        )
        return None
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/{package_id}/export/pdf", response_model=SuccessResponse[dict], status_code=status.HTTP_202_ACCEPTED)
async def export_pdf(
    package_id: uuid.UUID,
    data: PDFExportRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Export design package as PDF (Async with Celery)."""
    from app.tasks.design_package_tasks import pdf_export_task
    
    try:
        # Verify ownership
        await design_package_service.get_design_package(db, package_id, current_user.id)
        
        # Start PDF export task
        task = pdf_export_task.delay(
            str(package_id),
            data.include_report,
            data.include_charts
        )
        
        return SuccessResponse(
            data={
                "task_id": task.id,
                "status": "processing",
                "message": "PDF 생성 중입니다. 완료되면 다운로드 링크를 제공합니다."
            },
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/{package_id}/share", response_model=SuccessResponse[ShareLinkResponse], status_code=status.HTTP_201_CREATED)
async def create_share_link(
    package_id: uuid.UUID,
    data: ShareLinkRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create share link for design package."""
    try:
        share_token, expires_at = await design_package_service.create_share_token(
            db, package_id, current_user.id, data.expires_in_days
        )
        
        response = ShareLinkResponse(
            share_url=f"https://mercury.example.com/share/{share_token}",
            share_token=share_token,
            expires_at=expires_at
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/public/{share_token}", response_model=SuccessResponse[dict])
async def get_shared_package(
    share_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Get design package by share token (public, no auth required)."""
    # Mock implementation
    mock_data = {
        "title": "Shared Design Package",
        "description": "This is a shared design package",
        "images": [],
        "market_report": None,
        "created_at": datetime.utcnow()
    }
    
    return SuccessResponse(data=mock_data, message="Success")


@router.post("/{package_id}/production/2d", response_model=SuccessResponse[Production2DResponse], status_code=status.HTTP_202_ACCEPTED)
async def start_2d_production(
    package_id: uuid.UUID,
    data: Production2DRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start 2D production asset generation."""
    from app.tasks.design_package_tasks import production_2d_task
    
    try:
        generation_params = data.generation_params.model_dump() if data.generation_params else {}
        
        # Create asset records in database
        assets = await design_package_service.create_production_assets_2d(
            db, package_id, current_user.id, generation_params
        )
        
        # Start Celery task for actual generation
        task = production_2d_task.delay(
            str(package_id),
            generation_params
        )
        
        response = Production2DResponse(
            task_id=task.id,
            status="processing",
            assets=[
                {"type": asset.asset_type, "status": asset.status}
                for asset in assets
            ]
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/{package_id}/production/2d/retry", response_model=SuccessResponse[ProductionRetryResponse], status_code=status.HTTP_202_ACCEPTED)
async def retry_2d_production(
    package_id: uuid.UUID,
    data: ProductionRetryRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retry 2D production asset generation."""
    try:
        asset = await design_package_service.retry_production_asset(
            db, package_id, current_user.id, data.asset_type
        )
        
        response = ProductionRetryResponse(
            asset_id=asset.id,
            status=asset.status,
            retry_count=asset.retry_count
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{package_id}/production/3d", response_model=SuccessResponse[Production3DResponse], status_code=status.HTTP_202_ACCEPTED)
async def start_3d_production(
    package_id: uuid.UUID,
    data: Production3DRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start 3D production asset generation."""
    from app.tasks.design_package_tasks import production_3d_task
    
    try:
        generation_params = data.generation_params.model_dump() if data.generation_params else {}
        
        # Create 3D asset record in database
        asset = await design_package_service.create_production_asset_3d(
            db, package_id, current_user.id, generation_params
        )
        
        # Start Celery task for actual generation
        task = production_3d_task.delay(
            str(package_id),
            generation_params
        )
        
        response = Production3DResponse(
            task_id=task.id,
            status="processing",
            estimated_time="5-10 minutes"
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{package_id}/production/status", response_model=SuccessResponse[ProductionStatusResponse])
async def get_production_status(
    package_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get production status."""
    try:
        package = await design_package_service.get_design_package(
            db, package_id, current_user.id
        )
        assets = await design_package_service.get_production_assets(
            db, package_id, current_user.id
        )
        
        response = ProductionStatusResponse(
            package_status=package.status,
            assets=[
                ProductionAssetStatus(
                    type=asset.asset_type,
                    status=asset.status,
                    asset_url=asset.asset_url,
                    thumbnail_url=asset.thumbnail_url,
                    retry_count=asset.retry_count,
                    error_message=asset.error_message
                )
                for asset in assets
            ]
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/{package_id}/finalize", response_model=SuccessResponse[FinalizeResponse])
async def finalize_package(
    package_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Finalize design package."""
    try:
        package = await design_package_service.finalize_package(
            db, package_id, current_user.id
        )
        
        response = FinalizeResponse(
            package_id=package.id,
            status=package.status,
            message="패키지가 갤러리로 전송되었습니다."
        )
        
        return SuccessResponse(data=response, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
