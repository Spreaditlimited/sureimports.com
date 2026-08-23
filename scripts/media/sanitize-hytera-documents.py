#!/usr/bin/env python3
"""Create partner-facing Hytera PDFs with direct manufacturer contacts redacted."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

import fitz


DOCUMENTS = (
    "Hytera BodyCam & Pltaform_Product Catalog.pdf",
    "Hytera Digital Evidence Management System_Product Description V5.4.pdf",
)

CONTACT_LINE_PATTERNS = (
    re.compile(r"^Address:\s*Hytera\s+Tower", re.IGNORECASE),
    re.compile(r"^Nanshan\s+District,\s*Shenzhen", re.IGNORECASE),
    re.compile(r"^Shenzhen,\s*People's Republic of China", re.IGNORECASE),
    re.compile(r"^Tel:\s*\+86-755", re.IGNORECASE),
    re.compile(r"^Postcode:\s*518057", re.IGNORECASE),
    re.compile(r"^https?://(?:www\.)?hytera\.com", re.IGNORECASE),
    re.compile(r"^www\.hytera\.com", re.IGNORECASE),
    re.compile(r"^marketing@hytera\.com", re.IGNORECASE),
    re.compile(
        r"^If you have any suggestions or would like to receive more information",
        re.IGNORECASE,
    ),
)

FORBIDDEN_TEXT = re.compile(
    r"marketing@hytera\.com|(?:https?://)?www\.hytera\.com|"
    r"\+86-755-2697\s*2999|\+86-755-8613\s*713|"
    r"Address:\s*Hytera\s+Tower|Nanshan\s+District,\s*Shenzhen|"
    r"Postcode:\s*518057",
    re.IGNORECASE,
)


def line_rectangles(page: fitz.Page) -> list[fitz.Rect]:
    rectangles: list[fitz.Rect] = []
    page_dict = page.get_text("dict")

    for block in page_dict.get("blocks", []):
        for line in block.get("lines", []):
            text = "".join(span.get("text", "") for span in line.get("spans", [])).strip()
            if any(pattern.search(text) for pattern in CONTACT_LINE_PATTERNS):
                rect = fitz.Rect(line["bbox"])
                rect.x0 = max(0, rect.x0 - 2)
                rect.y0 = max(0, rect.y0 - 1)
                rect.x1 = min(page.rect.width, rect.x1 + 2)
                rect.y1 = min(page.rect.height, rect.y1 + 1)
                rectangles.append(rect)

    return rectangles


def sanitize(source: Path, destination: Path) -> tuple[int, int]:
    document = fitz.open(source)
    redaction_count = 0
    removed_link_count = 0

    for page in document:
        rectangles = line_rectangles(page)

        # The catalogue cover includes four QR codes for Hytera-owned channels.
        if source.name == DOCUMENTS[0] and page.number == 0:
            for image in page.get_image_info(xrefs=True):
                rect = fitz.Rect(image["bbox"])
                is_cover_qr = (
                    40 <= rect.width <= 55
                    and 40 <= rect.height <= 55
                    and rect.x1 < 600
                    and rect.y0 > 640
                )
                if is_cover_qr:
                    rectangles.append(rect)

        for rect in rectangles:
            page.add_redact_annot(rect, fill=(1, 1, 1))
            redaction_count += 1

        if rectangles:
            page.apply_redactions(images=2, graphics=0, text=0)

        for link in page.get_links():
            uri = str(link.get("uri", ""))
            if "hytera.com" in uri.lower():
                page.delete_link(link)
                removed_link_count += 1

    destination.parent.mkdir(parents=True, exist_ok=True)
    document.save(destination, garbage=4, deflate=True, clean=True)
    document.close()

    sanitized = fitz.open(destination)
    extracted = "\n".join(page.get_text() for page in sanitized)
    page_count = sanitized.page_count
    sanitized.close()

    forbidden = sorted(set(match.group(0) for match in FORBIDDEN_TEXT.finditer(extracted)))
    if forbidden:
        raise RuntimeError(
            f"Contact information remains in {destination.name}: {', '.join(forbidden)}"
        )

    if page_count <= 0:
        raise RuntimeError(f"Sanitized document has no pages: {destination.name}")

    return redaction_count, removed_link_count


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_directory", type=Path)
    parser.add_argument("output_directory", type=Path)
    arguments = parser.parse_args()

    for filename in DOCUMENTS:
        source = arguments.source_directory / filename
        destination = arguments.output_directory / filename
        redactions, links = sanitize(source, destination)
        print(
            f"{filename}: {redactions} contact lines redacted, "
            f"{links} Hytera links removed"
        )


if __name__ == "__main__":
    main()
