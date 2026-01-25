"""
Tests for Canvas API endpoints.

Tests all 10 Canvas endpoints:
- Canvas project CRUD
- Layer management
- Smart segmentation
- Sketch-to-image generation
- Inpainting
"""

import pytest
from httpx import AsyncClient


class TestCanvasProjects:
    """Test Canvas project CRUD operations."""
    
    @pytest.mark.asyncio
    async def test_create_canvas_project(self, client: AsyncClient, auth_headers):
        """Test creating a new canvas project."""
        response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas", "project_id": None},
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert data["data"]["name"] == "Test Canvas"
        assert "id" in data["data"]
    
    @pytest.mark.asyncio
    async def test_list_canvas_projects(self, client: AsyncClient, auth_headers):
        """Test listing canvas projects."""
        # Create a project first
        await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        
        # List projects
        response = await client.get(
            "/api/v1/canvas/instances",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "items" in data["data"]
        assert len(data["data"]["items"]) > 0
    
    @pytest.mark.asyncio
    async def test_get_canvas_project(self, client: AsyncClient, auth_headers):
        """Test getting canvas project details."""
        # Create a project
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        # Get project details
        response = await client.get(
            f"/api/v1/canvas/instances/{canvas_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["id"] == canvas_id
        assert "layers" in data["data"]
    
    @pytest.mark.asyncio
    async def test_update_canvas_project(self, client: AsyncClient, auth_headers):
        """Test updating canvas state."""
        # Create a project
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        # Update canvas state
        response = await client.put(
            f"/api/v1/canvas/instances/{canvas_id}",
            json={"canvas_state": {"viewport": {"x": 100, "y": 50, "zoom": 1.5}}},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["canvas_state"]["viewport"]["x"] == 100


class TestCanvasLayers:
    """Test Canvas layer operations."""
    
    @pytest.mark.asyncio
    async def test_add_layer(self, client: AsyncClient, auth_headers):
        """Test adding a layer to canvas."""
        # Create a canvas project
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        # Add a layer
        response = await client.post(
            f"/api/v1/canvas/instances/{canvas_id}/layers",
            json={
                "layer_type": "sketch",
                "layer_data": {"paths": []},
                "z_index": 1,
                "is_visible": True,
                "is_locked": False,
                "opacity": 1.0
            },
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert data["data"]["layer_type"] == "sketch"
        assert data["data"]["z_index"] == 1
    
    @pytest.mark.asyncio
    async def test_update_layer(self, client: AsyncClient, auth_headers):
        """Test updating a layer."""
        # Create canvas and layer
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        layer_response = await client.post(
            f"/api/v1/canvas/instances/{canvas_id}/layers",
            json={
                "layer_type": "sketch",
                "layer_data": {"paths": []},
                "z_index": 1
            },
            headers=auth_headers
        )
        layer_id = layer_response.json()["data"]["id"]
        
        # Update layer
        response = await client.put(
            f"/api/v1/canvas/instances/{canvas_id}/layers/{layer_id}",
            json={
                "is_visible": False,
                "is_locked": True,
                "opacity": 0.5
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["is_visible"] is False
        assert data["data"]["is_locked"] is True
        assert data["data"]["opacity"] == 0.5
    
    @pytest.mark.asyncio
    async def test_delete_layer(self, client: AsyncClient, auth_headers):
        """Test deleting a layer."""
        # Create canvas and layer
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        layer_response = await client.post(
            f"/api/v1/canvas/instances/{canvas_id}/layers",
            json={
                "layer_type": "sketch",
                "layer_data": {"paths": []},
                "z_index": 1
            },
            headers=auth_headers
        )
        layer_id = layer_response.json()["data"]["id"]
        
        # Delete layer
        response = await client.delete(
            f"/api/v1/canvas/instances/{canvas_id}/layers/{layer_id}",
            headers=auth_headers
        )
        assert response.status_code == 204


class TestCanvasAIFeatures:
    """Test Canvas AI features (Mock implementations)."""
    
    @pytest.mark.asyncio
    async def test_smart_segmentation(self, client: AsyncClient, auth_headers):
        """Test smart segmentation request."""
        # Create canvas
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        # Request segmentation
        response = await client.post(
            f"/api/v1/canvas/instances/{canvas_id}/segment",
            json={"layer_id": "00000000-0000-0000-0000-000000000000"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "segments" in data["data"]
    
    @pytest.mark.asyncio
    async def test_sketch_to_image(self, client: AsyncClient, auth_headers):
        """Test sketch-to-image generation."""
        # Create canvas
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        # Generate image
        response = await client.post(
            f"/api/v1/canvas/instances/{canvas_id}/generate",
            json={
                "layer_ids": [],
                "prompt": "Test prompt",
                "generation_params": {"strength": 0.7}
            },
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert "task_id" in data["data"]
        assert data["data"]["status"] == "processing"
    
    @pytest.mark.asyncio
    async def test_inpainting(self, client: AsyncClient, auth_headers):
        """Test inpainting request."""
        # Create canvas
        create_response = await client.post(
            "/api/v1/canvas/instances",
            json={"name": "Test Canvas"},
            headers=auth_headers
        )
        canvas_id = create_response.json()["data"]["id"]
        
        # Request inpainting
        response = await client.post(
            f"/api/v1/canvas/instances/{canvas_id}/inpaint",
            json={
                "layer_id": "00000000-0000-0000-0000-000000000000",
                "mask_data": {"paths": []},
                "prompt": "Test inpainting"
            },
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert "task_id" in data["data"]
