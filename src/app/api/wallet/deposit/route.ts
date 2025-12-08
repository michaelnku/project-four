import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { amount, userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Wallet Deposit" },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/wallet?success=1`,
    cancel_url: `${process.env.FRONTEND_URL}/wallet?canceled=1`,
    metadata: { userId, amount },
  });

  return Response.json({ url: session.url });
}
