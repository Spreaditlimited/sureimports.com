import Loader from '@/components/uix/Loader';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="spinner flex h-screen items-center justify-center">
      <Loader />
    </div>
  );
}
