from pydantic import BaseModel, ConfigDict


class ExampleBase(BaseModel):
    """Base schema for Example."""
    name: str
    description: str | None = None
    is_active: bool = True


class ExampleCreate(ExampleBase):
    """Schema for creating an Example."""
    pass


class ExampleUpdate(BaseModel):
    """Schema for updating an Example."""
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class ExampleResponse(ExampleBase):
    """Schema for Example response."""
    id: int
    
    model_config = ConfigDict(from_attributes=True)
