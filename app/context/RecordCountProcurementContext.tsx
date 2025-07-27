import {
  createContext,
  useContext,
  useState,
  ReactNode,
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
  setRecord: (recordx: Record) => void;
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
  //get user id and product status
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const statusx = 'saved';
  const [recordx, setRecord] = useState<Record | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      const res = await fetch(
        `/api/get-data/procurement-count/${pidUser}/${statusx}`,
      );
      const data = await res.json();
      setRecord(data);
    };
    fetchRecord();
  }, [pidUser]);

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
