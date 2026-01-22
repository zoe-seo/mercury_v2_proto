from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import uuid
import math

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.schemas.pagination import PaginationMeta
from app.core.exceptions import NotFoundException


async def get_projects(
    db: AsyncSession,
    user_id: uuid.UUID,
    page: int = 1,
    page_size: int = 20
) -> tuple[list[Project], PaginationMeta]:
    """Get user's projects with pagination."""
    # Validate pagination params
    page = max(1, page)
    page_size = min(max(1, page_size), 100)  # Max 100 items per page
    
    # Count total items
    count_query = select(func.count()).select_from(Project).where(
        Project.user_id == user_id,
        Project.is_deleted == False
    )
    total_items = await db.scalar(count_query) or 0
    
    # Calculate pagination
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
    offset = (page - 1) * page_size
    
    # Get projects
    query = (
        select(Project)
        .where(Project.user_id == user_id, Project.is_deleted == False)
        .order_by(Project.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(query)
    projects = list(result.scalars().all())
    
    pagination = PaginationMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages
    )
    
    return projects, pagination


async def get_project_by_id(
    db: AsyncSession,
    project_id: uuid.UUID,
    user_id: uuid.UUID
) -> Project:
    """Get project by ID."""
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id,
            Project.is_deleted == False
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise NotFoundException(f"Project with id {project_id} not found")
    return project


async def create_project(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: ProjectCreate
) -> Project:
    """Create a new project."""
    project = Project(
        user_id=user_id,
        name=data.name,
        description=data.description
    )
    
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def update_project(
    db: AsyncSession,
    project_id: uuid.UUID,
    user_id: uuid.UUID,
    data: ProjectUpdate
) -> Project:
    """Update a project."""
    project = await get_project_by_id(db, project_id, user_id)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(
    db: AsyncSession,
    project_id: uuid.UUID,
    user_id: uuid.UUID
) -> None:
    """Delete a project (soft delete)."""
    project = await get_project_by_id(db, project_id, user_id)
    project.is_deleted = True
    await db.commit()
