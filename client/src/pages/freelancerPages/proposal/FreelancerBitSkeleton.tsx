function FreelancerBitSkeleton() {
  return (
    <div className="container mx-auto px-4 pb-8">
      <main className="flex-1 animate-pulse"> {/* The animate-pulse class provides the loading animation */}
        <div className="space-y-6">
          {/* Skeleton proposal cards */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border border-gray-200 rounded-lg p-6 bg-white relative shadow-sm"
            >
              <div className="space-y-3">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                {/* Bid and budget */}
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>

                {/* Estimated time */}
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>

                {/* Status button (bottom right) */}
                <div className="absolute bottom-4 right-4 h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>


      </main>
    </div>
  );
}

export default FreelancerBitSkeleton
