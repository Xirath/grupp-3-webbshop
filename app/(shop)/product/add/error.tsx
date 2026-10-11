"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="p-6 max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl my-6 text-center">
      <h2 className="text-xl font-bold text-red-700 mb-2">
        Something went wrong!
      </h2>
      <p className="text-sm text-red-600 mb-4">
        {error.message || "Could not fetch required form data."}
      </p>
      
      <button
        onClick={() => reset()} // Fetching dobara retry karega
        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}