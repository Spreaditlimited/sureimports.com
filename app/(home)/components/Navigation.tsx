'use client';

import Navbar from '@/components/home/NavBar';

type NavigationProps = {
  onNavigateHome?: () => void;
  onNavigateSignIn?: () => void;
  onNavigateBlog?: () => void;
  onNavigateToMacBooks?: () => void;
};

export default function Navigation(props: NavigationProps) {
  void props;
  return <Navbar />;
}
