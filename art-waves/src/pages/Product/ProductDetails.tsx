import { useParams } from "react-router";
import { useGetProductDetailsQuery } from "../../services/productApi";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { MdSecurity } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/features/wishlistSlice";
import { addToCart } from "../../store/features/cartSlice";
import { RootState } from "../../store/store";
import { ProductDetailsData } from "../../types/product";
import { ImageGallery } from "../../components/product/ImageGallery";
import { StarRating } from "../../components/shared/StarRating";
import { ProductPrice } from "../../components/product/ProductPrice";
import { ReviewList } from "../../components/product/ReviewList";
import { RelatedProducts } from "../../components/product/RelatedProducts";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetProductDetailsQuery(Number(id));
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error loading product details
      </div>
    );
  }

  const { product, relatedProducts } = data as ProductDetailsData;
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Breadcrumb */}
        {/* <nav className="mb-4 sm:mb-6 lg:mb-8 overflow-x-auto whitespace-nowrap">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-indigo-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-indigo-600">Products</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav> */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery - Full width on mobile */}
            <div className="w-full">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Product Header */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <StarRating
                    rating={product.average_rating}
                    reviewCount={product.review_count}
                  />
                  <span className="hidden sm:block text-gray-500">|</span>
                  <span className="text-gray-600 text-sm sm:text-base">SKU: {product.id}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <ProductPrice
                  price={product.price}
                  finalPrice={product.final_price}
                  discount={product.discount}
                />
                <p className="mt-2 text-sm text-green-600">
                  {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "Out of Stock"}
                </p>
              </div>

              {/* Description */}
              <div className="prose prose-sm sm:prose prose-indigo max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col space-y-3 sm:space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-3 text-base sm:text-lg font-semibold"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-full py-3 sm:py-4 rounded-xl border-2 flex items-center justify-center space-x-3 text-base sm:text-lg font-semibold transition-all ${
                    isInWishlist
                      ? "text-red-500 border-red-500 bg-red-50"
                      : "text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <FaHeart className="h-5 w-5" />
                  <span>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>

              {/* Features - Grid on tablet and up, scroll on mobile */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-3 min-w-[480px] sm:min-w-0 gap-4 pt-6 border-t">
                  <div className="text-center p-3 sm:p-4">
                    <TbTruckDelivery className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-indigo-600 mb-2" />
                    <p className="text-xs sm:text-sm font-medium">Free Delivery</p>
                    <p className="text-xs text-gray-500">On orders over $100</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <MdSecurity className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-indigo-600 mb-2" />
                    <p className="text-xs sm:text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% secure payment</p>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <BsBoxSeam className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-indigo-600 mb-2" />
                    <p className="text-xs sm:text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-gray-500">30 day returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews and Related Products */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Customer Reviews</h2>
            <ReviewList reviews={product.reviews} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Products</h2>
            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};
