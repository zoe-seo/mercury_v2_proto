import pytest


@pytest.mark.asyncio
async def test_signup_success(client):
    """Test successful user signup."""
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "name": "Test User"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "user" in data
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["name"] == "Test User"
    assert data["token_type"] == "Bearer"


@pytest.mark.asyncio
async def test_signup_duplicate_email(client):
    """Test signup with duplicate email."""
    # First signup
    await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "duplicate@example.com",
            "password": "testpassword123",
            "name": "First User"
        }
    )
    
    # Try to signup with same email
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "duplicate@example.com",
            "password": "anotherpassword",
            "name": "Second User"
        }
    )
    
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_login_success(client):
    """Test successful login."""
    # First create a user
    await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "login@example.com",
            "password": "testpassword123",
            "name": "Login User"
        }
    )
    
    # Now login
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "testpassword123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert "access_token" in data
    assert data["user"]["email"] == "login@example.com"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user(client):
    """Test getting current user profile."""
    # First signup to get a token
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "profile@example.com",
            "password": "testpassword123",
            "name": "Profile User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Get current user
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "profile@example.com"
    assert data["name"] == "Profile User"


@pytest.mark.asyncio
async def test_change_password(client):
    """Test password change."""
    # First signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "changepass@example.com",
            "password": "oldpassword123",
            "name": "Change Pass User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Change password
    response = await client.put(
        "/api/v1/auth/password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "oldpassword123",
            "new_password": "newpassword456"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["message"] == "Password updated successfully"
    
    # Try to login with new password
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "changepass@example.com",
            "password": "newpassword456"
        }
    )
    
    assert login_response.status_code == 200


@pytest.mark.asyncio
async def test_unauthorized_access(client):
    """Test accessing protected route without token."""
    response = await client.get("/api/v1/auth/me")
    
    # HTTPBearer returns 403 when no credentials are provided
    assert response.status_code in [401, 403]
