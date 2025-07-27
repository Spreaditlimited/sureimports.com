'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function ProfileReminder() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [piduser, setUser] = useState<any>(user?.pidUser);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        '/api/profile-update-check?pidUser=' + piduser,
      );
      const data: any = await response.json();
      setUser(data);
      if (!data.phone) {
        setShowPopup(true);
      }
    };

    fetchUser();
  }, []);

  if (!showPopup || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Update Your Profile
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Kindly update your profile with your WhatsApp number to enable us
          support you better.
        </p>

        <button
          onClick={() => router.push('/dashboard/profile-update')}
          className="flex rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <User className="text-gray-300" />
          &nbsp; Update Profile
        </button>

        <br />
        <br />
        <hr />

        <button
          onClick={() => setShowPopup(false)}
          className="rounded px-4 py-2 text-gray-800 dark:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
