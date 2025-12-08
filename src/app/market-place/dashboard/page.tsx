import { CurrentUser } from "@/lib/currentUser";
import { RoleBasedPageContent } from "../_component/RoleBasedPageContent";

const page = async () => {
  const user = await CurrentUser();
  return (
    <div>
      <RoleBasedPageContent initialUser={user} />
    </div>
  );
};

export default page;
