import React from "react";

interface PendingBookingModalProps {
    isOpen: boolean;
    bookingInfo: {
        origin: string;
        destination: string;
        totalPrice: string;
        passengers: number;
        expiredTime?: string; // Optional expiry time
    } | null;
    onContinue: () => void;
    onDiscard: () => void;
    isLoading?: boolean;
}

const PendingBookingModal: React.FC<PendingBookingModalProps> = ({
    isOpen,
    bookingInfo,
    onContinue,
    onDiscard,
    isLoading = false,
}) => {
    if (!isOpen || !bookingInfo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-display">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 m-4">
                <div className="flex items-center gap-3 mb-4 text-orange-600">
                    <span className="material-symbols-outlined text-3xl">pending_actions</span>
                    <h3 className="text-xl font-bold text-gray-900">Pending Booking Found</h3>
                </div>

                <p className="text-gray-600 mb-6">
                    You have an unfinished booking from <strong className="text-gray-900">{bookingInfo.origin}</strong> to <strong className="text-gray-900">{bookingInfo.destination}</strong>.
                </p>

                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Total Price</span>
                        <span className="font-bold text-primary">{bookingInfo.totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Passengers</span>
                        <span className="font-medium text-gray-900">{bookingInfo.passengers} pax</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onContinue}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex justify-center items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                Resuming...
                            </>
                        ) : (
                            "Continue Booking"
                        )}

                    </button>
                    <button
                        onClick={onDiscard}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-white text-gray-500 font-medium rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                    >
                        Ignore & Search New
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingBookingModal;
