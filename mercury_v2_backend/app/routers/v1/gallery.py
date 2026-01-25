from fastapi import APIRouter
from app.schemas.gallery import GalleryResponse, GalleryItem
from app.schemas.design_brief import DesignBriefBase, ConceptInfoBase, ShoeSpecBase

router = APIRouter()

# Mock Data
MOCK_GALLERY_ITEMS = [
    GalleryItem(
        id="ref-001",
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
        title="Neon Cyberpunk",
        brief_data=DesignBriefBase(
            concept_info=ConceptInfoBase(theme="Cyberpunk", overall_tone="Futuristic"),
            shoe_spec=ShoeSpecBase(category="Running", key_colors=["#FF00FF", "#00FFFF"])
        )
    ),
    GalleryItem(
        id="ref-002",
        image_url="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300&q=80",
        title="Minimalist White",
        brief_data=DesignBriefBase(
            concept_info=ConceptInfoBase(theme="Minimalist", overall_tone="Clean"),
            shoe_spec=ShoeSpecBase(category="Lifestyle", key_colors=["#FFFFFF", "#F0F0F0"])
        )
    ),
    GalleryItem(
        id="ref-003",
        image_url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80",
        title="Retro Chunky",
        brief_data=DesignBriefBase(
            concept_info=ConceptInfoBase(theme="90s Retro", overall_tone="Playful"),
            shoe_spec=ShoeSpecBase(category="Lifestyle", sole_type="Chunky", key_colors=["#FF9900", "#333333"])
        )
    ),
   GalleryItem(
        id="ref-004",
        image_url="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=300&q=80",
        title="Performance Elite",
        brief_data=DesignBriefBase(
            concept_info=ConceptInfoBase(theme="Marathon", overall_tone="Aggressive"),
            shoe_spec=ShoeSpecBase(category="Running", upper_material="Flyknit", key_colors=["#FF3333", "#000000"])
        )
    ),
]

@router.get("/references", response_model=GalleryResponse)
async def get_reference_gallery():
    """
    Get curated reference images for design inspiration.
    """
    return GalleryResponse(
        items=MOCK_GALLERY_ITEMS,
        total=len(MOCK_GALLERY_ITEMS)
    )
