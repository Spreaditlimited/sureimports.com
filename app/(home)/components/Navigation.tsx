'use client';

import Navbar from '@/components/home/NavBar';

type NavigationProps = {
  onNavigateHome?: () => void;
  onNavigateSignIn?: () => void;
  onNavigateBlog?: () => void;
  onNavigateToMacBooks?: () => void;
  forceLightNavbar?: boolean;
};

export default function Navigation(props: NavigationProps) {
  return <Navbar forceLightNavbar={props.forceLightNavbar} />;
}
