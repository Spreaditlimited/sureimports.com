export interface NavItem {
  title: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  icon: React.FC;
  color?: string;
  isChidren?: boolean;
  children?: NavItem[];
  logout?: () => void;
}
