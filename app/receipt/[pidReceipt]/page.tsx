import ReceiptClient from './ReceiptClient';

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ pidReceipt: string }>;
}) {
  const { pidReceipt } = await params;
  return <ReceiptClient pidReceipt={pidReceipt} />;
}
