import AddProductForm from "@/app/components/AddProductform";
import { getCategories, getNextId } from "@/app/lib/api";

export default async function AddProductPage() {
  const categories = await getCategories();
  const nextId = await getNextId();

  return (
    <main>
      <AddProductForm categories={categories} nextId={nextId} />
    </main>
  );
}
