from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional
import uuid
from datetime import datetime, timedelta

from app.models.design_package import DesignPackage
from app.models.design_image import DesignImage
from app.models.production_asset import ProductionAsset
from app.models.market_report import MarketReport
from app.schemas.design_package import (
    DesignPackageCreate,
    DesignPackageUpdate,
    ProductionRetryRequest
)
from app.core.exceptions import NotFoundException, ForbiddenException


async def create_design_package(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: DesignPackageCreate
) -> DesignPackage:
    """Create a new design package."""
    # Create design package
    package = DesignPackage(
        user_id=user_id,
        title=data.title,
        description=data.description,
        status="partial",
        package_metadata=data.context or {},
        color_palette=None
    )
    
    # Set source relationship
    if data.source_type == "chat":
        package.chat_session_id = data.source_id
    elif data.source_type == "canvas":
        package.canvas_project_id = data.source_id
    
    db.add(package)
    await db.flush()
    
    # Add selected images
    for idx, image_id in enumerate(data.selected_image_ids):
        design_image = DesignImage(
            design_package_id=package.id,
            image_type="main",
            image_url=f"https://storage.example.com/designs/{image_id}.png",
            thumbnail_url=f"https://storage.example.com/thumbnails/{image_id}.jpg",
            display_order=idx + 1
        )
        db.add(design_image)
    
    await db.commit()
    await db.refresh(package)
    return package


async def get_design_packages(
    db: AsyncSession,
    user_id: uuid.UUID,
    project_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 20
) -> list[DesignPackage]:
    """Get list of design packages."""
    query = select(DesignPackage).where(
        DesignPackage.user_id == user_id,
        DesignPackage.is_deleted == False
    )
    
    if project_id:
        query = query.where(DesignPackage.project_id == project_id)
    
    query = query.order_by(DesignPackage.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_design_package(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID
) -> DesignPackage:
    """Get a design package by ID."""
    result = await db.execute(
        select(DesignPackage).where(
            DesignPackage.id == package_id,
            DesignPackage.is_deleted == False
        )
    )
    package = result.scalar_one_or_none()
    
    if not package:
        raise NotFoundException("Design package not found")
    
    if package.user_id != user_id:
        raise ForbiddenException("Access denied")
    
    return package


async def get_design_images(
    db: AsyncSession,
    package_id: uuid.UUID
) -> list[DesignImage]:
    """Get all images for a design package."""
    result = await db.execute(
        select(DesignImage)
        .where(DesignImage.design_package_id == package_id)
        .order_by(DesignImage.display_order)
    )
    return list(result.scalars().all())


async def get_market_report(
    db: AsyncSession,
    package_id: uuid.UUID
) -> Optional[MarketReport]:
    """Get market report for a design package."""
    result = await db.execute(
        select(MarketReport).where(MarketReport.design_package_id == package_id)
    )
    return result.scalar_one_or_none()


async def update_design_package(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID,
    data: DesignPackageUpdate
) -> DesignPackage:
    """Update a design package."""
    package = await get_design_package(db, package_id, user_id)
    
    if data.title is not None:
        package.title = data.title
    if data.description is not None:
        package.description = data.description
    
    await db.commit()
    await db.refresh(package)
    return package


async def delete_design_package(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID
) -> None:
    """Soft delete a design package."""
    package = await get_design_package(db, package_id, user_id)
    package.is_deleted = True
    await db.commit()


async def create_share_token(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID,
    expires_in_days: int
) -> tuple[str, datetime]:
    """Create a share token for a design package."""
    # Verify ownership
    await get_design_package(db, package_id, user_id)
    
    # Generate token (simplified - in production use secure random)
    share_token = str(uuid.uuid4())[:12]
    expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
    
    # TODO: Store in Redis or database table
    # For now, just return the token
    
    return share_token, expires_at


async def get_package_by_share_token(
    db: AsyncSession,
    share_token: str
) -> Optional[DesignPackage]:
    """Get design package by share token (public access)."""
    # TODO: Implement token validation from Redis/DB
    # For now, return None (mock implementation)
    return None


async def create_production_assets_2d(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID,
    generation_params: dict
) -> list[ProductionAsset]:
    """Create 2D production assets."""
    package = await get_design_package(db, package_id, user_id)
    
    asset_types = [
        "6view_front", "6view_back", "6view_left", 
        "6view_right", "6view_top", "6view_bottom", 
        "model_shot"
    ]
    
    assets = []
    for asset_type in asset_types:
        asset = ProductionAsset(
            design_package_id=package_id,
            asset_type=asset_type,
            status="pending",
            generation_params=generation_params
        )
        db.add(asset)
        assets.append(asset)
    
    await db.commit()
    return assets


async def create_production_asset_3d(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID,
    generation_params: dict
) -> ProductionAsset:
    """Create 3D production asset."""
    package = await get_design_package(db, package_id, user_id)
    
    # Check if all 6-view assets are completed
    result = await db.execute(
        select(ProductionAsset).where(
            ProductionAsset.design_package_id == package_id,
            ProductionAsset.asset_type.like("6view_%")
        )
    )
    view_assets = result.scalars().all()
    
    if len(view_assets) != 6 or not all(a.status == "completed" for a in view_assets):
        raise ValueError("All 6-view assets must be completed before 3D generation")
    
    asset = ProductionAsset(
        design_package_id=package_id,
        asset_type="3d_model",
        status="pending",
        generation_params=generation_params
    )
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    return asset


async def get_production_assets(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID
) -> list[ProductionAsset]:
    """Get all production assets for a package."""
    await get_design_package(db, package_id, user_id)
    
    result = await db.execute(
        select(ProductionAsset).where(
            ProductionAsset.design_package_id == package_id
        )
    )
    return list(result.scalars().all())


async def retry_production_asset(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID,
    asset_type: str
) -> ProductionAsset:
    """Retry production asset generation."""
    await get_design_package(db, package_id, user_id)
    
    result = await db.execute(
        select(ProductionAsset).where(
            and_(
                ProductionAsset.design_package_id == package_id,
                ProductionAsset.asset_type == asset_type
            )
        )
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise NotFoundException("Asset not found")
    
    if asset.retry_count >= 3:
        raise ValueError("Maximum retry count exceeded")
    
    asset.status = "processing"
    asset.retry_count += 1
    asset.error_message = None
    
    await db.commit()
    await db.refresh(asset)
    return asset


async def finalize_package(
    db: AsyncSession,
    package_id: uuid.UUID,
    user_id: uuid.UUID
) -> DesignPackage:
    """Finalize a design package."""
    package = await get_design_package(db, package_id, user_id)
    package.status = "completed"
    await db.commit()
    await db.refresh(package)
    return package
