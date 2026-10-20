import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
} from 'react';

import { useAuth } from '@/app/context/AuthContext';

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
  tenantScoped = false,
}: {
  children: ReactNode;
  tenantScoped?: boolean;
}) => {
  const { user } = useAuth();
  const pidUser = user?.pidUser;
  const [recordx, setRecord] = useState<Record | null>(null);
  const cacheKey = pidUser ? `procurement-count:${pidUser}` : null;

  useEffect(() => {
    setRecord(null);
    if (tenantScoped || !pidUser) return;
    const controller = new AbortController();
    // Browser storage is only a convenience; blocked storage must not block navigation.
    try {
      const cached = cacheKey && sessionStorage.getItem(cacheKey);
      if (cached) setRecord(JSON.parse(cached));
    } catch { /* Fetch fresh counts when the cache is unavailable. */ }

    async function fetchRecord() {
      try {
        const response = await fetch(`/api/get-data/procurement-count/${pidUser}/saved`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        if (controller.signal.aborted) return;
        setRecord(data);
        try {
          if (cacheKey) sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch { /* Counts remain usable without a cache. */ }
      } catch { /* Retain cached counts during a temporary network failure. */ }
    }
    void fetchRecord();
    return () => controller.abort();
  }, [pidUser, cacheKey, tenantScoped]);

  return (
    <RecordContext.Provider value={{ recordx, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
