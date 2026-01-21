from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.example import ExampleModel
from app.schemas.example import ExampleCreate, ExampleUpdate
from app.core.exceptions import NotFoundException


async def get_all(db: AsyncSession) -> list[ExampleModel]:
    """Get all examples."""
    result = await db.execute(select(ExampleModel))
    return list(result.scalars().all())


async def get_by_id(db: AsyncSession, example_id: int) -> ExampleModel:
    """Get example by ID."""
    result = await db.execute(
        select(ExampleModel).where(ExampleModel.id == example_id)
    )
    example = result.scalar_one_or_none()
    if not example:
        raise NotFoundException(f"Example with id {example_id} not found")
    return example


async def create(db: AsyncSession, data: ExampleCreate) -> ExampleModel:
    """Create a new example."""
    example = ExampleModel(**data.model_dump())
    db.add(example)
    await db.commit()
    await db.refresh(example)
    return example


async def update(
    db: AsyncSession, 
    example_id: int, 
    data: ExampleUpdate
) -> ExampleModel:
    """Update an example."""
    example = await get_by_id(db, example_id)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(example, field, value)
    
    await db.commit()
    await db.refresh(example)
    return example


async def delete(db: AsyncSession, example_id: int) -> None:
    """Delete an example."""
    example = await get_by_id(db, example_id)
    await db.delete(example)
    await db.commit()
