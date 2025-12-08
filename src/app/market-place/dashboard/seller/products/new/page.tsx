import { getCategoriesAction } from "@/actions/category/categories";
import ProductForm from "../../_component/ProductForm";

const CreateProductPage = async () => {
  const res = await getCategoriesAction();
  return (
    <div>
      <ProductForm categories={res.categories ?? []} />
    </div>
  );
};

export default CreateProductPage;
