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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-indigo-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-indigo-600">Products</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageGallery images={product.images} productName={product.name} />

            <div className="space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  <StarRating
                    rating={product.average_rating}
                    reviewCount={product.review_count}
                  />
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">SKU: {product.id}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
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
              <div className="prose prose-indigo">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-3 text-lg font-semibold"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-full py-4 rounded-xl border-2 flex items-center justify-center space-x-3 text-lg font-semibold transition-all ${
                    isInWishlist
                      ? "text-red-500 border-red-500 bg-red-50"
                      : "text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <FaHeart className="h-5 w-5" />
                  <span>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center p-4">
                  <TbTruckDelivery className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over $100</p>
                </div>
                <div className="text-center p-4">
                  <MdSecurity className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure payment</p>
                </div>
                <div className="text-center p-4">
                  <BsBoxSeam className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 day returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews and Related Products */}
        <div className="space-y-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <ReviewList reviews={product.reviews} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};
