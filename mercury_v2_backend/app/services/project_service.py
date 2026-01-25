from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import uuid
import math

from app.models.project import Project
from app.models.canvas_project import CanvasProject
from app.models.chat_session import ChatSession
from app.schemas.project import ProjectCreate, ProjectUpdate, RecentDesignItem
from app.schemas.pagination import PaginationMeta
from app.core.exceptions import NotFoundException


async def get_recent_designs(
    db: AsyncSession,
    user_id: uuid.UUID,
    limit: int = 10
) -> list[RecentDesignItem]:
    """Get recent designs (canvas and chat sessions) for a user."""
    # Fetch recent canvas projects
    canvas_query = (
        select(CanvasProject)
        .where(
            CanvasProject.user_id == user_id,
            CanvasProject.is_deleted == False
        )
        .order_by(CanvasProject.updated_at.desc())
        .limit(limit)
    )
    canvas_result = await db.execute(canvas_query)
    canvas_items = list(canvas_result.scalars().all())

    # Fetch recent chat sessions
    chat_query = (
        select(ChatSession)
        .where(
            ChatSession.user_id == user_id,
            ChatSession.is_archived == False
        )
        .order_by(ChatSession.updated_at.desc())
        .limit(limit)
    )
    chat_result = await db.execute(chat_query)
    chat_items = list(chat_result.scalars().all())

    # Combine and sort
    all_items = sorted(
        canvas_items + chat_items,
        key=lambda x: x.updated_at,
        reverse=True
    )[:limit]

    # Collect project IDs
    project_ids = {item.project_id for item in all_items if item.project_id}
    
    # Fetch project names
    project_map = {}
    if project_ids:
        project_query = select(Project.id, Project.name).where(Project.id.in_(project_ids))
        project_result = await db.execute(project_query)
        project_map = {p.id: p.name for p in project_result.all()}

    # Convert to schema
    recent_designs = []
    for item in all_items:
        is_canvas = isinstance(item, CanvasProject)
        item_type = "canvas" if is_canvas else "chat"
        
        # Determine description and thumbnail
        description = None
        if not is_canvas:
            # item is ChatSession
            pass
            
        recent_designs.append(
            RecentDesignItem(
                id=item.id,
                type=item_type,
                title=item.name if is_canvas else item.title,
                description=description,
                thumbnail_url=None,
                updated_at=item.updated_at,
                project_id=item.project_id,
                project_name=project_map.get(item.project_id)
            )
        )

    return recent_designs


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
