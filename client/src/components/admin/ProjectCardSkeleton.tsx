// ProjectCardSkeleton.tsx
function ProjectCardSkeleton() {
  return (
    <div className="relative p-[1px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse overflow-hidden">
      <div className="bg-white rounded-xl p-5 h-full flex flex-col">
        {/* Header with status badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-20 h-5 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse"></div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <div className="w-3/4 h-6 bg-gray-100 rounded-md animate-pulse mb-2"></div>
          <div className="w-1/2 h-5 bg-gray-100 rounded-md animate-pulse"></div>
        </div>
        
        {/* Description */}
        <div className="mb-5 space-y-2 flex-grow">
          <div className="w-full h-3 bg-gray-100 rounded animate-pulse"></div>
          <div className="w-full h-3 bg-gray-100 rounded animate-pulse"></div>
          <div className="w-4/5 h-3 bg-gray-100 rounded animate-pulse"></div>
          <div className="w-3/5 h-3 bg-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Budget and time */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Action button */}
        <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}

export function ProjectCardSkeletonRow({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProjectSectionSkeleton() {
  return (
    <div className="mb-12">
      {/* Section header skeleton */}
      <div className="bg-gray-50 border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div>
                  <div className="w-32 h-7 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Project cards skeleton */}
      <ProjectCardSkeletonRow count={3} />
    </div>
  );
}