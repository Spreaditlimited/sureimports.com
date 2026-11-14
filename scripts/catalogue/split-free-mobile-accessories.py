from __future__ import annotations

import argparse
from collections import Counter
from io import BytesIO
from pathlib import Path
import json
import math
import re

import fitz
from PIL import Image, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas


parser = argparse.ArgumentParser(description='Split the 131-page mobile accessories supplier quotation into RMB-only product catalogs.')
parser.add_argument('source', type=Path, help='Original 131-page supplier PDF')
parser.add_argument('output', type=Path, help='Directory for the PDFs, covers, and manifest')
args = parser.parse_args()
SOURCE = args.source
OUTPUT = args.output
OUTPUT.mkdir(parents=True, exist_ok=True)

GROUPS = [
    dict(slug='phone-cases', title='Phone Cases', subtitle='Decorative cases and compatible models', pages=(1, 34), coverXref=43),
    dict(slug='charging-cables', title='Cables & Connectors', subtitle='Charging, data and connection options', pages=(35, 68)),
    dict(slug='screen-protectors', title='Screen Protectors', subtitle='Glass and protective film options', pages=(69, 72)),
    dict(slug='car-chargers', title='Car Chargers', subtitle='In-car charging options', pages=(73, 76)),
    dict(slug='wall-chargers', title='Wall Chargers', subtitle='Travel and wall charging options', pages=(77, 87)),
    dict(slug='earphones-headphones', title='Earphones & Headphones', subtitle='Wired and wireless listening', pages=(88, 110)),
    dict(slug='phone-holders', title='Phone Holders', subtitle='Magnetic stands for phones and tablets', rows=[(111, 1), (111, 2)]),
    dict(slug='portable-speakers', title='Portable Speakers', subtitle='Compact wireless audio', pages=(114, 118), rows=[(125, 5)]),
    dict(slug='microphones', title='Microphones', subtitle='Wireless and clip-on audio', rows=[(119, 1), (124, 3), (124, 4), (124, 5)]),
    dict(slug='wireless-chargers', title='Wireless Chargers', subtitle='Magnetic and multi-device charging', rows=[(119, 2), (121, 3), (121, 4), (123, 5), (125, 6), (126, 1), (126, 2), (126, 3), (130, 1), (130, 2)]),
    dict(slug='smart-watches', title='Smart Watches', subtitle='Wearable styles and specifications', coverRow=(129, 1), rows=[(119, 3), (119, 4), (122, 2), (123, 6), *[(129, n) for n in range(1, 7)]]),
    dict(slug='phone-carry-accessories', title='Phone Carry Accessories', subtitle='Lanyards and card holders', rows=[(119, 5), *[(120, n) for n in range(1, 5)], (125, 3), (125, 4)]),
    dict(slug='stylus-pens', title='Stylus Pens', subtitle='Capacitive pens for touch screens', rows=[(121, 1), (121, 2)]),
    dict(slug='wifi-routers', title='Wi-Fi Routers', subtitle='Dual-band home network options', rows=[(121, 5), (121, 6)]),
    dict(slug='security-cameras', title='Security Cameras', subtitle='Wi-Fi monitoring camera', rows=[(122, 1)]),
    dict(slug='mini-projectors', title='Mini Projectors', subtitle='Decorative nebula projection', rows=[(122, 3)]),
    dict(slug='bluetooth-trackers', title='Bluetooth Trackers', subtitle='Compact anti-loss device', rows=[(122, 4)]),
    dict(slug='game-controllers', title='Game Controllers', subtitle='Handheld and mobile controllers', rows=[(122, 5), (122, 6), *[(123, n) for n in range(1, 5)]]),
    dict(slug='computer-mice', title='Computer Mice', subtitle='Mice and desk accessories', rows=[(124, 1), (124, 2), (125, 1), (125, 2), *[(131, n) for n in range(1, 6)]]),
    dict(slug='gaming-keyboards', title='Gaming Keyboards', subtitle='Illuminated desktop input', rows=[(130, 5)]),
    dict(slug='mini-fans', title='Mini Fans', subtitle='Portable and desk cooling', rows=[(126, 6), (127, 1), (130, 3)]),
    dict(slug='desk-lamps', title='Desk Lamps', subtitle='Compact lighting for work and home', rows=[(126, 4), (126, 5), (130, 4)]),
    dict(slug='watch-bands', title='Watch Bands', subtitle='Straps in multiple materials and sizes', rows=[*[(127, n) for n in range(2, 7)], *[(128, n) for n in range(1, 4)]]),
]


