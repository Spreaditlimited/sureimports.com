import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
} from 'react';

import { useAuth } from '@/lib/AuthContext';
import Loader from '@/components/uix/Loader';

interface Record {
  savedOrderCount: number;
  pendingOrderCount: number;
  approvedOrderCount: number;
  payForShippingOrderCount: number;
  inTransitOrderCount: number;
  readyForPickupOrderCount: number;
  completedOrdersCount: number;
  onHoldOrdersCount: number;
  bankPendingSavedOrdersCount: number;
  bankPendingShippingOrdersCount: number;
  cancelledOrdersCount: number;
}

interface RecordContextProps {
  recordx: Record | null;
  setRecord: Dispatch<SetStateAction<Record | null>>;
}

const RecordContext = createContext<RecordContextProps | undefined>(undefined);

export const useRecord = () => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error('useRecord must be used within a RecordProvider');
  }
  return context;
};

export const RecordCountProcurementProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const pidUser = user?.pidUser;
  const statusx = 'saved';
  const [recordx, setRecord] = useState<Record | null>(null);
  const cacheKey = pidUser ? `procurement-count:${pidUser}` : null;

  useEffect(() => {
    if (!pidUser) return;

    if (cacheKey) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          setRecord(JSON.parse(cached));
        } catch {
          sessionStorage.removeItem(cacheKey);
        }
      }
    }

    const fetchRecord = async () => {
      const res = await fetch(
        `/api/get-data/procurement-count/${pidUser}/${statusx}`,
      );
      const data = await res.json();
      setRecord(data);
      if (cacheKey) {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }
    };
    fetchRecord();
  }, [pidUser, cacheKey]);

  //alert(pidUser)
  if (!user?.pidUser) {
    return <Loader />;
  }

  //alert(JSON.stringify(recordx))
  return (
    <RecordContext.Provider value={{ recordx, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
