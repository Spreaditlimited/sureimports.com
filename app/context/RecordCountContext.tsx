import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface Record {
  //savedOrder: number;
  pendingOrder: number;
  processingOrder: number;
  sourcedOrder: number;
  deliveredOrder: number;
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

export const RecordCountSpecialSourcingProvider = ({
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
        `/api/get-data/special-sourcing-count/${pidUser}/${statusx}`,
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
