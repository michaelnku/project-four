import Stripe from "stripe";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const {
      cartItems,
      deliveryType,
      userId,
      distanceInMiles,
      deliveryAddress,
    } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // Fetch all products + variants used in the cart
    const products = await prisma.product.findMany({
      where: {
        id: { in: cartItems.map((i: any) => i.productId) },
      },
      include: { variants: true, store: true },
    });

    // Build line items + compute total
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    let subtotal = 0;

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      const variant = product.variants.find((v) => v.id === item.variantId);

      const price = variant?.price ?? product.basePrice;

      subtotal += price * item.quantity;

      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "ngn",
          product_data: { name: product.name },
          unit_amount: price * 100,
        },
      });
    }

    // Calculate shipping
    const rate = 700; // same logic used in your UI
    const shippingFee = Math.round((distanceInMiles ?? 0) * rate);

    const totalAmount = subtotal + shippingFee;

    // Create order with items but do NOT assign sellerGroups yet
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingFee,
        deliveryType,
        deliveryAddress,
        distanceInMiles,
        isPaid: false,
        items: {
          create: cartItems.map((item: any) => ({
            quantity: item.quantity,
            productId: item.productId,
            variantId: item.variantId,
            price:
              products
                .find((p) => p.id === item.productId)
                ?.variants.find((v) => v.id === item.variantId)?.price ??
              products.find((p) => p.id === item.productId)?.basePrice,
          })),
        },
      },
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_STORE_URL}/customer/order/success/${order.id}`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(error.message, { status: 500 });
  }
}
