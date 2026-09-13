'use client';
import { type AvatarProps } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';
import AccountTray from '@/components/dashboard/AccountTray';

export interface UserAvatarProps extends AvatarProps {
  userx: { userFirstname: string; userImage: string; userEmail: string };
}
export function UserAvatar({ userx }: UserAvatarProps) {
  const { user, logout } = useAuth();
  return <AccountTray name={userx?.userFirstname || 'Your account'} email={userx?.userEmail} image={resolveMediaUrl(user?.userImage) || '/images/default.png'}>
    <Link href="/dashboard/profile-update"><Settings size={20} />Profile and settings</Link>
    <button type="button" onClick={() => void logout()}><LogOut size={20} />Sign out</button>
  </AccountTray>;
}
