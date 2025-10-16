import xMail from '@/lib/email/xMail';
import xMail2 from '@/lib/email/xMail2';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }


  //return Response.json({ success: true });



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





// Email templates

// EMAIL 1
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


// EMAIL 2
const xBody2 = `
Dear [First Name],<br /><br />
We noticed that your Buy from Chinese Websites order is still unpaid, and we don’t want you to miss out. Once payment is made, our team can immediately begin sourcing and shipping your items.<br /><br />
Just a reminder: orders must be paid within 7 days of receiving our first reminder email. After that, the system will automatically delete the order.<br /><br />
Its been [Days] days since you placed your order, and we want to ensure you don't miss out on the great products you've selected.<br /><br />
If you’re ready, simply log in to your account and complete payment today to keep your order active.<br /><br />
We appreciate you choosing Sure Imports and look forward to helping you get your products without stress.<br /><br />
Kind regards,<br /><br />
The Sure Imports Team
`;


// EMAIL 3
const xBody3 = `
Dear [First Name],<br /><br />
This is a friendly final reminder that your Buy from Chinese Websites order on sureimports.com is still unpaid.<br /><br />
Please note that if payment is not completed within the next 24 hours, the system will automatically cancel and delete this order. Once deleted, it cannot be recovered, and you’ll need to create a new order if you still want the items.<br /><br />
Its been [Days] days since you placed your order, and we want to ensure you don't miss out on the great products you've selected.<br /><br />
If you’d like to keep this order active, we encourage you to complete payment today so our team can begin processing and shipping without delay.<br /><br />
Thank you once again for choosing Sure Imports. We look forward to serving you.<br /><br />
Warm regards,<br /><br />
The Sure Imports Team
`;







  // Fetch orders with 'pending' status
  const pendingOrders = await prisma.orders.findMany({
    where: {
      status: 'saved', // Change 'pending' to 'testing' for testing purposes
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



        //EMAIL 1: Send email at 2nd day after creation
        if(daysPending == 1){
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



        //EMAIL 2: Send email at 4 days 
        if(daysPending == 4){
            const xTitle = `Quick Reminder: Your Order Is Waiting (Order ID: ${order.pidOrder})`;
            const personalizedBody = xBody2
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



            
        //EMAIL 3: Send email at 2 days before deletion
        if(daysPending == 7){
            const xTitle = `Final Reminder: Your Order Will Be Cancelled Tomorrow (Order ID: ${order.pidOrder})`;
            const personalizedBody = xBody3
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


          
          //DELETE ORDER AND PRODUCTS TIED TO IT
          if(daysPending == 8){
      
            // First, find all products associated with this order
            const orderProducts = await prisma.products.findMany({
              where: {
                pidOrder: order.pidOrder,
              },
            });

            // Log the products found for this order
            console.log(`Found ${orderProducts.length} products for order ${order.pidOrder}`);

            // Delete all products associated with this order
            if (orderProducts.length > 0) {
              const deletedProducts = await prisma.products.deleteMany({
                where: {
                  pidOrder: order.pidOrder,
                },
              });
              console.log(`Deleted ${deletedProducts.count} products for order ${order.pidOrder}`);
            }

            // Now delete the order itself
            const deletedOrder = await prisma.orders.delete({
              where: {
                pidOrder: order.pidOrder,
                status: 'saved', // Ensure we only delete if still 'testing'
              },
            });

            console.log(`Deleted order ${order.pidOrder} successfully`);

                      }

          }







    } catch (error) {
      console.error(`Failed to send email for order ${order.pidOrder}:`, error);
      return NextResponse.json({ ok: false, error: error });//you can also log the error to a file or monitoring service
    }
  }





  return NextResponse.json({ ok: true });
}


