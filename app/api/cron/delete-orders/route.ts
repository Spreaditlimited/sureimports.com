import xMail from '@/lib/email/xMail';
import xMail2 from '@/lib/email/xMail2';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  // const deletedProduct = await prisma.special_sourcing.deleteMany({
  //   where: {
  //     status: 'pending',
  //   },
  // });
  // return NextResponse.json({ ok: true });



const xBody1 = `
Dear [First Name],<br /><br />
Thank you for creating a Buy from Chinese Websites order on sureimports.com.<br /><br />
We understand life gets busy, so this is just a gentle reminder to complete your payment of Order [Order ID], so we can begin processing your order and arranging shipment right away.<br /><br />
<b>Please note: if payment is not made within the next 7 days, the system will automatically cancel and delete the order.</b><br /><br />
We truly appreciate your trust in Sure Imports and look forward to serving you.<br /><br />
Warm regards,<br /><br />
The Sure Imports Team
`;

  // Fetch orders with 'pending' status
  const pendingOrders = await prisma.orders.findMany({
    where: {
      status: 'testing', // Change 'pending' to 'testing' for testing purposes
    },
  });

  // Loop through each pending order and send reminder email
  for (const order of pendingOrders) {
    try {
      const user = await prisma.users.findUnique({
        where: { pidUser: order.pidUser },
      });

      if (user) {
        const xEmail = user.userEmail as string;
        const xTitle = `Reminder: Complete Your Order (Order ID: ${order.pidOrder})`;
        const personalizedBody = xBody1
          .replace('[First Name]', user.userFirstname as any)
          .replace('[Order ID]', order.pidOrder);

        await xMail({
          xEmail,
          xTitle,
          xBodyTitle: xTitle,
          xBody1: personalizedBody,
          xButtonTitle: 'Complete Payment',
          xButtonLink: `${process.env.ROOT_URL}/dashboard/procurement/view-orders/saved`,
        });

        console.log(`Reminder email sent to ${user.userEmail} for order ${order.pidOrder}`);
      }
    } catch (error) {
      console.error(`Failed to send email for order ${order.pidOrder}:`, error);
    }
  }

  // After sending reminders, delete orders that are still pending
  // const deletedOrders = await prisma.orders.deleteMany({
  //   where: {
  //     status: 'pending',
  //   },
  // });



  return NextResponse.json({ ok: true });
}



// import type { NextRequest } from 'next/server';
 
// export function GET(request: NextRequest) {
//   const authHeader = request.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new Response('Unauthorized', {
//       status: 401,
//     });
//   }
 
//   return Response.json({ success: true });
// }