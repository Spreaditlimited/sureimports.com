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

//check for date difference (the current date style is 2025-03-11 18:58:20.657)
//send email reminder if order is still pending after 7 days
//delete order if still pending after 8 days


// Function to calculate days difference between two dates
const getDaysDifference = (dateString: string): number => {
  const orderDate = new Date(dateString);
  const currentDate = new Date();
  
  // Reset time to midnight for accurate day calculation
  orderDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds
  const diffInMs = currentDate.getTime() - orderDate.getTime();
  
  // Convert to days
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  return diffInDays;
};


// Email template

const xBody1 = `
Dear [First Name],<br /><br />
Thank you for creating a Buy from Chinese Websites order on sureimports.com.<br /><br />
We understand life gets busy, so this is just a gentle reminder to complete your payment of Order [Order ID], so we can begin processing your order and arranging shipment right away.<br /><br />
Its been [Days] days since you placed your order, and we want to ensure you don't miss out on the great products you've selected.<br /><br />
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

      const daysPending = getDaysDifference(order.updatedAt as any);
      
      // Send reminder if the order has been pending for 7 days
      const user = await prisma.users.findUnique({
        where: { pidUser: order.pidUser },
      });

      if (user) {
        const xEmail = user.userEmail as string;
        const xTitle = `Reminder: Complete Your Order (Order ID: ${order.pidOrder})`;
        const personalizedBody = xBody1
          .replace('[First Name]', user.userFirstname as any)
          .replace('[Order ID]', order.pidOrder)
          .replace('[Days]', daysPending as any); // You can calculate the actual days if needed

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