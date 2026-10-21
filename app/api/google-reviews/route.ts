import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const placeId = 'ChIJiZvgRGGPOxARlHVuAEV0jqw';
const headers = { 'Cache-Control': 'private, no-store, max-age=0' };
type PlaceReview = {
  name: string;
  rating: number;
  originalText?: { text?: string };
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
};

export async function GET(request: NextRequest) {
  // This fixed-place endpoint cannot be used as an arbitrary Places API proxy.
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers });
  }
  const key =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.SURE_IMPORTS_GOOGLE_MAPS_API;
  if (!key)
    return NextResponse.json({ unavailable: true }, { status: 503, headers });
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=en`,
      {
        headers: {
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask':
            'displayName,rating,userRatingCount,googleMapsUri,reviews,attributions',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) {
      console.error('Google reviews unavailable', { status: response.status });
      return NextResponse.json({ unavailable: true }, { status: 503, headers });
    }
    const data = await response.json();
    return NextResponse.json(
      {
        name: data.displayName?.text,
        rating: data.rating,
        count: data.userRatingCount,
        url: data.googleMapsUri,
        attributions: data.attributions || [],
        reviews: (data.reviews || []).slice(0, 5).map((review: PlaceReview) => ({
          id: review.name,
          rating: review.rating,
          text: review.originalText?.text || review.text?.text || '',
          date: review.relativePublishTimeDescription,
          author: review.authorAttribution?.displayName || 'Google reviewer',
          authorUrl: review.authorAttribution?.uri,
          avatar: review.authorAttribution?.photoUri,
          url: review.googleMapsUri,
        })),
      },
      { headers },
    );
  } catch {
    console.error('Google reviews request timed out or failed');
    return NextResponse.json({ unavailable: true }, { status: 503, headers });
  }
}
