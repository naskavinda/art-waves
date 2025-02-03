import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
    showCount?: boolean;
}

export const StarRating = ({ rating, reviewCount, showCount = true }: StarRatingProps) => {
    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'} h-4 w-4`}
            />
        ));
    };

    return (
        <div className="flex items-center">
            <div className="flex items-center">
                {renderStars(rating)}
            </div>
            {showCount && reviewCount !== undefined && (
                <span className="ml-2 text-gray-600">({reviewCount} reviews)</span>
            )}
        </div>
    );
};
