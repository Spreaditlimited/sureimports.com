export interface NavItem {
  title: string;
  href: string;
  target?: any;
  icon: React.FC;
  color?: string;
  isChidren?: boolean;
  children?: NavItem[];
  logout?: () => void;
}
