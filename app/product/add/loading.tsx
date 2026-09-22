export default function Loading() {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 my-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
      
      {/* Skeleton for Assigned ID */}
      <div className="p-4 bg-gray-100 rounded-lg mb-4 h-12"></div>

      {/* Skeletons for Input Fields */}
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
      </div>
    </div>
  );
}