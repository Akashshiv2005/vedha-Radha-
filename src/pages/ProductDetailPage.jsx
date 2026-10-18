import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductDetailModal from '../components/ProductDetailModal';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function ProductDetailPage({ onAddToCart, onAddToWishlist, wishlistItems = [] }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <div className="w-16 h-16 rounded-full bg-[#581923]/10 text-[#581923] flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#241716] mb-2">
          Jewellery Piece Not Found
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6E65] max-w-md mb-6">
          The requested jewellery piece may have been reserved or moved to our heritage vault.
        </p>
        <Link
          to="/gold"
          className="bg-[#581923] hover:bg-[#431219] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Gold Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <ProductDetailModal
      product={product}
      onClose={() => navigate(-1)}
      onAddToCart={onAddToCart}
      onAddToWishlist={onAddToWishlist}
      isWishlisted={wishlistItems.some((item) => item.id === product.id)}
      onSelectRelatedProduct={(related) => navigate(`/product/${related.id}`)}
    />
  );
}
