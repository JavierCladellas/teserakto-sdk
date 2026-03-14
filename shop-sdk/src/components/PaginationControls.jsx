import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex justify-end items-center gap-2 mt-4 px-4 py-2 text-sm">
            <button className={`px-3 py-1 transition select-none flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                type="button"
            >
                <span className="flex items-center justify-center">{<FaChevronLeft/>}</span>
            </button>

            <span className="px-2 text-gray-600">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>

            <button className={`px-3 py-1 transition select-none flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                type="button"
            >
                <FaChevronRight/>
            </button>
        </div>
    );
};

export default PaginationControls;
