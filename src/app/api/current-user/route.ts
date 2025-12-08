import { CurrentUser } from "@/lib/currentUser";

export async function GET() {
  const user = await CurrentUser();
  return Response.json(user ?? null);
}
