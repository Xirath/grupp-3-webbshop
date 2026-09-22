

// import { useRouter } from "next/navigation";
import Button from "./button";

export default function Header() {
  // const router = useRouter();

  return (
    <main className="bg-white shadow-md">
      {/* Header of the page with the title "Inventory Management" */}
      <div className="page-container">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col justify-center">
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900">
              Inventory Management
            </h1>

            <p className="py-4 text-gray-600 wrap-break">
              Manage and track your global product catalogue across all categories.
            </p>
          </div>

          <Button />
        </header>
      </div>
    </main>
  );
}
