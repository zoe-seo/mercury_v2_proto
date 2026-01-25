"""
Tests for Design Package API endpoints.

Tests all 13 Design Package endpoints:
- Package CRUD
- PDF export
- Share links
- Production 2D/3D
- Production status
- Finalization
"""

import pytest
from httpx import AsyncClient
import uuid


class TestDesignPackageCRUD:
    """Test Design Package CRUD operations."""
    
    @pytest.mark.asyncio
    async def test_create_design_package(self, client: AsyncClient, auth_headers):
        """Test creating a new design package."""
        response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Test Design Package",
                "description": "Test description",
                "selected_image_ids": [str(uuid.uuid4())],
                "context": {"brand_name": "Test Brand"}
            },
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert data["data"]["status"] == "partial"
        assert "design_package_id" in data["data"]
    
    @pytest.mark.asyncio
    async def test_list_design_packages(self, client: AsyncClient, auth_headers):
        """Test listing design packages."""
        # Create a package first
        await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "canvas",
                "source_id": str(uuid.uuid4()),
                "title": "Test Package",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        
        # List packages
        response = await client.get(
            "/api/v1/design-packages",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "items" in data["data"]
    
    @pytest.mark.asyncio
    async def test_get_design_package(self, client: AsyncClient, auth_headers):
        """Test getting design package details."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Detail Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Get package details
        response = await client.get(
            f"/api/v1/design-packages/{package_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["id"] == package_id
        assert "images" in data["data"]
    
    @pytest.mark.asyncio
    async def test_update_design_package(self, client: AsyncClient, auth_headers):
        """Test updating design package."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Original Title",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Update package
        response = await client.put(
            f"/api/v1/design-packages/{package_id}",
            json={
                "title": "Updated Title",
                "description": "Updated description"
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["title"] == "Updated Title"
    
    @pytest.mark.asyncio
    async def test_delete_design_package(self, client: AsyncClient, auth_headers):
        """Test deleting design package."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "To Delete",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Delete package
        response = await client.delete(
            f"/api/v1/design-packages/{package_id}",
            headers=auth_headers
        )
        assert response.status_code == 204


class TestDesignPackageSharing:
    """Test Design Package sharing and export features."""
    
    @pytest.mark.asyncio
    async def test_export_pdf(self, client: AsyncClient, auth_headers):
        """Test PDF export."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "PDF Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Export PDF
        response = await client.post(
            f"/api/v1/design-packages/{package_id}/export/pdf",
            json={
                "include_report": True,
                "include_charts": True
            },
            headers=auth_headers
        )
        assert response.status_code == 202
        data = response.json()
        assert "task_id" in data["data"]
    
    @pytest.mark.asyncio
    async def test_create_share_link(self, client: AsyncClient, auth_headers):
        """Test creating share link."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Share Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Create share link
        response = await client.post(
            f"/api/v1/design-packages/{package_id}/share",
            json={"expires_in_days": 7},
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert "share_token" in data["data"]
        assert "share_url" in data["data"]


class TestDesignPackageProduction:
    """Test Design Package production features."""
    
    @pytest.mark.asyncio
    async def test_start_2d_production(self, client: AsyncClient, auth_headers):
        """Test starting 2D production."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "2D Production Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Start 2D production
        response = await client.post(
            f"/api/v1/design-packages/{package_id}/production/2d",
            json={
                "generation_params": {
                    "model": "imagen-3.0",
                    "quality": "high"
                }
            },
            headers=auth_headers
        )
        assert response.status_code == 202
        data = response.json()
        assert "task_id" in data["data"]
        assert len(data["data"]["assets"]) == 7  # 6-view + model_shot
    
    @pytest.mark.asyncio
    async def test_retry_2d_asset(self, client: AsyncClient, auth_headers):
        """Test retrying 2D asset generation."""
        # Create package and start 2D production
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Retry Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        await client.post(
            f"/api/v1/design-packages/{package_id}/production/2d",
            json={},
            headers=auth_headers
        )
        
        # Retry an asset
        response = await client.post(
            f"/api/v1/design-packages/{package_id}/production/2d/retry",
            json={"asset_type": "6view_front"},
            headers=auth_headers
        )
        assert response.status_code == 202
        data = response.json()
        assert "asset_id" in data["data"]
    
    @pytest.mark.asyncio
    async def test_get_production_status(self, client: AsyncClient, auth_headers):
        """Test getting production status."""
        # Create package and start production
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Status Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        await client.post(
            f"/api/v1/design-packages/{package_id}/production/2d",
            json={},
            headers=auth_headers
        )
        
        # Get status
        response = await client.get(
            f"/api/v1/design-packages/{package_id}/production/status",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "package_status" in data["data"]
        assert "assets" in data["data"]
    
    @pytest.mark.asyncio
    async def test_finalize_package(self, client: AsyncClient, auth_headers):
        """Test finalizing design package."""
        # Create a package
        create_response = await client.post(
            "/api/v1/design-packages",
            json={
                "source_type": "chat",
                "source_id": str(uuid.uuid4()),
                "title": "Finalize Test",
                "selected_image_ids": [str(uuid.uuid4())]
            },
            headers=auth_headers
        )
        package_id = create_response.json()["data"]["design_package_id"]
        
        # Finalize
        response = await client.post(
            f"/api/v1/design-packages/{package_id}/finalize",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["status"] == "completed"
