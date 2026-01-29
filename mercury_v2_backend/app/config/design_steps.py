"""Design workflow step definitions."""

# Widget option data
OUTLINE_OPTIONS = [
    {
        "id": "out_01",
        "label": "Sleek Runner",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
    },
    {
        "id": "out_02",
        "label": "Chunky Trainer",
        "image_url": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300&q=80"
    },
    {
        "id": "out_03",
        "label": "Retro Classic",
        "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80"
    }
]

SOLE_OPTIONS = [
    {
        "id": "sole_01",
        "label": "Boost Foam",
        "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=300&q=80"
    },
    {
        "id": "sole_02",
        "label": "Rubber Grip",
        "image_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=300&q=80"
    }
]

TARGET_OPTIONS = [
    {"id": "men", "label": "Men"},
    {"id": "women", "label": "Women"},
    {"id": "unisex", "label": "Unisex"}
]

STYLE_OPTIONS = [
    {"id": "sporty", "label": "Sporty"},
    {"id": "casual", "label": "Casual"},
    {"id": "luxury", "label": "Luxury"},
    {"id": "streetwear", "label": "Streetwear"},
    {"id": "minimal", "label": "Minimalist"}
]


# Design workflow steps configuration
DESIGN_STEPS = [
    {
        "name": "target",
        "required_field": "target_user",
        "widget_type": "chip_group",
        "options": TARGET_OPTIONS,
        "system_instruction": """The user has started a shoe design session.
Now guide them to select the TARGET AUDIENCE for their shoe.

Context:
- User's previous input: {user_input}
- Current shoe spec: {shoe_spec}

Your response should:
1. Acknowledge their input naturally
2. Guide them to select a target audience (Men, Women, or Unisex)
3. Keep it brief (1-2 sentences, conversational Korean)

Example: "좋은 아이디어네요! 먼저 누구를 위한 신발인지 골라주세요."
"""
    },
    {
        "name": "outline",
        "required_field": "outline_id",
        "widget_type": "selection_card",
        "options": OUTLINE_OPTIONS,
        "system_instruction": """The user selected target audience: {target_user}.
Now guide them to select a BASE SILHOUETTE (outline).

Context:
- User's previous input: {user_input}
- Current shoe spec: {shoe_spec}

Your response should:
1. Acknowledge their target selection
2. Guide them to choose a base silhouette
3. Keep it brief (1-2 sentences, conversational Korean)

Example: "{target_user}용으로 좋은 선택이에요. 이제 기본이 될 실루엣을 골라주세요."
"""
    },
    {
        "name": "sole",
        "required_field": "sole_id",
        "widget_type": "selection_card",
        "options": SOLE_OPTIONS,
        "system_instruction": """The user selected outline: {outline_id}.
Now guide them to select a SOLE type.

Context:
- User's previous input: {user_input}
- Current shoe spec: {shoe_spec}

Your response should:
1. Compliment their outline choice naturally
2. Guide them to pick a sole
3. Keep it brief (1-2 sentences, conversational Korean)

Example: "{outline_id} 실루엣 좋네요! 이제 밑창을 골라볼까요?"
"""
    },
    {
        "name": "style",
        "required_field": "style_keywords",
        "widget_type": "chip_group",
        "options": STYLE_OPTIONS,
        "system_instruction": """The user selected outline and sole.
Now guide them to select a STYLE/MOOD.

Context:
- User's previous input: {user_input}
- Current shoe spec: {shoe_spec}

Your response should:
1. Acknowledge their progress
2. Guide them to select a style mood
3. Keep it brief (1-2 sentences, conversational Korean)

Example: "좋습니다! 어떤 스타일로 갈까요?"
"""
    },
    {
        "name": "result",
        "required_field": None,  # Final step, no selection needed
        "widget_type": "generation_result",
        "options": None,
        "system_instruction": """All selections are complete. The design is being generated.

Context:
- User's previous input: {user_input}
- Final shoe spec: {shoe_spec}

Your response should:
1. Congratulate them on completing all selections
2. Inform them the design is being generated
3. Keep it brief (1-2 sentences, conversational Korean)

Example: "모든 선택이 완료되었어요! 지금 디자인을 생성하고 있습니다..."
"""
    }
]


def get_next_step(shoe_spec: dict) -> dict | None:
    """
    Determine the next step based on current shoe spec.

    Args:
        shoe_spec: Dictionary containing current design selections

    Returns:
        Next step configuration dict, or None if all steps complete
    """
    for step in DESIGN_STEPS:
        # Skip result step for now
        if step["name"] == "result":
            continue

        required_field = step["required_field"]
        if required_field and not shoe_spec.get(required_field):
            return step

    # All steps complete, return result step
    return next((s for s in DESIGN_STEPS if s["name"] == "result"), None)
