from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.deps.db import get_db
from app.services import example_service
from app.schemas.example import ExampleCreate, ExampleUpdate, ExampleResponse

router = APIRouter(prefix="/examples", tags=["examples"])


@router.get("/", response_model=list[ExampleResponse])
async def get_examples(db: AsyncSession = Depends(get_db)):
    """Get all examples."""
    return await example_service.get_all(db)


@router.get("/{example_id}", response_model=ExampleResponse)
async def get_example(example_id: int, db: AsyncSession = Depends(get_db)):
    """Get example by ID."""
    return await example_service.get_by_id(db, example_id)


@router.post("/", response_model=ExampleResponse, status_code=201)
async def create_example(
    data: ExampleCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new example."""
    return await example_service.create(db, data)


@router.patch("/{example_id}", response_model=ExampleResponse)
async def update_example(
    example_id: int,
    data: ExampleUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an example."""
    return await example_service.update(db, example_id, data)


@router.delete("/{example_id}", status_code=204)
async def delete_example(example_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an example."""
    await example_service.delete(db, example_id)
