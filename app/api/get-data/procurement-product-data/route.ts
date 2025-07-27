// app/api/orders/total/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming you have Prisma setup in `lib/prisma.ts`

function replaceNullWithZero<T>(value: T | null): T | number {
  return value === null ? 0 : value;
}

export async function GET(request: NextRequest) {
  const pidOrder = request.nextUrl.searchParams.get('pidOrder');

  try {
    //TOTAL PRODUCTS PRICE
    const price: any = await prisma.$queryRaw`
        SELECT pidOrder, SUM(productQuantity * productPrice) as totalPricex
        FROM products
        WHERE pidOrder = ${pidOrder}
      `;

    //TOTAL PRODUCTS WEIGHT
    const weight: any = await prisma.$queryRaw`
        SELECT pidOrder, SUM(productQuantity * productWeight) as totalWeightx
        FROM products
        WHERE pidOrder = ${pidOrder}
      `;

    //PRODUCTS TOTAL COUNT
    const count = await prisma.products.count({
      where: {
        pidOrder: pidOrder as any,
      },
    });

    //PRODUCTS ALL RECORDS
    const products = await prisma.products.findMany({
      where: {
        pidOrder: pidOrder as any,
      },
    });

    //ORDER CURRENCY, COUNTRY AND SHIPPING PLAN
    const orderRecord = await prisma.orders.findUnique({
      where: { pidOrder: pidOrder as string | undefined },
      select: {
        currencyType: true,
        destinationCountry: true,
        shippingPlan: true,
        orderWeight: true,
        shippingCost1: true,
        orderTotalCost: true,
        status: true,
      },
    });

    //DESTINATION COUNTRY
    const destinationCountry: any = await prisma.country.findUnique({
      where: {
        pidCountry: orderRecord?.destinationCountry as string | undefined,
      },
      select: {
        countryName: true,
      },
    });

    //SHIPPING RATE
    const shippingRate: any = await prisma.shippingplan.findUnique({
      where: {
        countryId: orderRecord?.destinationCountry,
        pidShippingPlan: orderRecord?.shippingPlan,
      } as any,
      select: {
        shippingPlanRate: true,
      },
    });

    //EXCHANGE RATE
    const exRate = await prisma.exchange_rate.findUnique({
      where: { id: 1 as number },
      select: {
        currency_name1: true,
        currency_sign1: true,
        currency_name2: true,
        currency_sign2: true,
        currency_name3: true,
        currency_sign3: true,
        service_charge: true,
        vat: true,
        exNairaToDollar: true,
        exYuanToDollar: true,
        exNairaToYuan: true,
      },
    });

    const totalPriceValue = replaceNullWithZero(price[0].totalPricex);
    const totalWeight = replaceNullWithZero(weight[0].totalWeightx);
    const totalCount = replaceNullWithZero(count);

    //CURRENCY UPDATE
    let totalPrice = totalPriceValue;

    if (orderRecord?.currencyType == 'USD') {
      totalPrice = totalPriceValue;
    }
    if (orderRecord?.currencyType == 'CNY') {
      totalPrice = totalPriceValue / parseFloat(exRate?.exYuanToDollar as any);
    }

    console.log('JESUS CHRIST IS GREAT!!!');

    //CURRENCY UPDATE
    let currencyName = '';
    let currencyLogo = '';

    //currency name
    if (orderRecord?.currencyType == 'USD') {
      currencyName = 'USD';
    }
    if (orderRecord?.currencyType == 'CNY') {
      currencyName = 'Yuan';
    }
    if (orderRecord?.currencyType == 'NGN') {
      currencyName = 'Naira';
    }

    //currency logo
    if (orderRecord?.currencyType == 'USD') {
      currencyLogo = '$';
    }
    if (orderRecord?.currencyType == 'CNY') {
      currencyLogo = '¥';
    }
    if (orderRecord?.currencyType == 'NGN') {
      currencyLogo = '₦';
    }

    //Shipping Plan Name
    let shippingPlanName = orderRecord?.shippingPlan; //value in USD

    //Shipping rate per KG
    let shippingPlanRate = shippingRate.shippingPlanRate || 10; //value in USD

    //Domestic Shipping Cost within China
    let domesticShippingCost = 5; //value in USD

    //International Shipping Cost
    let internationalShippingCost =
      totalWeight * parseFloat(shippingRate.shippingPlanRate);

    //Estimated Total Weight of Order
    let estimatedTotalShippingCost =
      internationalShippingCost + domesticShippingCost;

    //Service Charge
    let serviceChargeValue =
      totalPrice * (parseFloat(exRate?.service_charge as any) / 100);

    //vat value
    let vatValue = serviceChargeValue * (parseFloat(exRate?.vat as any) / 100);

    //Grand Total Cost
    let grandTotalCost = parseFloat(
      totalPrice + estimatedTotalShippingCost + serviceChargeValue + vatValue,
    );

    //INITIAL TOTAL COST
    let initialTotalCost =
      parseFloat(orderRecord?.orderTotalCost as any) || 'NA';

    let amountDifference = grandTotalCost - (initialTotalCost as any); //difference in naira

    //SERVICE CHARGES, EXCHANGE RATES & VAT
    let vat = exRate?.vat ?? 7;
    let serviceCharge = exRate?.service_charge ?? 15;
    let exNairaToDollar = exRate?.exNairaToDollar ?? 1550;
    let exYuanToDollar = exRate?.exYuanToDollar ?? 7.5;
    let exNairaToYuan = exRate?.exNairaToYuan ?? 205;

    //ACTUAL WEIGHT & DOMESTIC SHIPPING COST
    let actualWeight = orderRecord?.orderWeight;
    let actualDomesticShippingCost =
      parseFloat((orderRecord?.shippingCost1 as any) ?? 0) /
      parseFloat((exYuanToDollar as any) ?? 0);
    let actualInternationalShippingCost =
      parseFloat((actualWeight as any) ?? 0) *
      parseFloat((shippingPlanRate as any) ?? 0);
    let actualTotalShippingCost =
      actualDomesticShippingCost + actualInternationalShippingCost;
    let costDifference = actualTotalShippingCost - estimatedTotalShippingCost;

    console.log('JESUS CHRIST IS GREAT!!!');

    // console.log('ACTUAL WEIGHT:', actualWeight);
    // console.log('ACTUAL DOMESTIC SHIPPING COST:', actualDomesticShippingCost);

    //CHECK IF USER NOT IN SAVED ORDER OR IN ON-HOLD ORDER
    const order = await prisma.orders.findUnique({
      where: { pidOrder: pidOrder as string | undefined },
      select: {
        orderShippingCost: true,
        orderTotalCost: true,
        orderWeight: true,
        vat: true,
        serviceCharge: true,
        exchangeRate1: true,
        exchangeRate2: true,
        exchangeRate3: true,
        status: true,
      },
    });

    if (
      order?.status == 'saved' ||
      order?.status == 'on-hold' ||
      order?.status == 'bank-pending-saved-orders' ||
      order?.status == 'bank-pending-shipping-orders'
    ) {
      //if (order?.status == 'saved' || order?.status == 'on-hold') {
      //user the above dynamic values from
    } else {
      grandTotalCost = parseFloat(order?.orderTotalCost as any);
      estimatedTotalShippingCost = parseFloat(order?.orderShippingCost as any);
      vat = parseFloat(order?.vat as any);
      serviceCharge = parseFloat(order?.serviceCharge as any);
      exNairaToDollar = parseFloat(order?.exchangeRate1 as any);
      exYuanToDollar = parseFloat(order?.exchangeRate2 as any);
      exNairaToYuan = parseFloat(order?.exchangeRate3 as any);
    }

    //--------------------------------//RESPONSE//--------------------------------//
    return NextResponse.json({
      //PRODUCTS RECORD TABLE
      productsGetAll: products,

      //TOTAL PRICE
      productsTotalPrice: totalPrice,

      //INITIAL TOTAL COST
      initialTotalCost: orderRecord?.orderTotalCost,
      //initialTotalCost: 30,

      //PRODUCTS TOTAL COUNT
      productsTotalCount: totalCount,

      //TOTAL WEIGHT
      productsTotalWeight: totalWeight,

      //ACTUAL WEIGHT
      actualWeight: actualWeight,

      //ACTUAL DOMESTIC SHIPPING COST
      actualDomesticShippingCost: actualDomesticShippingCost,

      //ACTUAL INTERNATIONAL SHIPPING COST
      actualInternationalShippingCost: actualInternationalShippingCost,

      //ACTUAL TOTAL SHIPPING COST
      actualTotalShippingCost: actualTotalShippingCost,

      //COST DIFFERENCE
      costDifference: costDifference,

      //CURRENCY TYPE, NAME & LOGO
      currencyType: orderRecord?.currencyType,
      currencyName: currencyName,
      currencyLogo: currencyLogo,

      //NAIRA TO DOLLAR EX-RATE
      exNairaToDollar: exNairaToDollar,

      //YUAN TO DOLLAR EX-RATE
      exYuanToDollar: exYuanToDollar,

      //NAIRA TO YUAN EX-RATE
      exNairaToYuan: exNairaToYuan,

      //SERVICE CHARGE PERCENTAGE & VALUE
      serviceCharge: serviceCharge,
      serviceChargeValue: serviceChargeValue,

      //VAT PERCENTAGE & VALUE
      vat: vat,
      vatValue: vatValue,

      //SHIPPING DESTINATION COUNTRY
      destinationCountry: destinationCountry.countryName,

      //SHIPPING PLAN NAME & RATE
      shippingPlanName: shippingPlanName,
      shippingPlanRate: shippingPlanRate,

      //DOMESTIC SHIPPING COST
      domesticShippingCost: domesticShippingCost,

      //INTERNATIONAL SHIPPING COST
      internationalShippingCost: internationalShippingCost,

      //ESTIMATED TOTAL SHIPPING COST
      estimatedTotalShippingCost: estimatedTotalShippingCost,

      //GRAND TOTAL COST IN DOLLARS
      grandTotalCost: grandTotalCost,

      //ON-HOLD DIFFERENCE TOTAL COST IN NAIRA
      onHoldDifference: amountDifference,
      //onHoldDifference: 20,
    });
  } catch (error) {
    console.error('Error calculating total amount:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
