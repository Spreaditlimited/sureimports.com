import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface Record {
  requestReceivedOrder: number;
  productShippedOrder: number;
  productArrivedOrder: number;
  invoicedOrder: number;
  paidOrder: number;
  productDeliveredOrder: number;
  cancelledRequestOrder: number;
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

export const RecordCountShippingOnlyProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recordx, setRecord] = useState<Record | null>(null);

  //get user id and product status
  const { user } = useAuth();
  const pidUser = user?.pidUser;
  const statusx = 'request-received';

  useEffect(() => {
    if (!pidUser) return;
    const fetchRecord = async () => {
      const res = await fetch(
        `/api/get-data/shipping-only-count/${pidUser}/${statusx}`,
      );
      const data = await res.json();
      setRecord(data);
    };
    fetchRecord();
  }, [pidUser, statusx]);

  //alert(recordx?.requestReceivedOrder);

  return (
    <RecordContext.Provider value={{ recordx, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
