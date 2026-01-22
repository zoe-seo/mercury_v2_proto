from pydantic import BaseModel


class PaginationParams(BaseModel):
    """Pagination query parameters."""
    page: int = 1
    page_size: int = 20
    
    class Config:
        json_schema_extra = {
            "example": {
                "page": 1,
                "page_size": 20
            }
        }


class PaginationMeta(BaseModel):
    """Pagination metadata in response."""
    page: int
    page_size: int
    total_items: int
    total_pages: int
