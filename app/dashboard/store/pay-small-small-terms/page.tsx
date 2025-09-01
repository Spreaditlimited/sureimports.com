import Image from "next/image";
import Paysmallsmall from "./components/Paysmallsmall";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

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
      <Paysmallsmall product={product} />
    </>
  );
}


export default Page;