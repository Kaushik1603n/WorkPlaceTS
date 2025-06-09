function FreelancerBitModalSkeleton() {
  return (
    <main className="flex-1 animate-pulse"> {/* The animate-pulse class provides the loading animation */}
        {/* Skeleton for modal */}
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
          {/* Modal header */}
          <div className="bg-gray-200 p-4 rounded-t-lg flex justify-between items-center">
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Status and date */}
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded-full w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            
            {/* Main info grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-36"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Terms section */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-40"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
            
            {/* IDs section */}
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
          
          {/* Footer buttons */}
          <div className="flex justify-end space-x-2 p-4">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
      
    
    </main>
  );
}

export default FreelancerBitModalSkeleton