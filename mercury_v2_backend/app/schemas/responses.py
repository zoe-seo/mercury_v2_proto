from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar('T')


class ErrorDetail(BaseModel):
    """Error detail schema."""
    field: str
    message: str


class ErrorResponse(BaseModel):
    """Standard error response schema."""
    error: dict
    
    @classmethod
    def create(
        cls, 
        code: str, 
        message: str, 
        details: list[ErrorDetail] | None = None
    ) -> "ErrorResponse":
        """Create error response."""
        error_dict = {
            "code": code,
            "message": message
        }
        if details:
            error_dict["details"] = [d.model_dump() for d in details]
        return cls(error=error_dict)


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response schema."""
    data: T
    message: str = "Success"
