import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface Record {
  pendingPaymentOrder: number;
  processingRequestOrder: number;
  requestProcessedOrder: number;
  cancelledOrder: number;
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

export const RecordCountVerifySupplierProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recordx, setRecord] = useState<Record | null>(null);

  //get user id and product status
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const statusx = 'payment-pending';

  useEffect(() => {
    const fetchRecord = async () => {
      const res = await fetch(
        `/api/get-data/verify-supplier-count/${pidUser}/${statusx}`,
      );
      const data = await res.json();
      setRecord(data);
    };
    fetchRecord();
  }, []);

  //alert(recordx?.deliveredOrder);

  return (
    <RecordContext.Provider value={{ recordx, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
