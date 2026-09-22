import type { Product } from "@/app/types";
import ProductRow from "./ProductRow";
import { Pagination } from "./Pagination/Pagination";
import { productTableColumns } from "./productTableColumns";

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

const thBase =
  "border-b border-[#dddddd] bg-[#fafafa] px-3.5 py-4 text-left text-[13px] font-semibold text-[#444444] max-md:px-2.5 max-md:py-3";

export default function ProductTable({
  products,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: ProductTableProps) {
  return (
    <>
      <section className="mt-6 w-full overflow-x-auto rounded-lg border border-[#dcdcdc] bg-white max-md:mt-4 max-md:overflow-x-hidden">
        <table className="w-full table-auto border-collapse max-md:table-fixed">
          <thead>
            <tr>
              <th className={`${thBase} ${productTableColumns.title}`}>
                Title
              </th>

              <th
                className={`${thBase} ${productTableColumns.brand} whitespace-nowrap`}
              >
                Brand
              </th>

              <th
                className={`${thBase} ${productTableColumns.category} whitespace-nowrap`}
              >
                Category
              </th>

              <th
                className={`${thBase} ${productTableColumns.stock} whitespace-nowrap`}
              >
                Stock
              </th>

              <th
                className={`${thBase} ${productTableColumns.price} whitespace-nowrap`}
              >
                Price
              </th>

              <th
                className={`${thBase} ${productTableColumns.actions} whitespace-nowrap`}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-[#8a8a8a]"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="border-t border-[#e5e5e5] bg-[#fafafa]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      </section>
    </>
  );
}
