from PIL import Image, ImageDraw, ImageFont
import os

def make_icon(size, path):
    img = Image.new('RGB', (size, size), '#FFB6C1')
    draw = ImageDraw.Draw(img)
    # Try to use a font for emoji, fall back to a simple circle if no emoji support
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", int(size * 0.55))
    except Exception:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", int(size * 0.55))
        except Exception:
            font = None
    text = "🍼"
    if font:
        bbox = draw.textbbox((0, 0), text, font=font)
        x = (size - (bbox[2] - bbox[0])) / 2 - bbox[0]
        y = (size - (bbox[3] - bbox[1])) / 2 - bbox[1]
        draw.text((x, y), text, font=font, embedded_color=True)
    else:
        pad = size // 5
        draw.ellipse([pad, pad, size - pad, size - pad], fill='white')
    img.save(path, 'PNG')
    print(f"Created {path}")

os.makedirs(os.path.dirname(__file__) or '.', exist_ok=True)
make_icon(192, 'icon-192.png')
make_icon(512, 'icon-512.png')
