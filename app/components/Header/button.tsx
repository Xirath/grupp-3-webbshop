
"use client";
import { useRouter } from "next/navigation";
export default function Button() {
    const router = useRouter();
    return(

<button
            type="button"
            onClick={() => router.push("/product/add")}
            className="shrink-0 rounded-lg px-4 py-2 bg-violet-600 sm:mt-4 text-white font-medium hover:bg-violet-700"
          >
            + Add Product
          </button>
    )}
