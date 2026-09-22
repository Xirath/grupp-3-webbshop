import { Package, CircleCheck, TriangleAlert, CircleX } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export default function SummaryCards({
  total,
  inStock,
  lowStock,
  outOfStock,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: total,
      textColor: "text-purple-800",
      iconColor: "text-purple-800",
      bgColor: "bg-purple-50",
      icon: Package,
    },
    {
      title: "In Stock",
      value: inStock,
      textColor: "text-green-800",
      iconColor: "text-green-800",
      bgColor: "bg-emerald-50",
      icon: CircleCheck,
    },
    {
      title: "Low Stock",
      value: lowStock,
      textColor: "text-orange-600",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      icon: TriangleAlert,
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      textColor: "text-red-800",
      iconColor: "text-red-800",
      bgColor: "bg-rose-50",
      icon: CircleX,
    },
  ];

  return (
    <div className="page-container">
      <section 
        aria-label="Inventory summary statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map(({ title, value, textColor, iconColor, bgColor, icon: Icon }) => (
          <article
            key={title}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{title}</p>
              <p className={`mt-1 text-3xl font-bold tracking-tight ${textColor}`}>
                {value.toLocaleString()}
              </p>
            </div>

            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bgColor}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}