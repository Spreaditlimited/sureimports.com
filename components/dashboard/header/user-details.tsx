import { type AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/_lib/utils';
import Image from 'next/image';
import { User as UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/AuthContext';
import { resolveMediaUrl } from '@/lib/cloudinary/url';

export interface UserAvatarProps extends AvatarProps {
  userx: {
    userFirstname: string;
    userImage: string;
    userEmail: string;
  };
}

export function UserAvatar({ userx }: UserAvatarProps) {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  const imageUser = resolveMediaUrl(user?.userImage);
  const imageDefault = '../../../images/default.png';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  {
    /* <AvatarImage alt="Picture" src={user.image} /> */
  }
  {
    /* <AvatarFallback>
<span className="sr-only">{user.name}</span>
<UserIcon className="h-4 w-4" />
</AvatarFallback> */
  }

  return (
    <div className="inline-flex items-center justify-start gap-2.5 text-slate-800 hover:cursor-pointer dark:text-white md:mr-4 md:h-[50px]">
      {/* DESKTOP VIEW */}
      <Avatar className="hidden h-12 w-12 border-collapse border transition-all duration-300 hover:border-[#0E0E1F] dark:hover:border-white lg:block">
        {user?.userImage != null ? (
          <img
            src={imageUser}
            height={100}
            width={100}
            className="h-full w-full object-fill"
          />
        ) : (
          <img
            src={imageDefault}
            height={100}
            width={100}
            className="h-full w-full object-fill"
          />
        )}
      </Avatar>

      <Sheet open={open} onOpenChange={setOpen}>
        {/* MOBILE VIEW */}
        <SheetTrigger asChild>
          <Avatar className="h-12 w-12 border-collapse border transition-all duration-300 hover:border-[#0E0E1F] dark:hover:border-white lg:hidden">
            {user?.userImage != null ? (
              <img
                src={imageUser}
                height={100}
                width={100}
                className="h-full w-full object-fill"
              />
            ) : (
              <img
                src={imageDefault}
                height={100}
                width={100}
                className="h-full w-full object-fill"
              />
            )}
          </Avatar>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[264px] flex-col bg-[#0E0E1F] pr-0 text-white dark:bg-gray-900 lg:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>User Menu</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col gap-4">
            {/* MOBILE SLIDE OUT MENU ON AVATER CLICK */}
            <div className="flex gap-2">
              <Avatar className="hover:border-solid-black h-[50px] w-[50px] border-collapse border transition-all duration-300 dark:hover:border-white">
                {user?.userImage != null ? (
                  <img
                    src={imageUser}
                    height={100}
                    width={100}
                    className="h-full w-full object-fill"
                  />
                ) : (
                  <img
                    src={imageDefault}
                    height={100}
                    width={100}
                    className="h-full w-full object-fill"
                  />
                )}
              </Avatar>
              <div className="hide-scrollbar w-[256px] overflow-y-auto">
                <div className="flex flex-col items-start justify-center gap-2">
                  <p className="text-sm font-semibold text-white transition-all duration-300 hover:underline md:text-base">
                    {userx.userFirstname}
                  </p>
                  <p className="text-xs font-normal text-white md:text-sm">
                    {userx.userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* SETTINGS LINK */}
            <Link
              href="/dashboard/profile-update"
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={cn(
                buttonVariants({}),
                'group relative mr-0 flex h-12 justify-start rounded-r-none bg-white/10 pr-0 text-sm font-normal dark:bg-gray-800/50',
              )}
            >
              <Image
                src={
                  theme === 'dark'
                    ? '/icons/settings-dark.svg'
                    : '/icons/settings.svg'
                }
                alt="Logo"
                width={20}
                height={20}
              />
              <span className={cn('absolute left-12 text-sm duration-200')}>
                Settings
              </span>
            </Link>

            {/* LOGOUT LINK */}
            <Link
              href="/auth/login"
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={cn(
                buttonVariants({}),
                'group relative mr-0 flex h-12 justify-start rounded-r-none bg-white/10 pr-0 text-sm font-normal dark:bg-gray-800/50',
              )}
            >
              <Image
                src={
                  theme === 'dark'
                    ? '/icons/settings-dark.svg'
                    : '/icons/settings.svg'
                }
                alt="Logo"
                width={20}
                height={20}
              />
              <span className={cn('absolute left-12 text-sm duration-200')}>
                Logout
              </span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <p className="text-sm font-semibold text-slate-800 hover:underline dark:text-white md:text-base">
          {userx.userFirstname}
        </p>
        <p className="text-xs font-normal text-slate-600 dark:text-gray-300 md:text-sm">
          {userx.userEmail}
        </p>
      </div>
    </div>
  );
}
