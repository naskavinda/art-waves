import { Review } from '../../types/product';
import { StarRating } from '../shared/StarRating';
import { formatDate } from '../../utils/dateUtils';
import { useState, useMemo } from 'react';
import { FaStar } from 'react-icons/fa';

interface ReviewListProps {
    reviews: Review[];
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
};

const getRandomColor = (name: string) => {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
};

const REVIEWS_PER_PAGE = 3;

export const ReviewList = ({ reviews }: ReviewListProps) => {
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate rating distribution
    const ratingStats = useMemo(() => {
        const stats = Array(5).fill(0);
        reviews.forEach(review => {
            stats[review.rating - 1]++;
        });
        return stats.map((count, index) => ({
            rating: index + 1,
            count,
            percentage: (count / reviews.length) * 100 || 0
        }));
    }, [reviews]);

    // Filter and paginate reviews
    const filteredReviews = useMemo(() => {
        let filtered = reviews;
        if (selectedRating !== null) {
            filtered = reviews.filter(review => review.rating === selectedRating);
        }
        return filtered;
    }, [reviews, selectedRating]);

    const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of review section
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div id="reviews-section" className="mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-gray-900">{reviews.length}</span>
                    <span className="text-gray-500">Reviews</span>
                </div>
            </div>

            {/* Rating Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rating */}
                    <div className="text-center md:text-left">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                            {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0).toFixed(1)}
                        </div>
                        <StarRating 
                            rating={reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0}
                            showCount={false}
                        />
                        <div className="text-sm text-gray-500 mt-2">Based on {reviews.length} reviews</div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {ratingStats.reverse().map(({ rating, count, percentage }) => (
                            <button
                                key={rating}
                                onClick={() => {
                                    setSelectedRating(selectedRating === rating ? null : rating);
                                    setCurrentPage(1);
                                }}
                                className={`w-full flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-colors ${
                                    selectedRating === rating ? 'bg-gray-50' : ''
                                }`}
                            >
                                <div className="flex items-center w-20">
                                    <span className="mr-1">{rating}</span>
                                    <FaStar className="text-yellow-400 w-4 h-4" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="w-12 text-sm text-gray-500">{count}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {selectedRating && (
                <div className="mb-4 flex items-center">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {selectedRating} Star{selectedRating !== 1 ? 's' : ''}
                        <button
                            onClick={() => {
                                setSelectedRating(null);
                                setCurrentPage(1);
                            }}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </span>
                </div>
            )}

            <div className="space-y-6">
                {paginatedReviews.map((review, index) => (
                    <div
                        key={review.id}
                        className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md animate-fadeIn delay-100"
                        style={{ 
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        <div className="flex items-start space-x-4">
                            <div className={`flex-shrink-0 w-12 h-12 ${getRandomColor(review.reviewer_name)} rounded-full flex items-center justify-center text-white font-medium transition-transform hover:scale-105`}>
                                {getInitials(review.reviewer_name)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {review.reviewer_name}
                                    </h3>
                                    <time className="text-sm text-gray-500" dateTime={review.date}>
                                        {formatDate(review.date)}
                                    </time>
                                </div>
                                
                                <div className="mb-3">
                                    <StarRating rating={review.rating} showCount={false} />
                                </div>
                                
                                <div className="prose prose-sm max-w-none text-gray-700">
                                    <p className="leading-relaxed">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === i + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
            
            {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {reviews.length === 0 
                            ? "No reviews yet. Be the first to review this product!"
                            : "No reviews found with the selected filter."}
                    </p>
                </div>
            )}
        </div>
    );
};