def ngn_column(page_number: int) -> tuple[float, float] | None:
    if 1 <= page_number <= 6 or 9 <= page_number <= 33:
        return (438, 486)
    if 69 <= page_number <= 72:
        return (344, 379)
    if 35 <= page_number <= 68:
        return (548, 610)
    if 73 <= page_number <= 131:
        return (540, 610)
    return None


def redact_ngn(source: fitz.Document) -> tuple[fitz.Document, int]:
    removed = 0
    for page_number, page in enumerate(source, 1):
        column = ngn_column(page_number)
        if not column:
            continue
        for word in page.get_text('words'):
            x0, y0, x1, y1, value = word[:5]
            midpoint = (x0 + x1) / 2
            if column[0] <= midpoint <= column[1] or '$' in value:
                page.add_redact_annot(fitz.Rect(x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2), fill=(1, 1, 1))
                removed += 1
        page.apply_redactions(images=0, graphics=0, text=0)
    return source, removed


def row_bounds(page: fitz.Page, row_number: int) -> tuple[float, float]:
    horizontal = sorted(set(round(item[1].y0, 2)
        for drawing in page.get_drawings()
        for item in drawing['items']
        if item[0] == 're' and item[1].width > 500 and item[1].height < 1))
    horizontal = sorted(set(horizontal + [710.3]))
    first_row = 35 if page.number == 110 else 74
    rows = [(a, b) for a, b in zip(horizontal, horizontal[1:]) if a >= first_row]
    return rows[row_number - 1]


def image_for_group(source: fitz.Document, group: dict) -> Image.Image:
    if 'coverXref' in group:
        image_data = source.extract_image(group['coverXref'])['image']
        return Image.open(BytesIO(image_data)).convert('RGB')
    if 'coverRow' in group:
        page_number, row_number = group['coverRow']
        a, b = row_bounds(source[page_number - 1], row_number)
        clip = fitz.Rect(77, a, 210, b)
    elif 'pages' in group:
        page_number = group['pages'][0]
        clip = fitz.Rect(65, 40, 210, 750)
    else:
        page_number, row_number = group['rows'][0]
        a, b = row_bounds(source[page_number - 1], row_number)
        clip = fitz.Rect(77, a, 168, b)
    page = source[page_number - 1]
    candidates = []
    seen = set()
    for image_info in page.get_images(full=True):
        xref, width, height = image_info[0], image_info[2], image_info[3]
        if xref in seen or width < 150 or height < 100:
            continue
        seen.add(xref)
        rects = page.get_image_rects(xref)
        visible = max(((rect & clip).width * (rect & clip).height for rect in rects if rect.intersects(clip)), default=0)
        if visible:
            candidates.append((visible * min(width * height, 1_500_000), xref))
    if not candidates:
        raise ValueError(f'No usable source product image for {group["slug"]}')
    xref = max(candidates)[1]
    image_data = source.extract_image(xref)['image']
    return Image.open(BytesIO(image_data)).convert('RGB')


def cover_pdf(group: dict, product_image: Image.Image) -> bytes:
    buffer = BytesIO()
    width, height = 595.28, 841.89
    pdf = canvas.Canvas(buffer, pagesize=(width, height), pageCompression=1)
    pdf.setTitle(f'{group["title"]} | Sure Imports Product Catalog')
    pdf.setAuthor('Sure Importers Limited')
    pdf.setFillColor(HexColor('#F8F6F2'))
    pdf.rect(0, 0, width, height, stroke=0, fill=1)

    pdf.setFillColor(HexColor('#A87760'))
    pdf.setFont('Helvetica-Bold', 9)
    pdf.drawString(43, height - 64, 'PRODUCT CATALOG')
    pdf.setFillColor(HexColor('#25212A'))
    title = group['title']
    title_size = 49 if len(title) < 19 else 39
    if pdf.stringWidth(title, 'Times-Roman', title_size) > width - 86:
        title_size = 33
    pdf.setFont('Times-Roman', title_size)
    pdf.drawString(43, height - 131, title)
    pdf.setFillColor(HexColor('#77716F'))
    pdf.setFont('Times-Italic', 11)
    pdf.drawString(45, height - 159, group['subtitle'])

    panel = (43, 172, width - 86, 448)
    pdf.setFillColor(HexColor('#E7E1DA'))
    pdf.rect(*panel, stroke=0, fill=1)
    thumb = ImageOps.contain(product_image, (1200, 1070), method=Image.Resampling.LANCZOS)
    image_path = OUTPUT / f'{group["slug"]}-cover-product.jpg'
    thumb.save(image_path, 'JPEG', quality=88, optimize=True)
    image_width = min(panel[2] - 50, thumb.width * (panel[3] - 46) / thumb.height)
    image_height = image_width * thumb.height / thumb.width
    image_x = panel[0] + (panel[2] - image_width) / 2
    image_y = panel[1] + (panel[3] - image_height) / 2
    pdf.drawImage(str(image_path), image_x, image_y, image_width, image_height)

    pdf.setStrokeColor(HexColor('#DCD8D1'))
    pdf.line(43, 128, width - 43, 128)
    pdf.setFillColor(HexColor('#77716F'))
    pdf.setFont('Helvetica', 8)
    pdf.drawString(43, 102, 'RMB PRODUCT PRICES')
    pdf.drawRightString(width - 43, 102, 'SURE IMPORTS')
    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


