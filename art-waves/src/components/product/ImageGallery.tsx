import { useState } from 'react';
import { Image } from '../../types/product';

interface ImageGalleryProps {
    images: Image[];
    productName: string;
}

export const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img
                    src={images[selectedImage].url}
                    alt={productName}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-w-4 aspect-h-3 rounded-lg overflow-hidden ${
                            selectedImage === index ? 'ring-2 ring-indigo-600' : ''
                        }`}
                    >
                        <img
                            src={image.url}
                            alt={`${productName} ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
