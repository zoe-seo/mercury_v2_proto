"""
Task status endpoints for monitoring Celery task progress.

Provides unified task status checking for all async operations:
- Image generation (Chat)
- Production assets (2D/3D)
- Marketing reports
- PDF exports
"""

from fastapi import APIRouter, Depends, HTTPException, status
from celery.result import AsyncResult
from app.celery_app import celery_app
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/{task_id}/status")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get Celery task status.
    
    Returns current state and progress information for any async task.
    
    Task States:
    - PENDING: Task is waiting to be executed
    - PROGRESS: Task is currently running (includes progress info)
    - SUCCESS: Task completed successfully
    - FAILURE: Task failed with error
    - RETRY: Task is being retried
    
    Args:
        task_id: Celery task ID
        
    Returns:
        dict: Task status, result, and progress information
    """
    task = AsyncResult(task_id, app=celery_app)
    
    response = {
        "task_id": task_id,
        "status": task.state,
        "result": None,
        "progress": None,
        "error": None
    }
    
    if task.state == 'PENDING':
        response["progress"] = {
            "status": "Task is queued and waiting to start"
        }
    elif task.state == 'PROGRESS':
        response["progress"] = task.info
    elif task.state == 'SUCCESS':
        response["result"] = task.result
    elif task.state == 'FAILURE':
        response["error"] = {
            "message": str(task.info),
            "type": type(task.info).__name__
        }
    
    return response
