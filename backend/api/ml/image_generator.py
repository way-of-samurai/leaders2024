import logging
import os
from io import BytesIO

import torch
from PIL import Image
from diffusers import StableDiffusionPipeline, UniPCMultistepScheduler, StableDiffusionLatentUpscalePipeline
from transformers import CLIPVisionModelWithProjection

from api import models
from api.models import Model
from api.s3 import download_to_tmp, fs
from api.services.images import save_image

MAX_SIZE = 512
REFERENCES_SIZE = (512, 512)  # The size of reference images (all images will be resized to this size)

__negative_promt = os.environ.get("NEGATIVE_PROMT", "text, watermark, lowres, low quality, worst quality, deformed, "
                                                    "glitch, low contrast, noisy, saturation, blurry")
__device = os.environ.get("GPU_DEVICE", "cuda:0")
__pipe: StableDiffusionPipeline | None = None
__upscale_pipe: StableDiffusionLatentUpscalePipeline | None = None
__generator = None
__ref_images = None

logger = logging.getLogger(__name__)
logger.setLevel("INFO")


def generate_image(keywords: str, xy: (int, int)) -> models.Image:
    logger.info("Generate image(%s) with keywords: %s", xy, keywords)
    promo = __generate_promo(keywords, xy)
    return save_image("generated_promo.png", promo)


def __generate_promo(promt: str, xy: (int, int)) -> bytes:
    rescale = False
    if any(map(lambda i: i > MAX_SIZE, xy)):
        xy: (int, int) = tuple(map(lambda i: i / 2, xy))
        rescale = True

    image: Image = __pipe(
        prompt=promt,
        negative_prompt=__negative_promt,
        height=xy[0],
        width=xy[1],
        ip_adapter_image=[__ref_images],
        scale=1.0,
        guidance_scale=5,
        num_samples=1,
        num_inference_steps=30,
        generator=__generator,
    ).images[0]

    if rescale:
        image: Image = __upscale_pipe(
            prompt=promt,
            image=image,
            negative_prompt=__negative_promt,
            generator=__generator,
            num_inference_steps=30,
            guidance_scale=0,
        ).images[0]
    image_bytes = BytesIO()
    image.save(image_bytes, format="PNG")
    return image_bytes.getvalue()


def set_weights(weights_path: str, pipe: StableDiffusionPipeline = __pipe):
    weights = download_to_tmp(weights_path)
    pipe.load_lora_weights(os.path.dirname(weights), weight_name=os.path.basename(weights))
    pass


def init_model(model: Model):
    global __generator
    generator = torch.Generator(__device)
    if "SEED" in os.environ:
        generator = generator.manual_seed(int(os.environ["SEED"]))
    __generator = generator
    image_encoder: CLIPVisionModelWithProjection = CLIPVisionModelWithProjection.from_pretrained(
        "h94/IP-Adapter",
        subfolder="models/image_encoder",
        torch_dtype=torch.float16,
    )
    image_encoder.to(__device)

    pipe: StableDiffusionPipeline = StableDiffusionPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        torch_dtype=torch.float16,
        image_encoder=image_encoder,
        variant="fp16",
    )
    pipe.to(__device)
    set_weights(model.weights_path, pipe)
    pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
    pipe.safety_checker = None
    pipe.load_ip_adapter(
        "h94/IP-Adapter",
        subfolder="models",
        weight_name="ip-adapter_sd15.bin",
    )

    # Transfer style
    pipe.set_ip_adapter_scale({
        "up": {"block_1": [1.0, 1.0, 1.0]}
    })

    # Transfer style and composition
    # pipe.set_ip_adapter_scale({
    #   "down": { "block_2": [1.0, 1.0] },
    #   "mid": [1.0],
    #   "up": { "block_1": [1.0, 1.0, 1.0] }
    # })

    pipe.enable_vae_tiling()
    pipe.enable_model_cpu_offload()
    # Uncomment this line if xformers installed for additional optimization
    # pipe.enable_xformers_memory_efficient_attention()

    global __pipe
    __pipe = pipe

    upscale_pipe: StableDiffusionLatentUpscalePipeline = StableDiffusionLatentUpscalePipeline.from_pretrained(
        "stabilityai/sd-x2-latent-upscaler",
        torch_dtype=torch.float16,
    )
    upscale_pipe.to(__device)
    upscale_pipe.enable_vae_tiling()
    upscale_pipe.enable_model_cpu_offload()
    # Uncomment this line if xformers installed for additional optimization
    # upscale_pipe.enable_xformers_memory_efficient_attention()

    global __upscale_pipe
    __upscale_pipe = upscale_pipe

    global __ref_images
    __ref_images = [
        Image.open(BytesIO(fs.read_bytes(png))).resize(REFERENCES_SIZE) for png in
        fs.ls(os.environ["SD_REFERENCES_PATH"])
    ]
