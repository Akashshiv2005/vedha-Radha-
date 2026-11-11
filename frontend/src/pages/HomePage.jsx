import React from 'react';
import HeroBanner from '../components/HeroBanner';
import AssuranceStrip from '../components/AssuranceStrip';
import ShopByCollection from '../components/ShopByCollection';
import NewArrivalsSection from '../components/NewArrivalsSection';
import JewelleryLookbook from '../components/JewelleryLookbook';
import CustomerReviews from '../components/CustomerReviews';
import InstagramFeed from '../components/InstagramFeed';
import ContactConciergeSection from '../components/ContactConciergeSection';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function HomePage({
  searchQuery,
  onViewProduct,
  onAddToCart,
  onAddToWishlist,
  wishlistItems
}) {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/collections');
  };

  const handleCategoryNav = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('diamond')) {
      navigate('/diamonds');
    } else if (lower.includes('temple')) {
      navigate('/temple-heritage');
    } else if (lower.includes('bangle')) {
      navigate('/gold/bangles');
    } else if (lower.includes('earring')) {
      navigate('/gold/earrings');
    } else if (lower.includes('chain')) {
      navigate('/gold/chains');
    } else if (lower.includes('pendant')) {
      navigate('/gold/pendants');
    } else if (lower.includes('silver')) {
      navigate('/silver-pooja');
    } else if (lower.includes('gold')) {
      navigate('/gold');
    } else {
      navigate('/collections');
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* 1. Hero Banner: Signature Collection */}
      <HeroBanner onExploreClick={handleExploreClick} />

      {/* 2. Floating Trust & Quality Assurance Strip */}
      <AssuranceStrip />

      {/* 3 & 4. Exclusive Collections Palace Showcase (Categories & Bento Grid) */}
      <ShopByCollection 
        onSelectCategory={handleCategoryNav} 
        onSelectCollection={(coll) => {
          if (coll === 'Bridal') navigate('/bridal');
          else if (coll === 'Temple') navigate('/collections/wedding');
          else if (coll === 'Silver Pooja') navigate('/silver-pooja');
          else navigate('/collections');
        }}
      />

      {/* 5. New Arrivals Product Showcase */}
      <NewArrivalsSection
        onViewProduct={onViewProduct}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        wishlistItems={wishlistItems}
      />

      {/* 6 & 7. Continuous Royal Heritage Magazine & Customer Testimonials Luxury Ivory & Gold Suite */}
      <div className="relative w-full bg-[#FAF3E6]">
        {/* Interactive Royal Jewellery Gazette / Magazine Lookbook */}
        <JewelleryLookbook />

        {/* Loved by Our Customers (Testimonials) */}
        <CustomerReviews />
      </div>

      {/* 8. Follow Us on Instagram */}
      <InstagramFeed />

      {/* 9. Contact & Showroom Concierge (VIP Appointments & Flagship Info) */}
      <ContactConciergeSection />

      {/* 10. Deep Maroon Signature Footer */}
      <Footer />
    </div>
  );
}
