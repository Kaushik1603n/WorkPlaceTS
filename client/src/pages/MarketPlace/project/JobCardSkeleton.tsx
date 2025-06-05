// JobCardSkeleton.tsx

function JobCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between">
                <div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-2 sm:mt-0">
                    <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {[...Array(4)].map((_, index) => (
                    <span
                        key={index}
                        className="bg-gray-200 h-6 w-16 rounded-full"
                    ></span>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

export default JobCardSkeleton;