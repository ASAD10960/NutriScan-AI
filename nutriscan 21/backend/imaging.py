"""Upload validation, orientation fix and a lightweight blur/lighting check (Pillow)."""
import base64
import io
import re

from PIL import Image, ImageFilter, ImageOps, ImageStat

import config


class ImageError(Exception):
    def __init__(self, code, message):
        super().__init__(message)
        self.code, self.message = code, message


def decode_data_url(data_url):
    match = re.match(r"^data:([\w/+.-]+);base64,(.+)$", data_url or "", re.S)
    if not match:
        raise ImageError("invalid_image", "The upload wasn't a readable image. Choose a JPG or PNG file.")
    try:
        raw = base64.b64decode(match.group(2), validate=False)
    except (ValueError, TypeError):
        raise ImageError("invalid_image", "The image data is corrupted. Choose the file again.")
    if len(raw) > config.MAX_UPLOAD_BYTES:
        raise ImageError("too_large", f"This image is {len(raw) / 1048576:.1f} MB. The limit is 5 MB.")
    return raw


def load(raw):
    """Validate real image content (not just the extension) and return an upright RGB image."""
    try:
        probe = Image.open(io.BytesIO(raw))
        fmt = probe.format
        probe.verify()
    except Exception:
        raise ImageError("invalid_image", "The file isn't a valid image. Use JPG, PNG or WEBP.")
    if fmt not in config.ALLOWED_FORMATS:
        raise ImageError("unsupported_format", f"{fmt or 'This'} files aren't supported. Use JPG, PNG or WEBP.")
    img = Image.open(io.BytesIO(raw))
    img = ImageOps.exif_transpose(img)
    w, h = img.size
    if min(w, h) < config.MIN_DIMENSION:
        raise ImageError("too_small", f"The image is {w}×{h}px. Use one at least {config.MIN_DIMENSION}px on each side.")
    if max(w, h) > config.MAX_DIMENSION:
        raise ImageError("too_big", f"The image is {w}×{h}px. The maximum is {config.MAX_DIMENSION}px.")
    if img.mode != "RGB":
        background = Image.new("RGB", img.size, (255, 255, 255))
        rgba = img.convert("RGBA")
        background.paste(rgba, mask=rgba.split()[-1])
        img = background
    return img, fmt


def assess(img):
    gray = img.convert("L")
    gray.thumbnail((512, 512))
    stat = ImageStat.Stat(gray)
    brightness = stat.mean[0]
    contrast = stat.stddev[0]
    edges = gray.filter(ImageFilter.FIND_EDGES)
    w, h = edges.size
    edges = edges.crop((3, 3, w - 3, h - 3))          # filter produces false edges at the border
    sharpness = ImageStat.Stat(edges).var[0]

    warnings = []
    score = 100
    if brightness < 45:
        warnings.append("The photo looks dark. Try more light for better recognition.")
        score -= 30
    elif brightness > 225:
        warnings.append("The photo looks overexposed. Avoid direct glare.")
        score -= 20
    if sharpness < 20:
        warnings.append("The photo looks blurry. Hold steady and retake if you can.")
        score -= 35
    if contrast < 20:
        warnings.append("Low contrast makes separate foods hard to tell apart.")
        score -= 15
    score = max(score, 5)
    return {
        "score": score,
        "label": "Good" if score >= 75 else ("Fair" if score >= 50 else "Poor"),
        "brightness": round(brightness),
        "sharpness": round(sharpness),
        "contrast": round(contrast),
        "width": img.size[0],
        "height": img.size[1],
        "warnings": warnings,
    }


def to_jpeg_bytes(img, max_side=None, quality=88):
    out = img.copy()
    if max_side:
        out.thumbnail((max_side, max_side))
    buf = io.BytesIO()
    out.save(buf, "JPEG", quality=quality)
    return buf.getvalue()
