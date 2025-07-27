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
  readyToShipOrder: number;
  productShippedOrder: number;
  productArrivedOrder: number;
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
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const statusx = 'saved';

  useEffect(() => {
    const fetchRecord = async () => {
      const res = await fetch(
        `/api/get-data/shipping-only-count/${pidUser}/${statusx}`,
      );
      const data = await res.json();
      setRecord(data);
    };
    fetchRecord();
  }, []);

  return (
    <RecordContext.Provider value={{ recordx, setRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
