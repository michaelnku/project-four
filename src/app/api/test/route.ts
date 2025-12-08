import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log("Available Prisma models:", Object.keys(prisma));
  return Response.json({ models: Object.keys(prisma) });
}