def add_row_page(output: fitz.Document, source: fitz.Document, group: dict, page_number: int, row_number: int) -> None:
    source_page = source[page_number - 1]
    y0, y1 = row_bounds(source_page, row_number)
    clip = fitz.Rect(9, y0, 607, y1)
    page = output.new_page(width=842, height=595)
    page.draw_rect(page.rect, fill=(0.973, 0.965, 0.949), color=None)
    page.insert_text((35, 42), group['title'].upper(), fontsize=11, fontname='hebo', color=(0.16, 0.14, 0.17))
    page.insert_text((35, 61), 'ORIGINAL SUPPLIER LISTING  /  RMB PRICE ONLY', fontsize=8, fontname='helv', color=(0.54, 0.43, 0.36))
    max_width, max_height = 782, 450
    factor = min(max_width / clip.width, max_height / clip.height)
    image_width, image_height = clip.width * factor, clip.height * factor
    destination = fitz.Rect((842 - image_width) / 2, 90, (842 + image_width) / 2, 90 + image_height)
    page.draw_rect(destination + (-1, -1, 1, 1), color=(0.85, 0.82, 0.79), fill=(1, 1, 1))
    page.show_pdf_page(destination, source, page_number - 1, clip=clip)
    page.insert_text((35, 558), f'SOURCE PAGE {page_number}  /  ITEM {row_number}', fontsize=8, fontname='helv', color=(0.53, 0.50, 0.49))


def make_catalog(source: fitz.Document, redacted: fitz.Document, group: dict) -> dict:
    cover_bytes = cover_pdf(group, image_for_group(source, group))
    cover = fitz.open(stream=cover_bytes, filetype='pdf')
    result = fitz.open()
    result.insert_pdf(cover)
    if 'pages' in group:
        start, end = group['pages']
        result.insert_pdf(redacted, from_page=start - 1, to_page=end - 1)
    for page_number, row_number in group.get('rows', []):
        add_row_page(result, redacted, group, page_number, row_number)
    result.set_metadata({
        'title': f'{group["title"]} | Sure Imports Product Catalog',
        'author': 'Sure Importers Limited',
        'subject': 'Product listings with RMB supplier reference prices only',
        'keywords': f'{group["title"]}, RMB prices, Sure Imports',
    })
    pdf_path = OUTPUT / f'Sure-Imports-{group["slug"]}-catalog.pdf'
    png_path = OUTPUT / f'Sure-Imports-{group["slug"]}-cover.png'
    result.save(pdf_path, garbage=4, deflate=True)
    result[0].get_pixmap(matrix=fitz.Matrix(2.4, 2.4), alpha=False).save(png_path)
    text = '\n'.join(page.get_text() for page in result)
    if re.search(r'\bNGN\b', text, re.IGNORECASE):
        raise AssertionError(f'NGN text remains in {group["slug"]}')
    if '￥' not in text and '¥' not in text:
        raise AssertionError(f'No RMB prices detected in {group["slug"]}')
    return {
        **group,
        'pageCount': len(result),
        'pdfPath': str(pdf_path),
        'coverPath': str(png_path),
        'bytes': pdf_path.stat().st_size,
        'rmbPriceCount': text.count('￥') + text.count('¥'),
    }


source = fitz.open(SOURCE)
assert len(source) == 131
redacted, redaction_count = redact_ngn(fitz.open(SOURCE))
manifest = [make_catalog(source, redacted, group) for group in GROUPS]
(OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2))
print(json.dumps({'catalogs': len(manifest), 'ngnWordsRemoved': redaction_count,
                  'results': [{'slug': item['slug'], 'pages': item['pageCount'], 'mb': round(item['bytes'] / 1_000_000, 2), 'rmbPrices': item['rmbPriceCount']} for item in manifest]}, indent=2))
