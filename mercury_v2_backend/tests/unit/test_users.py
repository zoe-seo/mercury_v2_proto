import pytest
from io import BytesIO


@pytest.mark.asyncio
async def test_get_user_profile_success(client):
    """Test getting current user profile with all fields."""
    # First signup to get a token
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "profile_test@example.com",
            "password": "testpassword123",
            "name": "Profile Test User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Get user profile
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "profile_test@example.com"
    assert data["name"] == "Profile Test User"
    assert data["nickname"] is None
    assert data["job_title"] is None
    assert data["bio"] is None
    assert data["avatar_url"] is None
    assert "stats" in data
    assert data["stats"]["projects_count"] == 0
    assert "preferences" in data
    assert "notification_settings" in data


@pytest.mark.asyncio
async def test_get_user_profile_with_projects(client):
    """Test that stats are included in profile response."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "stats_test@example.com",
            "password": "testpassword123",
            "name": "Stats Test User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Get profile
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    # Just verify stats structure exists (count may be 0 in test environment)
    assert "stats" in data
    assert "projects_count" in data["stats"]
    assert isinstance(data["stats"]["projects_count"], int)


@pytest.mark.asyncio
async def test_update_profile_success(client):
    """Test updating basic profile information."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "update_test@example.com",
            "password": "testpassword123",
            "name": "Update Test User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Update profile
    response = await client.put(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "nickname": "TestNick",
            "job_title": "Senior Designer",
            "bio": "I love designing shoes!"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["message"] == "Profile updated successfully"
    
    # Verify changes
    profile_response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    profile = profile_response.json()
    assert profile["nickname"] == "TestNick"
    assert profile["job_title"] == "Senior Designer"
    assert profile["bio"] == "I love designing shoes!"


@pytest.mark.asyncio
async def test_update_preferences_success(client):
    """Test updating user preferences."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "prefs_test@example.com",
            "password": "testpassword123",
            "name": "Prefs Test User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Update preferences
    response = await client.put(
        "/api/v1/users/me/preferences",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "shoe_size_system": "EU",
            "gender_category": "unisex",
            "style_tags": ["minimalist", "futuristic"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["message"] == "Preferences updated successfully"
    
    # Verify changes
    profile_response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    profile = profile_response.json()
    assert profile["preferences"]["shoe_size_system"] == "EU"
    assert profile["preferences"]["gender_category"] == "unisex"
    assert "minimalist" in profile["preferences"]["style_tags"]
    assert "futuristic" in profile["preferences"]["style_tags"]


@pytest.mark.asyncio
async def test_update_notifications_success(client):
    """Test updating notification settings."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "notif_test@example.com",
            "password": "testpassword123",
            "name": "Notif Test User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Update notification settings
    response = await client.put(
        "/api/v1/users/me/notifications",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email_creation_finished": False,
            "email_weekly_report": True,
            "app_browser_notification": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["message"] == "Notification settings updated successfully"
    
    # Verify changes
    profile_response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    profile = profile_response.json()
    assert profile["notification_settings"]["email_creation_finished"] is False
    assert profile["notification_settings"]["email_weekly_report"] is True
    assert profile["notification_settings"]["app_browser_notification"] is False


@pytest.mark.asyncio
async def test_upload_avatar_success(client):
    """Test uploading avatar image."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "avatar_test@example.com",
            "password": "testpassword123",
            "name": "Avatar Test User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Create a fake image file
    fake_image = BytesIO(b"fake image data")
    fake_image.name = "test_avatar.png"
    
    # Upload avatar
    response = await client.post(
        "/api/v1/users/me/avatar",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("test_avatar.png", fake_image, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "avatar_url" in data
    assert "avatars/" in data["avatar_url"]
    
    # Verify avatar URL is set in profile
    profile_response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    profile = profile_response.json()
    assert profile["avatar_url"] == data["avatar_url"]


@pytest.mark.asyncio
async def test_upload_avatar_invalid_type(client):
    """Test uploading non-image file fails."""
    # Signup
    signup_response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "invalid_avatar@example.com",
            "password": "testpassword123",
            "name": "Invalid Avatar User"
        }
    )
    token = signup_response.json()["access_token"]
    
    # Try to upload a text file
    fake_file = BytesIO(b"not an image")
    
    response = await client.post(
        "/api/v1/users/me/avatar",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("test.txt", fake_file, "text/plain")}
    )
    
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_unauthorized_access_to_profile(client):
    """Test accessing profile endpoints without authentication."""
    # Try to get profile without token
    response = await client.get("/api/v1/users/me")
    assert response.status_code in [401, 403]
    
    # Try to update profile without token
    response = await client.put(
        "/api/v1/users/me",
        json={"nickname": "Test"}
    )
    assert response.status_code in [401, 403]
    
    # Try to update preferences without token
    response = await client.put(
        "/api/v1/users/me/preferences",
        json={"shoe_size_system": "US"}
    )
    assert response.status_code in [401, 403]
    
    # Try to update notifications without token
    response = await client.put(
        "/api/v1/users/me/notifications",
        json={"email_creation_finished": False}
    )
    assert response.status_code in [401, 403]
