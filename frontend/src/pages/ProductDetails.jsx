import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useStore from '../store/useStore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', userName: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductAndReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5005/api/products/${id}`);
        const data = await response.json();
        if (data.success) {
          const p = data.data;
          const productId = p._id || p.id;
          setProduct({
            id: productId,
            title: p.name,
            salePrice: p.price,
            originalPrice: p.compareAtPrice,
            category: p.subcategory || p.category,
            section: p.category,
            image: p.images && p.images.length > 0 ? p.images[0].url : '',
            description: p.description
          });

          // Fetch reviews
          const revRes = await fetch(`http://localhost:5005/api/reviews/product/${productId}`);
          const revData = await revRes.json();
          if(revData.success) {
            setReviews(revData.data);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment) return;
    setSubmittingReview(true);
    setReviewMsg('');
    try {
      const response = await fetch('http://localhost:5005/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          userName: reviewForm.userName || 'Anonymous User'
        })
      });
      const data = await response.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setReviewForm({ rating: 5, comment: '', userName: '' });
        setReviewMsg('Review added successfully!');
      } else {
        setReviewMsg('Failed to add review.');
      }
    } catch (err) {
      setReviewMsg('Network error.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-gray-600 underline">Go Back</button>
        </div>
      </div>
    );
  }

  const isLiked = wishlist.some(item => item.id === product.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] relative overflow-hidden">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 group w-fit"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full aspect-square bg-[#F9F9F9] rounded-sm overflow-hidden shadow-2xl shadow-gray-200/50">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="mb-2 uppercase tracking-[0.2em] text-[0.65rem] text-gray-500 font-bold">
              {product.category.replace('-', ' ')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 leading-tight mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-end space-x-4 mb-6">
              <span className="text-2xl font-medium text-red-600">
                Rs. {product.salePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-lg text-gray-400 line-through pb-0.5">
                Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="w-full h-px bg-gray-200 my-6"></div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-gray-900 text-white font-medium py-4 px-8 tracking-widest text-sm hover:bg-gray-800 transition-colors flex items-center justify-center group shadow-md"
              >
                <ShoppingBag size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                ADD TO BAG
              </button>
              
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-full sm:w-auto px-8 py-4 border transition-colors flex items-center justify-center ${isLiked ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-900 hover:border-gray-900'}`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? '' : 'text-gray-500'} />
              </button>
            </div>

            {/* Shipping & Promises */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Truck size={18} className="mr-3 text-gray-400" />
                <span>Free nationwide shipping on orders over Rs. 2000</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck size={18} className="mr-3 text-gray-400" />
                <span>Secure payments & authenticated artisan quality</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={18} className="mr-3 text-gray-400" />
                <span>Estimated dispatch in 2-3 business days</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-serif text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* List Reviews */}
            <div className="w-full lg:w-2/3 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                
                {reviewMsg && (
                  <div className={`p-3 mb-4 text-sm font-medium ${reviewMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {reviewMsg}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Your Name (Optional)</label>
                    <input 
                      type="text" 
                      value={reviewForm.userName}
                      onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Rating</label>
                    <select 
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm bg-transparent"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Review</label>
                    <textarea 
                      required
                      rows={3} 
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm resize-none"
                      placeholder="Share your thoughts..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="w-full bg-gray-900 text-white font-medium py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors uppercase mt-2 disabled:bg-gray-400"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
