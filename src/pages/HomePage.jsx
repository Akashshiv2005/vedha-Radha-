import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ShopByCollection from '../components/ShopByCollection';
import FeaturedJewellery from '../components/FeaturedJewellery';
import AssuranceStrip from '../components/AssuranceStrip';
import DeliveryCheck from '../components/DeliveryCheck';
import { useNavigate } from 'react-router-dom';

export default function HomePage({
  searchQuery,
  onViewProduct
}) {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/collections');
  };

  const handleCategoryNav = (cat) => {
    const lower = cat.toLowerCase();
    if (lower === 'gold') {
      navigate('/gold');
    } else if (lower === 'silver') {
      navigate('/silver');
    } else if (lower === 'bridal' || lower === 'wedding') {
      navigate('/collections/wedding');
    } else if (lower === 'handcrafted') {
      navigate('/collections');
    } else {
      navigate('/collections');
    }
  };

  return (
    <div>
      {/* 1. Hero Banner */}
      <HeroBanner onExploreClick={handleExploreClick} />

      {/* 2. Shop by Collection */}
      <ShopByCollection onSelectCategory={handleCategoryNav} />

      {/* 3. Featured Jewellery */}
      <div id="featured-section">
        <FeaturedJewellery
          searchQuery={searchQuery}
          onViewDetails={onViewProduct}
          onViewAllClick={() => navigate('/new-arrivals')}
        />
      </div>

      {/* 4. Assurance Strip */}
      <AssuranceStrip />

      {/* 5. Delivery & Footer Info */}
      <DeliveryCheck />
    </div>
  );
}
