'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

type YourDataType = {
  id: number;
  name: string;
};

const YourComponent = () => {
  const [data, setData] = useState<YourDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/get-data/special-sourcing/${pidUser}/${statusx}`,
        );
        const result = await response.json();
        setData(result);
      } catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default YourComponent;
