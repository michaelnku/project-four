import { getCategoriesAction } from "@/actions/category/categories";
import CategoryPageClient from "../categories/page";

const AdminCategoriesPage = async () => {
  const res = await getCategoriesAction();
  return <CategoryPageClient categories={res.categories ?? []} />;
};

export default AdminCategoriesPage;
