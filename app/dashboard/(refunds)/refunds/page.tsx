import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { getUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import RefundsPage from './components/RefundsPage';


let titlex = 'Dashboard: Refunds';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

export default async function RefundRecordsPage() {
  // const Page = async ({
  //   searchParams,
  // }: {
  //   searchParams: Promise<{ status?: string }>;
  // }) => {

  //     const { status } = await searchParams;

  //     if (!status) {
  //       notFound();
  //     }

  // Check if the user is authenticated
  // const check = await checkAuth();
  // if (!check) {
  //   redirect('/auth/login');
  // }
  const user = (await getUser()) as any;
  if (!user?.pidUser) redirect('/auth/login');

  const records: any = await prisma.refund_records.findMany({
    select: { id: true, pidRefund: true, pidOrder: true, amount: true, currency: true, refundStatus: true, serviceType: true, createdAt: true, updatedAt: true },
    where: {
      pidUser: user.pidUser,
      //refundStatus: status,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  //const records = await getRefundRecords();

  return (
    <>
      <RefundsPage records={records} />
    </>
  );
}

//export default Page;
