"""Celery tasks for image generation."""
from app.celery_app import celery_app
from app.core.image_gen import generate_outline_image, generate_rendered_image
from app.core.storage import upload_image, get_image_url
from app.core.database import async_session_maker
from app.models.generated_image import GeneratedImage
from sqlalchemy import select
import uuid


@celery_app.task(bind=True, name="generate_outline_images")
def generate_outline_images_task(self, session_id: str, prompt: str, count: int = 4):
    """
    Generate outline images asynchronously.
    
    Args:
        session_id: Chat session ID
        prompt: Text prompt for generation
        count: Number of images to generate
    
    Returns:
        List of generated image IDs
    """
    import asyncio
    
    async def _generate():
        image_ids = []
        
        for i in range(count):
            try:
                # Update task progress
                self.update_state(
                    state='PROGRESS',
                    meta={'current': i + 1, 'total': count, 'status': f'Generating image {i+1}/{count}'}
                )
                
                # Generate image
                image_data = await generate_outline_image(prompt)
                
                # Upload to MinIO
                object_name = upload_image(image_data, filename=f"{uuid.uuid4()}.png")
                image_url = get_image_url(object_name)
                
                # Save to database
                async with async_session_maker() as db:
                    generated_image = GeneratedImage(
                        session_id=uuid.UUID(session_id),
                        image_url=image_url,
                        prompt=prompt,
                        image_type="outline",
                        generation_params={"model": "imagen-3.0", "index": i}
                    )
                    db.add(generated_image)
                    await db.commit()
                    await db.refresh(generated_image)
                    image_ids.append(str(generated_image.id))
                    
            except Exception as e:
                print(f"Error generating image {i+1}: {e}")
                # Continue with next image
                continue
        
        return image_ids
    
    # Run async function
    loop = asyncio.get_event_loop()
    if loop.is_running():
        # If loop is already running, create new one
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    result = loop.run_until_complete(_generate())
    return result


@celery_app.task(bind=True, name="generate_design_image")
def generate_design_image_task(
    self,
    session_id: str,
    prompt: str,
    selected_outline_id: str | None = None,
    generation_params: dict | None = None
):
    """
    Generate final design image asynchronously.
    
    Args:
        session_id: Chat session ID
        prompt: Text prompt for generation
        selected_outline_id: Optional outline image ID to use as base
        generation_params: Optional generation parameters
    
    Returns:
        Generated image ID
    """
    import asyncio
    
    async def _generate():
        try:
            # Update task progress
            self.update_state(
                state='PROGRESS',
                meta={'status': 'Generating design image...'}
            )
            
            # Get base image if outline is selected
            base_image = None
            if selected_outline_id:
                async with async_session_maker() as db:
                    result = await db.execute(
                        select(GeneratedImage).where(
                            GeneratedImage.id == uuid.UUID(selected_outline_id)
                        )
                    )
                    outline = result.scalar_one_or_none()
                    if outline:
                        # TODO: Download base image from MinIO
                        pass
            
            # Generate image
            image_data = await generate_rendered_image(prompt, base_image)
            
            # Upload to MinIO
            object_name = upload_image(image_data, filename=f"{uuid.uuid4()}.png")
            image_url = get_image_url(object_name)
            
            # Save to database
            async with async_session_maker() as db:
                generated_image = GeneratedImage(
                    session_id=uuid.UUID(session_id),
                    image_url=image_url,
                    prompt=prompt,
                    image_type="rendered",
                    generation_params=generation_params or {}
                )
                db.add(generated_image)
                await db.commit()
                await db.refresh(generated_image)
                return str(generated_image.id)
                
        except Exception as e:
            print(f"Error generating design image: {e}")
            raise
    
    # Run async function
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    result = loop.run_until_complete(_generate())
    return result
