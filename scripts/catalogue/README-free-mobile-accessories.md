# Free mobile accessories catalogs

Source: the owner's 131-page `Mobile Accessories Combined Quotation.pdf` shared at
https://drive.google.com/file/d/1De-e6vk3f7eSmm1ZxL2bhjFC51u3tBVg/view.
The source is not committed to Git.

`split-free-mobile-accessories.py` creates 23 product-focused PDFs, matching cover
PNGs, and `manifest.json`. It uses PyMuPDF, Pillow, and ReportLab. Run it with
the source PDF and an output directory:

```sh
python3 scripts/catalogue/split-free-mobile-accessories.py \
  /path/to/Mobile-Accessories-Combined-Quotation.pdf \
  /path/to/output-directory
```

The script removes the NGN price column and the USD packaging surcharges from
the PDF text layer. It keeps the supplier's RMB price entries and product images.
The page ranges covering phone cases, cables, protectors, chargers, audio, and
speakers stay together. The mixed final pages are split by individual product
row. The two priced phone holder listings on page 111 are retained; pages
112–113 contain only NGN prices and are omitted. The 69 rows on pages 119–131
are each assigned to one catalog.

The published PDF and cover IDs are recorded in `lib/intelligence/freeCatalogs.ts`.
Product prices are supplier references; the website asks customers to confirm
availability, minimum quantity, delivery, and their final quote before payment.

Each catalog has a public HTML page under `/supplier-intelligence/catalogs/`.
Those pages carry the canonical URLs and appear in the sitemap; the signed PDF
download route stays outside the search index. Add a matching entry to
`lib/intelligence/catalogSearchContent.ts` when publishing another catalog.
