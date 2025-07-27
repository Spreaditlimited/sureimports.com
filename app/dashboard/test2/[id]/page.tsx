'use client';

// app/users/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  fullName: string;
  userEmail: string;
  createdAt: string;
};

export default function UserProfilePage() {
  const router = useRouter();
  const id = 31;
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/test2/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data);
          }
        })
        .catch((err) => setError('Failed to fetch user data'));
    }
  }, [id]);

  if (error) return <p>Error: {error}</p>;

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.fullName}'s Profile</h1>
      <p>Email: {user.userEmail}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
