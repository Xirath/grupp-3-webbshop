"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "../types";

interface SearchBarProps {
  categories: Category[];
}

export default function SearchBar({ categories }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoryId") ?? "",
  );

  const [selectedStock, setSelectedStock] = useState(
    searchParams.get("stock") ?? "",
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory) {
      params.set("categoryId", selectedCategory);
    } else {
      params.delete("categoryId");
    }

    if (selectedStock) {
      params.set("stock", selectedStock);
    } else {
      params.delete("stock");
    }

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="page-container">
      <div
        role="search"
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center"
      >
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>

        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400"
        />

        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>

        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="stock-filter" className="sr-only">
          Filter by stock status
        </label>

        <select
          id="stock-filter"
          value={selectedStock}
          onChange={(event) => setSelectedStock(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <button
          type="button"
          onClick={handleFilter}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Filter size={16} fill="currentColor" aria-hidden="true" />
          Filter
        </button>
      </div>
    </div>
  );
}
