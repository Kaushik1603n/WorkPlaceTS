import FreelancerTicketsTable from './FreelancerTicketsTable';
import Pagination from '../../../components/Pagination';
import useFreelancerTickets from '../../../features/apis/freelancer/useFreelancerTickets';
import ErrorMessage from '../../../components/ui/ErrorMessage';


function FreelcancerTicket() {
    const {
        tickets,
        isLoading,
        error,
        currentPage,
        totalPage,
        setCurrentPage,
        refetch
    } = useFreelancerTickets();
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading tickets...</div>;
    }

    if (error) {
        return (
            <main className="flex-1 p-4">
                <ErrorMessage message={error} onRetry={refetch} />
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Support Tickets</h1>
                    <p className="text-gray-600">Review and respond to tickets raised by You</p>
                </div>

                <FreelancerTicketsTable
                    tickets={tickets}
                />


            </div>
            <div className="flex justify-center mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                    }}
                />
            </div>
        </div>
    );
}

export default FreelcancerTicket
