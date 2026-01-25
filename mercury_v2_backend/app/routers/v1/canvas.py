from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.deps.db import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.responses import SuccessResponse
from app.schemas.canvas import (
    CanvasProjectCreate,
    CanvasProjectUpdate,
    CanvasProjectResponse,
    CanvasProjectDetailResponse,
    CanvasLayerCreate,
    CanvasLayerUpdate,
    CanvasLayerResponse,
    SegmentationRequest,
    SegmentationResponse,
    SegmentData,
    SketchToImageRequest,
    InpaintingRequest,
    TaskResponse
)
from app.services import canvas_service
from app.core.exceptions import NotFoundException, ForbiddenException

router = APIRouter(prefix="/canvas", tags=["canvas"])


@router.get("/instances", response_model=SuccessResponse[dict])
async def list_canvas_projects(
    project_id: uuid.UUID | None = None,
    page: int = 1,
    page_size: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get list of canvas projects."""
    skip = (page - 1) * page_size
    projects = await canvas_service.get_canvas_projects(
        db, current_user.id, skip, page_size, project_id
    )
    
    return SuccessResponse(
        data={
            "items": [CanvasProjectResponse.model_validate(p) for p in projects],
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": len(projects),  # TODO: Get actual count
                "total_pages": 1
            }
        },
        message="Success"
    )


@router.post("/instances", response_model=SuccessResponse[CanvasProjectResponse], status_code=status.HTTP_201_CREATED)
async def create_canvas_project(
    data: CanvasProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new canvas project."""
    project = await canvas_service.create_canvas_project(db, current_user.id, data)
    return SuccessResponse(
        data=CanvasProjectResponse.model_validate(project),
        message="Success"
    )


@router.get("/instances/{canvas_id}", response_model=SuccessResponse[CanvasProjectDetailResponse])
async def get_canvas_project(
    canvas_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get canvas project details with layers."""
    try:
        project = await canvas_service.get_canvas_project(db, canvas_id, current_user.id)
        layers = await canvas_service.get_canvas_layers(db, canvas_id)
        
        return SuccessResponse(
            data=CanvasProjectDetailResponse(
                id=project.id,
                name=project.name,
                project_id=project.project_id,
                canvas_state=project.canvas_state,
                layers=[CanvasLayerResponse.model_validate(l) for l in layers],
                created_at=project.created_at,
                updated_at=project.updated_at
            ),
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.put("/instances/{canvas_id}", response_model=SuccessResponse[CanvasProjectResponse])
async def update_canvas_project(
    canvas_id: uuid.UUID,
    data: CanvasProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update canvas project state."""
    try:
        project = await canvas_service.update_canvas_project(
            db, canvas_id, current_user.id, data
        )
        return SuccessResponse(
            data=CanvasProjectResponse.model_validate(project),
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/instances/{canvas_id}/layers", response_model=SuccessResponse[CanvasLayerResponse], status_code=status.HTTP_201_CREATED)
async def create_canvas_layer(
    canvas_id: uuid.UUID,
    data: CanvasLayerCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new canvas layer."""
    try:
        layer = await canvas_service.create_canvas_layer(
            db, canvas_id, current_user.id, data
        )
        return SuccessResponse(
            data=CanvasLayerResponse.model_validate(layer),
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.put("/instances/{canvas_id}/layers/{layer_id}", response_model=SuccessResponse[CanvasLayerResponse])
async def update_canvas_layer(
    canvas_id: uuid.UUID,
    layer_id: uuid.UUID,
    data: CanvasLayerUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a canvas layer."""
    try:
        layer = await canvas_service.update_canvas_layer(
            db, canvas_id, layer_id, current_user.id, data
        )
        return SuccessResponse(
            data=CanvasLayerResponse.model_validate(layer),
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/instances/{canvas_id}/segment", response_model=SuccessResponse[SegmentationResponse])
async def segment_image(
    canvas_id: uuid.UUID,
    data: SegmentationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Request smart segmentation (Mock implementation)."""
    try:
        # Verify canvas ownership
        await canvas_service.get_canvas_project(db, canvas_id, current_user.id)
        
        # Mock segmentation response
        mock_segments = [
            SegmentData(
                id="seg-1",
                label="Outsole",
                mask_data={"paths": []},
                color="#FF0000"
            ),
            SegmentData(
                id="seg-2",
                label="Shoelace",
                mask_data={"paths": []},
                color="#00FF00"
            )
        ]
        
        return SuccessResponse(
            data=SegmentationResponse(segments=mock_segments),
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete("/instances/{canvas_id}/layers/{layer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_canvas_layer(
    canvas_id: uuid.UUID,
    layer_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a canvas layer."""
    try:
        await canvas_service.delete_canvas_layer(
            db, canvas_id, layer_id, current_user.id
        )
        return None
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/instances/{canvas_id}/generate", response_model=SuccessResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
async def generate_sketch_to_image(
    canvas_id: uuid.UUID,
    data: SketchToImageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate image from sketch (Mock implementation)."""
    try:
        # Verify canvas ownership
        await canvas_service.get_canvas_project(db, canvas_id, current_user.id)
        
        # Mock task response
        mock_task = TaskResponse(
            task_id=str(uuid.uuid4()),
            status="processing"
        )
        
        return SuccessResponse(data=mock_task, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/instances/{canvas_id}/inpaint", response_model=SuccessResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
async def inpaint_image(
    canvas_id: uuid.UUID,
    data: InpaintingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Inpaint image (Mock implementation)."""
    try:
        # Verify canvas ownership
        await canvas_service.get_canvas_project(db, canvas_id, current_user.id)
        
        # Mock task response
        mock_task = TaskResponse(
            task_id=str(uuid.uuid4()),
            status="processing"
        )
        
        return SuccessResponse(data=mock_task, message="Success")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/instances/{canvas_id}/brief")
async def get_design_brief(
    canvas_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get design brief for a canvas project."""
    from app.services import design_brief_service
    from app.schemas.design_brief import DesignBriefResponse
    
    try:
        brief = await design_brief_service.get_canvas_brief(db, canvas_id, current_user.id)
        return SuccessResponse(
            data=DesignBriefResponse.model_validate(brief),
            message="Success"
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/instances/{canvas_id}/brief")
async def upsert_design_brief(
    canvas_id: uuid.UUID,
    data: dict, # Using dict to allow local import of schema
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upsert design brief for a canvas project."""
    from app.services import design_brief_service
    from app.schemas.design_brief import DesignBriefUpdate, DesignBriefResponse
    
    try:
        update_data = DesignBriefUpdate(**data)
        brief = await design_brief_service.upsert_canvas_brief(
            db, canvas_id, current_user.id, update_data
        )
        return SuccessResponse(
            data=DesignBriefResponse.model_validate(brief),
            message="Success"
        )
    except ValueError:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid data")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/instances/{canvas_id}/brief/sync")
async def sync_brief_from_chat(
    canvas_id: uuid.UUID,
    data: dict, # Expects DesignBriefSync
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sync brief from chat session to canvas."""
    from app.services import design_brief_service
    from app.schemas.design_brief import DesignBriefResponse, DesignBriefSync
    
    try:
        sync_data = DesignBriefSync(**data)
        brief = await design_brief_service.sync_brief_to_canvas(
            db, canvas_id, sync_data.source_chat_session_id, current_user.id
        )
        return SuccessResponse(
            data=DesignBriefResponse.model_validate(brief),
            message="Success"
        )
    except ValueError:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid data")
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
