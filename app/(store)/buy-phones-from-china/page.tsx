import PhoneLanding from './PhoneLanding';

// Render public content on the server even when a nested client form reads search params.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <PhoneLanding />;
}
