"""Test script to verify Imagen API configuration and connectivity."""
import os
import asyncio
from google import genai

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("dotenv not installed, using environment variables directly")


async def test_imagen_api():
    """Test Imagen API with a simple prompt using google-genai SDK."""

    api_key = os.getenv("GOOGLE_API_KEY")

    print("=" * 60)
    print("Imagen API Configuration Test (google-genai SDK)")
    print("=" * 60)

    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not found in environment")
        print("Please set GOOGLE_API_KEY in your .env file")
        return False

    print(f"[OK] API Key found (length: {len(api_key)} chars)")
    print(f"[OK] API Key preview: {api_key[:10]}...{api_key[-5:]}")

    try:
        # Use Imagen 3 model
        model_name = "imagen-3"
        print(f"\n[OK] Using model: {model_name}")

        # Initialize Google GenAI client
        client = genai.Client(api_key=api_key)

        # Test prompt
        test_prompt = "A simple red sneaker on white background, product photography, studio lighting"
        print(f"[OK] Test prompt: {test_prompt}")
        print("\n[WAIT] Generating image (this may take 10-30 seconds)...")

        # Generate image
        response = client.models.generate_image(
            model=model_name,
            prompt=test_prompt,
        )

        print(f"\n[OK] Response received")

        if response.generated_images and len(response.generated_images) > 0:
            image_count = len(response.generated_images)
            print(f"[OK] Generated {image_count} image(s)")

            # Save first generated image
            generated_image = response.generated_images[0]
            generated_image.image.save('test_imagen_output.png')

            print(f"[OK] Test image saved to: test_imagen_output.png")

            print("\n" + "=" * 60)
            print("[SUCCESS] Imagen API is working correctly")
            print("=" * 60)
            return True
        else:
            print(f"\n[ERROR] No images were generated")
            return False

    except Exception as e:
        print(f"\n[ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

        # Print helpful hints
        if "401" in str(e) or "403" in str(e) or "authentication" in str(e).lower():
            print("\n[INFO] Possible issues:")
            print("  - API key is invalid or expired")
            print("  - Get a new API key from: https://aistudio.google.com/app/apikey")
        elif "400" in str(e):
            print("\n[INFO] Possible issues:")
            print("  - API key might be invalid")
            print("  - Imagen API might not be enabled")
            print("  - Request payload might be incorrect")

        return False


if __name__ == "__main__":
    asyncio.run(test_imagen_api())
