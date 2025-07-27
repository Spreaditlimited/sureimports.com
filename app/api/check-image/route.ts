import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    // Validate the URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid URL' },
        { status: 400 },
      );
    }

    // Perform a HEAD request to the image URL
    const response = await fetch(imageUrl, { method: 'HEAD' });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error checking image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check image' },
      { status: 500 },
    );
  }
}
