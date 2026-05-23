# How to Add Blog Posts to the Database

## Option 1: Using Prisma Studio (Easiest)

1. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the `blog` table

3. Click "Add record" and fill in:
   - `blogTitle`: Your blog title
   - `blogContent`: Your blog content (supports HTML)
   - `blogSlug`: URL-friendly slug (e.g., "my-first-blog")
   - `blogPublished`: Set to `true`
   - `blogBy`: Author name
   - `blogImage`: Image filename (if uploaded to R2)
   - `blogExt2`: Metadata in JSON format (optional):
     ```json
     {"category": "Import Guide", "tags": ["Import", "Business"], "featured": true}
     ```
   - `xStaus`: Set to `"active"`

4. Click "Save 1 change"

## Option 2: Using SQL

Run this in your database:

```sql
INSERT INTO blog (
  pidBlog,
  blogTitle,
  blogContent,
  blogSlug,
  blogPublished,
  blogBy,
  blogExt2,
  xStaus,
  createdAt
) VALUES (
  'BLOG' || EXTRACT(EPOCH FROM NOW())::bigint,
  'Your Blog Title',
  '<p>Your blog content here. Can include HTML.</p>',
  'your-blog-title',
  true,
  'Admin',
  '{"category": "Import Guide", "tags": ["Import"], "featured": false}',
  'active',
  NOW()
);
```

## Option 3: Using the Admin Dashboard

If you have the admin blog management system set up:

1. Navigate to `http://localhost:3000/dashboard/blog/create`
2. Fill in the blog post form
3. Upload an image (optional)
4. Click "Publish"

## Verify Blogs Are Showing

1. Check server logs in terminal - you should see:
   ```
   Fetched blog posts count: X
   First blog post: [Title]
   ```

2. Visit `http://localhost:3000/blog` - blogs should display

3. Run the test script:
   ```bash
   node test-blog-fetch.js
   ```

## Database Field Reference

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `pidBlog` | Yes | Unique ID | `BLOG1735123456789` |
| `blogTitle` | Yes | Post title | "How to Import from China" |
| `blogContent` | Yes | Main content | HTML or plain text |
| `blogSlug` | Yes | URL slug | "how-to-import-from-china" |
| `blogPublished` | Yes | Show on site? | `true` |
| `blogBy` | Optional | Author name | "Admin" |
| `blogImage` | Optional | R2 filename | "blog-image.jpg" |
| `blogExt1` | Optional | Video URL | "https://..." |
| `blogExt2` | Optional | JSON metadata | `{"category":"Import Guide"}` |
| `xStaus` | Yes | Active status | `"active"` |
| `createdAt` | Auto | Created date | Auto-generated |

## Troubleshooting

### No blogs showing?

1. Check if blogs exist in database:
   ```bash
   node test-blog-fetch.js
   ```

2. Verify blog is published:
   - `blogPublished` = `true`
   - `xStaus` = `"active"`

3. Check server logs for errors

### Images not showing?

Make sure `NEXT_PUBLIC_CLOUDINARY_BASE_URL` is set in your environment variables.
