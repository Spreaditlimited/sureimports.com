'use client';
export default function VehicleError({ reset }: { reset: () => void }) {
  return (
    <main className="vehicle-range">
      <h1>We couldn’t load the vehicle range.</h1>
      <p>Please try again in a moment.</p>
      <button className="vehicle-button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
