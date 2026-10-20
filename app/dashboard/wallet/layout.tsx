import ServerFeatureGate from '@/components/dashboard/features/ServerFeatureGate';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ServerFeatureGate feature="wallet">{children}</ServerFeatureGate>;
}
