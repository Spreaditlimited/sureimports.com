import Link from 'next/link';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-500" />

        {/* Dynamic breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <BreadcrumbItem key={item.label}>
              {isLast || !item.href ? (
                <BreadcrumbPage className="max-w-[200px] truncate text-slate-200 sm:max-w-[300px]">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator className="text-slate-500" />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
