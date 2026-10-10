"use client";

// import { useRouter } from "next/navigation";
import Button from "./Button";

export default function Header() {
  return (
    <main className="bg-white shadow-md">
      <div className="page-container">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Inventory Management
            </h1>

            <p className="wrap-break py-4 text-gray-600">
              Manage and track your global product catalogue across all
              categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button />
          </div>
        </header>
      </div>
    </main>
  );
}
