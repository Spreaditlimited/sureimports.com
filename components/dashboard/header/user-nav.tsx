'use client';

import { UserAvatar } from './user-details';
import { useAuth } from '@/lib/AuthContext';

type Props = {
  userz: {
    userFirstname: string;
    userImage: string;
    userEmail: string;
  };
};

export function UserNav({ userz }: Props) {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  // alert(user.image+'ddddd');
  //alert(user?.userFirstname);
  return (
    <div>
      <UserAvatar
        userx={
          {
            userFirstname: user?.userFirstname,
            userImage: user?.userImage,
            userEmail: user?.userEmail,
          } as any
        }
        className="h-8 w-8 hover:cursor-pointer"
      />
    </div>
  );
}
