import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Download, FileText, LayoutDashboard, ShoppingBag } from 'lucide-react';

import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'My Supplier Reports',
};

export default async function MySupplierReportsPage() {
  const user = await checkAuth();
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent('/dashboard/my-reports')}`);
  }

  const orders = await prisma.intelligence_report_orders.findMany({
    where: { pidUser: user.pidUser, status: 'paid' },
    orderBy: { paidAt: 'desc' },
  });
  const reports = await prisma.intelligence_report_products.findMany({
    where: { pidReport: { in: orders.map((order) => order.reportId) } },
  });
  const versions = await prisma.intelligence_report_versions.findMany({
    where: { pidVersion: { in: orders.map((order) => order.versionId) } },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
              Your purchased PDF library
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              My Supplier Reports
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Access and download every Supplier Intelligence report you have
              purchased. No Supplier Intelligence subscription is required.
            </p>
          </div>
          <Link
            href="/supplier-intelligence/reports"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse reports
          </Link>
        </div>

        {orders.length ? (
          <div className="mt-10 grid gap-5">
            {orders.map((order) => {
              const report = reports.find(
                (item) => item.pidReport === order.reportId,
              );
              const version = versions.find(
                (item) => item.pidVersion === order.versionId,
              );
              if (!report || !version) return null;

              return (
                <article
                  key={order.pidOrder}
                  className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <span className="rounded-2xl bg-orange-50 p-3 text-brand-orange-600">
                      <FileText className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-brand-orange-600">
                        {version.editionLabel}
                      </p>
                      <h2 className="mt-2 text-lg font-black text-slate-950">
                        {report.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Purchased{' '}
                        {order.paidAt
                          ? new Intl.DateTimeFormat('en-GB', {
                              dateStyle: 'long',
                            }).format(order.paidAt)
                          : ''}{' '}
                        · {version.supplierCount} suppliers
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/intelligence/reports/download?token=${encodeURIComponent(order.downloadToken)}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-black text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              No purchased reports yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Choose a category report and it will appear here after payment.
            </p>
            <Link
              href="/supplier-intelligence/reports"
              className="mt-6 inline-flex rounded-xl bg-brand-orange-500 px-5 py-3 text-sm font-black text-white"
            >
              Browse Supplier Intelligence Reports
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
