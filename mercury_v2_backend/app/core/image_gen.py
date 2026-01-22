"""Image generation utilities - Mock implementation for MVP."""
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import random


async def generate_image(prompt: str, model_name: str = "mock") -> bytes:
    """
    Generate mock image for testing.
    
    In production, this should be replaced with actual image generation API:
    - Google Vertex AI Imagen
    - Stability AI (Stable Diffusion)
    - OpenAI DALL-E
    - etc.
    
    Args:
        prompt: Text prompt for image generation
        model_name: Model name (currently ignored)
    
    Returns:
        Image bytes (PNG format)
    """
    # Create a simple placeholder image with the prompt text
    width, height = 512, 512
    
    # Random background color
    bg_color = (
        random.randint(200, 255),
        random.randint(200, 255),
        random.randint(200, 255)
    )
    
    # Create image
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Add text
    text = f"Mock Image\n\n{prompt[:100]}"
    
    # Simple text drawing (no font file needed)
    text_bbox = draw.textbbox((0, 0), text)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    position = ((width - text_width) // 2, (height - text_height) // 2)
    draw.multiline_text(position, text, fill=(50, 50, 50), align='center')
    
    # Add border
    draw.rectangle([(10, 10), (width-10, height-10)], outline=(100, 100, 100), width=3)
    
    # Convert to bytes
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    return buffer.getvalue()


async def generate_outline_image(prompt: str) -> bytes:
    """
    Generate outline/sketch image.
    
    Args:
        prompt: Text prompt
    
    Returns:
        Image bytes
    """
    outline_prompt = f"[OUTLINE] {prompt}"
    return await generate_image(outline_prompt)


async def generate_rendered_image(prompt: str, base_image: bytes | None = None) -> bytes:
    """
    Generate fully rendered design image.
    
    Args:
        prompt: Text prompt
        base_image: Optional base image for img2img
    
    Returns:
        Image bytes
    """
    rendered_prompt = f"[RENDERED] {prompt}"
    return await generate_image(rendered_prompt)

