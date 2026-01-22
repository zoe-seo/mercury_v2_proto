import pytest


@pytest.mark.asyncio
async def test_create_session(client):
    """Test creating a chat session."""
    # First signup to get a token
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "chat_user@example.com",
            "password": "testpassword123",
            "name": "Chat User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a chat session
    response = await client.post(
        "/api/v1/chat/sessions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "My First Design Session"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My First Design Session"
    assert data["session_state"] == "interview"
    assert "id" in data
    assert "user_id" in data


@pytest.mark.asyncio
async def test_get_sessions_pagination(client):
    """Test getting sessions with pagination."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "sessions_user@example.com",
            "password": "testpassword123",
            "name": "Sessions User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create multiple sessions
    for i in range(5):
        await client.post(
            "/api/v1/chat/sessions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "title": f"Session {i+1}"
            }
        )
    
    # Get first page
    response = await client.get(
        "/api/v1/chat/sessions?page=1&page_size=3",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 3
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["total_items"] == 5
    assert data["pagination"]["total_pages"] == 2


@pytest.mark.asyncio
async def test_update_session(client):
    """Test updating a chat session."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "update_session_user@example.com",
            "password": "testpassword123",
            "name": "Update Session User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a session
    create_response = await client.post(
        "/api/v1/chat/sessions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Original Title"
        }
    )
    session_id = create_response.json()["id"]
    
    # Update the session
    response = await client.put(
        f"/api/v1/chat/sessions/{session_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Updated Title",
            "session_state": "outline_selection",
            "preferences": {
                "target_audience": "20-30대",
                "colors": ["#000000", "#FFFFFF"]
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["session_state"] == "outline_selection"
    assert data["preferences"]["target_audience"] == "20-30대"


@pytest.mark.asyncio
async def test_create_message(client):
    """Test creating a chat message."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "message_user@example.com",
            "password": "testpassword123",
            "name": "Message User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a session
    session_response = await client.post(
        "/api/v1/chat/sessions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Session"
        }
    )
    session_id = session_response.json()["id"]
    
    # Create a message
    response = await client.post(
        f"/api/v1/chat/sessions/{session_id}/messages",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "role": "user",
            "content": "I want to design a modern sneaker"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["role"] == "user"
    assert data["content"] == "I want to design a modern sneaker"
    assert data["sequence_number"] == 1


@pytest.mark.asyncio
async def test_get_messages(client):
    """Test getting messages for a session."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "get_messages_user@example.com",
            "password": "testpassword123",
            "name": "Get Messages User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a session
    session_response = await client.post(
        "/api/v1/chat/sessions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Session"
        }
    )
    session_id = session_response.json()["id"]
    
    # Create multiple messages
    for i in range(3):
        await client.post(
            f"/api/v1/chat/sessions/{session_id}/messages",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "role": "user" if i % 2 == 0 else "assistant",
                "content": f"Message {i+1}"
            }
        )
    
    # Get messages
    response = await client.get(
        f"/api/v1/chat/sessions/{session_id}/messages",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["messages"]) == 3
    # Check sequence order
    assert data["messages"][0]["sequence_number"] == 1
    assert data["messages"][1]["sequence_number"] == 2
    assert data["messages"][2]["sequence_number"] == 3


@pytest.mark.asyncio
async def test_session_not_found(client):
    """Test accessing non-existent session."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "notfound_session_user@example.com",
            "password": "testpassword123",
            "name": "Not Found Session User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Try to get non-existent session
    import uuid
    fake_id = str(uuid.uuid4())
    response = await client.get(
        f"/api/v1/chat/sessions/{fake_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_unauthorized_session_access(client):
    """Test accessing sessions without authentication."""
    response = await client.get("/api/v1/chat/sessions")
    
    assert response.status_code in [401, 403]
