import NavigationBar from "../../../components/navigationBar/NavigationBar"

function JobDetailsSkeleton() {
    return (
        <>
            <NavigationBar />
            <div className="max-w-4xl mx-auto my-8 p-6 bg-[#EFFFF6] rounded-lg shadow-sm border border-[#27AE60]">
                {/* Title Skeleton */}
                <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column Skeleton */}
                    <div>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="mb-8">
                                <div className="h-6 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6 mt-1 animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column Skeleton */}
                    <div>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="mb-8">
                                <div className="h-6 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/5 mt-1 animate-pulse"></div>
                                {i === 3 && (
                                    <>
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mt-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-2/3 mt-1 animate-pulse"></div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Button Skeleton */}
                {/* {user?.role === "freelancer" && ( */}
                <div className="flex justify-end mt-6">
                    <div className="h-10 bg-gray-300 rounded-lg w-24 animate-pulse"></div>
                </div>
                {/* )} */}
            </div>
        </>
    )
}

export default JobDetailsSkeleton
