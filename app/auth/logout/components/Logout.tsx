//'use client'; // Mark this as a Client Component

import * as React from 'react';
import { redirect, useRouter } from 'next/navigation';
//import { useAuth } from '@/app/context/AuthContext';

const Logout = () => {
  //const router = useRouter();

  //router.push('/auth/login');
  redirect('/auth/login');
  // const { logout } = useAuth();
  // logout();
  // return;

  // Function to handle logout
  // const handleLogout = async () => {
  //   try {
  //     // Make request to logout API
  //     const res = await fetch('/api/auth/logoutRedirect', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({}),
  //     });

  //     // Process response
  //     if (res.ok) {
  //       // Redirect to login page on success
  //       window.location.href = '/auth/login';
  //       //router.push('/auth/login');
  //     } else {
  //       // Redirect to dashboard if logout fails
  //       router.push('/dashboard');
  //     }
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };

  // // Call the logout function when the component mounts
  // React.useEffect(() => {
  //   handleLogout();
  // }, []); // Empty dependency array ensures this runs only once on mount

  // return <div>{/* <p>Logging out...</p> */}</div>;
};

export default Logout;
