import pytest
import uuid


@pytest.mark.asyncio
async def test_create_project(client):
    """Test creating a project."""
    # First signup to get a token
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "project_user@example.com",
            "password": "testpassword123",
            "name": "Project User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a project
    response = await client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "My First Project",
            "description": "A test project"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My First Project"
    assert data["description"] == "A test project"
    assert "id" in data
    assert "user_id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_projects_pagination(client):
    """Test getting projects with pagination."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "pagination_user@example.com",
            "password": "testpassword123",
            "name": "Pagination User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create multiple projects
    for i in range(5):
        await client.post(
            "/api/v1/projects/",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "name": f"Project {i+1}",
                "description": f"Description {i+1}"
            }
        )
    
    # Get first page
    response = await client.get(
        "/api/v1/projects/?page=1&page_size=3",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 3
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["page_size"] == 3
    assert data["pagination"]["total_items"] == 5
    assert data["pagination"]["total_pages"] == 2
    
    # Get second page
    response = await client.get(
        "/api/v1/projects/?page=2&page_size=3",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2  # Remaining items


@pytest.mark.asyncio
async def test_get_project_by_id(client):
    """Test getting a project by ID."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "getproject_user@example.com",
            "password": "testpassword123",
            "name": "Get Project User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a project
    create_response = await client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Project",
            "description": "Test Description"
        }
    )
    project_id = create_response.json()["id"]
    
    # Get the project
    response = await client.get(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == project_id
    assert data["name"] == "Test Project"


@pytest.mark.asyncio
async def test_update_project(client):
    """Test updating a project."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "update_user@example.com",
            "password": "testpassword123",
            "name": "Update User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a project
    create_response = await client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Original Name",
            "description": "Original Description"
        }
    )
    project_id = create_response.json()["id"]
    
    # Update the project
    response = await client.put(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Updated Name",
            "description": "Updated Description"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "Updated Description"


@pytest.mark.asyncio
async def test_delete_project_soft_delete(client):
    """Test soft delete of a project."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "delete_user@example.com",
            "password": "testpassword123",
            "name": "Delete User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a project
    create_response = await client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "To Be Deleted",
            "description": "This will be deleted"
        }
    )
    project_id = create_response.json()["id"]
    
    # Delete the project
    response = await client.delete(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 204
    
    # Try to get the deleted project - should return 404
    response = await client.get(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_project_not_found(client):
    """Test accessing non-existent project."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "notfound_user@example.com",
            "password": "testpassword123",
            "name": "Not Found User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Try to get non-existent project
    fake_id = str(uuid.uuid4())
    response = await client.get(
        f"/api/v1/projects/{fake_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_unauthorized_project_access(client):
    """Test accessing projects without authentication."""
    response = await client.get("/api/v1/projects/")
    
    assert response.status_code in [401, 403]
