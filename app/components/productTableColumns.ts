// Column widths shared between ProductTable's <th> row and ProductRow's <td> cells
// so header and body columns stay aligned.
export const productTableColumns = {
  title: "w-[34%] max-md:w-[82%]",
  brand: "w-[15%] max-md:hidden",
  category: "w-[17%] max-md:hidden",
  stock: "w-[16%] max-md:hidden",
  price: "w-[11%] max-md:hidden",
  actions: "w-[7%] max-md:w-[18%]",
} as const;
