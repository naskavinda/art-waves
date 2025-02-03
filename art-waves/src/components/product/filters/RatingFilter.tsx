import { FaStar } from 'react-icons/fa';

interface RatingFilterProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

export const RatingFilter = ({ rating, onRatingChange }: RatingFilterProps) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Rating</h3>
                {rating > 0 && (
                    <button
                        onClick={() => onRatingChange(0)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                        <span>Clear</span>
                    </button>
                )}
            </div>
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onRatingChange(star)}
                        className="group p-1 transition-all duration-200 hover:scale-110"
                        title={`${star} star${star > 1 ? 's' : ''} and above`}
                    >
                        <FaStar 
                            className={`w-6 h-6 transition-colors duration-200 ${
                                star <= rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 group-hover:text-yellow-200'
                            }`}
                        />
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                    Showing {rating} {rating === 1 ? 'star' : 'stars'} & above
                </p>
            )}
        </div>
    );
};
