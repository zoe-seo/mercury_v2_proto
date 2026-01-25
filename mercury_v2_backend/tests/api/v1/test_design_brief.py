import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.chat_session import ChatSession
from app.models.canvas_project import CanvasProject

@pytest.mark.asyncio
async def test_create_and_get_design_brief_chat(
    client: AsyncClient, 
    test_db: AsyncSession, 
    auth_headers: dict
):
    # 1. Create a chat session first
    response = await client.post(
        "/api/v1/chat/sessions",
        headers=auth_headers,
        json={"title": "Test Session"}
    )
    assert response.status_code == 201
    session_id = response.json()["data"]["id"]

    # 2. Get Brief (should be 404 initially)
    response = await client.get(
        f"/api/v1/chat/sessions/{session_id}/brief",
        headers=auth_headers
    )
    assert response.status_code == 404

    # 3. Create/Upsert Brief
    brief_data = {
        "concept_info": {"theme": "Test Theme"},
        "shoe_spec": {"category": "Running"},
        "marketing_context": {"season": "2024 SS"}
    }
    response = await client.put(
        f"/api/v1/chat/sessions/{session_id}/brief",
        headers=auth_headers,
        json=brief_data
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["concept_info"]["theme"] == "Test Theme"
    assert data["chat_session_id"] == session_id

    # 4. Get Brief again (should be 200)
    response = await client.get(
        f"/api/v1/chat/sessions/{session_id}/brief",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["data"]["concept_info"]["theme"] == "Test Theme"

@pytest.mark.asyncio
async def test_sync_brief_chat_to_canvas(
    client: AsyncClient,
    test_db: AsyncSession,
    auth_headers: dict
):
    # 1. Create Chat Session and Brief
    chat_resp = await client.post(
        "/api/v1/chat/sessions",
        headers=auth_headers,
        json={"title": "Source Chat"}
    )
    chat_id = chat_resp.json()["data"]["id"]
    
    await client.put(
        f"/api/v1/chat/sessions/{chat_id}/brief",
        headers=auth_headers,
        json={
            "concept_info": {"theme": "Source Theme"},
            "shoe_spec": {"category": "Source Category"}
        }
    )

    # 2. Create Canvas Project
    canvas_resp = await client.post(
        "/api/v1/canvas/instances",
        headers=auth_headers,
        json={"name": "Target Canvas"}
    )
    assert canvas_resp.status_code == 201
    
    # Check if the canvas response wraps ID in 'data'
    canvas_id = canvas_resp.json()["data"]["id"]

    # 3. Sync
    response = await client.post(
        f"/api/v1/canvas/instances/{canvas_id}/brief/sync",
        headers=auth_headers,
        json={"source_chat_session_id": chat_id}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["concept_info"]["theme"] == "Source Theme"
    
    # 4. Verify Canvas Brief persistence
    # Use the correct endpoint /instances/{id}/brief
    get_resp = await client.get(
        f"/api/v1/canvas/instances/{canvas_id}/brief",
        headers=auth_headers
    )
    assert get_resp.status_code == 200
    assert get_resp.json()["data"]["concept_info"]["theme"] == "Source Theme"
