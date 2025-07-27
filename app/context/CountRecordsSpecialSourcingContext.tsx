import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface Record {
  id: number;
  name: string;
  email: string;
}

interface RecordContextProps {
  record: Record | null;
  setRecord: (record: Record) => void;
}

const UserContext = createContext<RecordContextProps | undefined>(undefined);

export const useRecord = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useRecord must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [record, setRecord] = useState<Record | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      const res = await fetch('/api/user');
      const data = await res.json();
      setRecord(data.record);
    };
    fetchRecord();
  }, []);

  return (
    <UserContext.Provider value={{ record, setRecord }}>
      {children}
    </UserContext.Provider>
  );
};
