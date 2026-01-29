"""Image generation utilities using Google Imagen API."""
from PIL import Image
from io import BytesIO
from google import genai
from app.core.config import get_settings
import httpx
import base64

settings = get_settings()

# Initialize Google GenAI client
_client = None


def _get_client() -> genai.Client:
    """Get or create Google GenAI client."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    return _client


async def generate_image(prompt: str, model_name: str = "imagen-3") -> bytes:
    # 1. AI Studio의 절대 경로 (v1beta 버전 사용)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:predict?key={settings.GOOGLE_API_KEY}"

    # 2. 요청 바디 데이터 (구글 서버가 요구하는 표준 규격)
    payload = {
        "instances": [
            {
                "prompt": prompt
            }
        ],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "1:1",
            "outputMimeType": "image/png"
        }
    }

    try:
        print(f"[DIRECT HTTP] Calling URL: {url.split('key=')[0]}key=HIDDEN")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=60.0)
            
            # 에러 발생 시 로그 확인용
            if response.status_code != 200:
                print(f"[DIRECT HTTP] ❌ Error {response.status_code}: {response.text}")
                return await _generate_mock_image(prompt)

            result = response.json()

            # 3. 응답에서 Base64 이미지 데이터 추출
            # AI Studio 응답 구조: predictions[0]['bytesBase64Encoded']
            if "predictions" in result and len(result["predictions"]) > 0:
                # 필드 이름은 API 버전에 따라 'bytesBase64Encoded' 또는 'image'일 수 있습니다.
                img_data = result["predictions"][0].get("bytesBase64Encoded")
                
                if img_data:
                    print(f"[DIRECT HTTP] ✅ Successfully received image from server")
                    return base64.b64decode(img_data)
            
            raise ValueError("No image data in response")

    except Exception as e:
        print(f"[DIRECT HTTP] ❌ Exception: {str(e)}")
        return await _generate_mock_image(prompt)

async def _generate_mock_image(prompt: str) -> bytes:
    """
    Generate mock placeholder image as fallback.

    Args:
        prompt: Text prompt

    Returns:
        Image bytes (PNG format)
    """
    from PIL import ImageDraw, ImageFont
    import random

    print(f"[MOCK IMAGE] Generating mock image with prompt: {prompt[:50]}...")

    width, height = 800, 600

    # Random pastel background color
    bg_color = (
        random.randint(220, 245),
        random.randint(220, 245),
        random.randint(220, 245)
    )

    # Create image
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Add title
    title = "MOCK SNEAKER DESIGN"
    draw.text((width // 2, 50), title, fill=(80, 80, 80), anchor="mm", font=None)

    # Add prompt text
    prompt_text = f"{prompt[:150]}"
    lines = []
    max_width = width - 100

    # Wrap text manually
    words = prompt_text.split()
    current_line = ""
    for word in words:
        test_line = current_line + " " + word if current_line else word
        if len(test_line) * 6 < max_width:  # Rough estimate
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word

    if current_line:
        lines.append(current_line)

    # Draw wrapped text
    y_position = height // 2 - (len(lines) * 20)
    for line in lines:
        draw.text((width // 2, y_position), line, fill=(50, 50, 50), anchor="mm", font=None)
        y_position += 25

    # Add decorative elements
    # Sneaker outline (simple shape)
    sneaker_points = [
        (150, 400), (250, 380), (350, 370), (450, 370),
        (550, 380), (620, 400), (600, 450), (200, 450)
    ]
    draw.polygon(sneaker_points, outline=(100, 100, 100), width=3)

    # Add border
    draw.rectangle([(20, 20), (width-20, height-20)], outline=(150, 150, 150), width=4)

    # Convert to bytes
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    image_bytes = buffer.getvalue()

    print(f"[MOCK IMAGE] Successfully generated mock image ({len(image_bytes)} bytes)")

    return image_bytes


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
    # Use the prompt directly without modification
    return await generate_image(prompt)

