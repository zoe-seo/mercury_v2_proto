from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid

from app.models.canvas_project import CanvasProject
from app.models.canvas_layer import CanvasLayer
from app.schemas.canvas import (
    CanvasProjectCreate,
    CanvasProjectUpdate,
    CanvasLayerCreate,
    CanvasLayerUpdate
)
from app.core.exceptions import NotFoundException, ForbiddenException


async def get_canvas_projects(
    db: AsyncSession,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20
) -> list[CanvasProject]:
    """Get list of canvas projects for a user."""
    result = await db.execute(
        select(CanvasProject)
        .where(
            CanvasProject.user_id == user_id,
            CanvasProject.is_deleted == False
        )
        .order_by(CanvasProject.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def create_canvas_project(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: CanvasProjectCreate
) -> CanvasProject:
    """Create a new canvas project."""
    canvas_project = CanvasProject(
        user_id=user_id,
        name=data.name,
        project_id=data.project_id,
        canvas_state={"viewport": {"x": 0, "y": 0, "zoom": 1.0}}
    )
    db.add(canvas_project)
    await db.commit()
    await db.refresh(canvas_project)
    return canvas_project


async def get_canvas_project(
    db: AsyncSession,
    canvas_id: uuid.UUID,
    user_id: uuid.UUID
) -> CanvasProject:
    """Get a canvas project by ID."""
    result = await db.execute(
        select(CanvasProject)
        .where(
            CanvasProject.id == canvas_id,
            CanvasProject.is_deleted == False
        )
    )
    canvas_project = result.scalar_one_or_none()
    
    if not canvas_project:
        raise NotFoundException("Canvas project not found")
    
    if canvas_project.user_id != user_id:
        raise ForbiddenException("Access denied")
    
    return canvas_project


async def get_canvas_layers(
    db: AsyncSession,
    canvas_id: uuid.UUID
) -> list[CanvasLayer]:
    """Get all layers for a canvas project."""
    result = await db.execute(
        select(CanvasLayer)
        .where(CanvasLayer.canvas_project_id == canvas_id)
        .order_by(CanvasLayer.z_index)
    )
    return list(result.scalars().all())


async def update_canvas_project(
    db: AsyncSession,
    canvas_id: uuid.UUID,
    user_id: uuid.UUID,
    data: CanvasProjectUpdate
) -> CanvasProject:
    """Update canvas project state."""
    canvas_project = await get_canvas_project(db, canvas_id, user_id)
    
    if data.canvas_state is not None:
        canvas_project.canvas_state = data.canvas_state
    
    await db.commit()
    await db.refresh(canvas_project)
    return canvas_project


async def create_canvas_layer(
    db: AsyncSession,
    canvas_id: uuid.UUID,
    user_id: uuid.UUID,
    data: CanvasLayerCreate
) -> CanvasLayer:
    """Create a new canvas layer."""
    # Verify canvas ownership
    await get_canvas_project(db, canvas_id, user_id)
    
    layer = CanvasLayer(
        canvas_project_id=canvas_id,
        layer_type=data.layer_type,
        layer_data=data.layer_data,
        z_index=data.z_index,
        is_visible=data.is_visible,
        is_locked=data.is_locked,
        opacity=data.opacity
    )
    db.add(layer)
    await db.commit()
    await db.refresh(layer)
    return layer


async def update_canvas_layer(
    db: AsyncSession,
    canvas_id: uuid.UUID,
    layer_id: uuid.UUID,
    user_id: uuid.UUID,
    data: CanvasLayerUpdate
) -> CanvasLayer:
    """Update a canvas layer."""
    # Verify canvas ownership
    await get_canvas_project(db, canvas_id, user_id)
    
    result = await db.execute(
        select(CanvasLayer)
        .where(
            CanvasLayer.id == layer_id,
            CanvasLayer.canvas_project_id == canvas_id
        )
    )
    layer = result.scalar_one_or_none()
    
    if not layer:
        raise NotFoundException("Layer not found")
    
    if data.layer_data is not None:
        layer.layer_data = data.layer_data
    if data.is_visible is not None:
        layer.is_visible = data.is_visible
    if data.is_locked is not None:
        layer.is_locked = data.is_locked
    if data.opacity is not None:
        layer.opacity = data.opacity
    
    await db.commit()
    await db.refresh(layer)
    return layer


async def delete_canvas_layer(
    db: AsyncSession,
    canvas_id: uuid.UUID,
    layer_id: uuid.UUID,
    user_id: uuid.UUID
) -> None:
    """Delete a canvas layer."""
    # Verify canvas ownership
    await get_canvas_project(db, canvas_id, user_id)
    
    result = await db.execute(
        select(CanvasLayer)
        .where(
            CanvasLayer.id == layer_id,
            CanvasLayer.canvas_project_id == canvas_id
        )
    )
    layer = result.scalar_one_or_none()
    
    if not layer:
        raise NotFoundException("Layer not found")
    
    await db.delete(layer)
    await db.commit()
