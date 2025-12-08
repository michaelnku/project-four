import { getCurrentUserProfile } from "@/actions/getCurrentUserProfile";
import ProfilePage from "../../_component/ProfilePages";

export default async function Page() {
  const user = await getCurrentUserProfile();

  return (
    <main className="px-2">
      <h1 className="text-2xl md:ml-62 py-12 -mb-6 font-semibold">
        My Profile
      </h1>
      <ProfilePage initialUser={user} />
    </main>
  );
}
