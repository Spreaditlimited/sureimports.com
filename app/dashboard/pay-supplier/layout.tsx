import ServerFeatureGate from '@/components/dashboard/features/ServerFeatureGate';
import PaySupplierWorkspace from './components/PaySupplierWorkspace';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ServerFeatureGate feature="pay_supplier"><PaySupplierWorkspace>{children}</PaySupplierWorkspace></ServerFeatureGate>;
}
