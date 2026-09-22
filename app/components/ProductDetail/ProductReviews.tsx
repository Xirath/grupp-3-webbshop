import type { Product } from "@/app/types";

function formatDateOnly(date?: string) {
  if (!date) return "—";
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
      new Date(Number(year), Number(month) - 1, Number(day)),
    );
  }
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        parsedDate,
      );
}

export default function ProductReviews({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Customer Reviews
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
          {product.rating !== undefined && (
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg text-amber-500">
                ★
              </span>
              <span className="font-semibold text-slate-900">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
      {reviews.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {reviews.map((review, index) => (
            <article
              key={`${review.reviewerEmail}-${review.date}-${index}`}
              className="px-5 py-5 sm:px-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {review.reviewerName}
                  </h3>
                  <div
                    className="mt-1 flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={starIndex}
                        aria-hidden="true"
                        className={
                          starIndex < Math.round(review.rating)
                            ? "text-amber-500"
                            : "text-slate-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <time dateTime={review.date} className="text-xs text-slate-500">
                  {formatDateOnly(review.date)}
                </time>
              </div>
              <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-6 text-slate-600">
                {review.comment}
              </p>
              <p className="mt-3 text-xs text-slate-400">
                {review.reviewerEmail}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="px-5 py-10 text-center sm:px-6">
          <p className="text-sm font-medium text-slate-600">
            No customer reviews yet.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Reviews will appear here when customers submit feedback.
          </p>
        </div>
      )}
    </section>
  );
}
