import Image from 'next/image';
import Paysmallsmall from './components/Paysmallsmall';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const product = await db.store.findUnique({
    where: {
      pidProduct: id,
      //productCategory: { contains: 'example.com' },
      //posts: { some: { published: true } }
    },
    //orderBy: { createdAt: 'desc' },
    // skip: 10,
    // take: 5,
    //include: { posts: true } // Include relations
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div className="text-[28px] font-bold text-black dark:text-slate-200 max-sm:pb-4">
            Pay Small Small Terms
          </div>
        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
          Terms and conditions for paying in installments with Pay Small Small.
        </div>
      </div>
      <Paysmallsmall product={product} />
    </>
  );
};

export default Page;
