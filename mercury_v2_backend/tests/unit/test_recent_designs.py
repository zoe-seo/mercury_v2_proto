import pytest
from httpx import AsyncClient
import uuid

@pytest.mark.asyncio
async def test_recent_designs(client: AsyncClient, auth_headers):
    """Test getting recent designs."""
    # Create Project
    response = await client.post(
        "/api/v1/projects/",
        headers=auth_headers,
        json={"name": "P1", "description": "Desc1"}
    )
    assert response.status_code == 201
    p1_id = response.json()["id"]
    
    # Create Canvas in Project
    response = await client.post(
        "/api/v1/canvas/instances",
        headers=auth_headers,
        json={"name": "C1", "project_id": p1_id}
    )
    assert response.status_code == 201
    c1_id = response.json()["data"]["id"]
    
    # Create Chat Session in Project
    response = await client.post(
        "/api/v1/chat/sessions",
        headers=auth_headers,
        json={"title": "Chat1", "project_id": p1_id}
    )
    assert response.status_code == 201
    chat_id = response.json()["id"]
    
    # Get Recent Designs
    response = await client.get(
        "/api/v1/projects/recent-designs?limit=10",
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()["data"]
    items = data["items"]
    
    assert len(items) >= 2
    
    # Verify items
    canvas_item = next((i for i in items if i["id"] == c1_id), None)
    chat_item = next((i for i in items if i["id"] == chat_id), None)
    
    assert canvas_item is not None
    assert canvas_item["type"] == "canvas"
    assert canvas_item["project_id"] == p1_id
    assert canvas_item["project_name"] == "P1"
    
    assert chat_item is not None
    assert chat_item["type"] == "chat"
    assert chat_item["project_id"] == p1_id
    assert chat_item["project_name"] == "P1"


@pytest.mark.asyncio
async def test_canvas_list_filter_by_project(client: AsyncClient, auth_headers):
    """Test filtering canvas projects by project_id."""
    # Create P1, P2
    p1 = await client.post("/api/v1/projects/", json={"name": "P1 Filter"}, headers=auth_headers)
    p1_id = p1.json()["id"]
    
    p2 = await client.post("/api/v1/projects/", json={"name": "P2 Filter"}, headers=auth_headers)
    p2_id = p2.json()["id"]
    
    # Create C1 in P1, C2 in P2
    await client.post("/api/v1/canvas/instances", json={"name": "C1 Filter", "project_id": p1_id}, headers=auth_headers)
    await client.post("/api/v1/canvas/instances", json={"name": "C2 Filter", "project_id": p2_id}, headers=auth_headers)
    
    # Filter by P1
    resp = await client.get(f"/api/v1/canvas/instances?project_id={p1_id}", headers=auth_headers)
    assert resp.status_code == 200
    items = resp.json()["data"]["items"]
    # We might get other items from other tests if DB is shared/not cleared, so we search
    c1_found = any(i["name"] == "C1 Filter" for i in items)
    c2_found = any(i["name"] == "C2 Filter" for i in items)
    
    assert c1_found
    assert not c2_found
    
    # Filter by P2
    resp = await client.get(f"/api/v1/canvas/instances?project_id={p2_id}", headers=auth_headers)
    assert resp.status_code == 200
    items = resp.json()["data"]["items"]
    
    c1_found = any(i["name"] == "C1 Filter" for i in items)
    c2_found = any(i["name"] == "C2 Filter" for i in items)
    
    assert c2_found
    assert not c1_found
