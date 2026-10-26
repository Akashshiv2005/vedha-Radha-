import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ShopByCollection from '../components/ShopByCollection';
import FeaturedJewellery from '../components/FeaturedJewellery';
import BridalHeroBanner from '../components/BridalHeroBanner';
import SacredHeroBanner from '../components/SacredHeroBanner';
import VedhaRadhaExperience from '../components/VedhaRadhaExperience';
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
    if (lower.includes('chain')) {
      navigate('/gold');
    } else if (lower.includes('ring')) {
      navigate('/gold');
    } else if (lower.includes('bangle')) {
      navigate('/gold');
    } else if (lower.includes('necklace')) {
      navigate('/gold');
    } else if (lower.includes('temple')) {
      navigate('/collections/wedding');
    } else if (lower.includes('silver')) {
      navigate('/silver');
    } else if (lower === 'gold') {
      navigate('/gold');
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
          onSelectCollection={(coll) => navigate('/collections')}
        />
      </div>

      {/* 4. Bridal Collection Campaign Hero */}
      <BridalHeroBanner onExploreClick={() => navigate('/collections/wedding')} />

      {/* 5. Sacred Collection Campaign Banner */}
      <SacredHeroBanner onExploreClick={() => navigate('/silver')} />

      {/* 6. The Vedha Radha Experience Section */}
      <VedhaRadhaExperience
        onTileClick={(id) => {
          if (id === 'showroom') navigate('/contact');
          else if (id === 'bridal-styling') navigate('/collections/wedding');
          else if (id === 'stories-inspiration') navigate('/collections');
          else navigate('/contact');
        }}
      />

      {/* 7. Assurance Strip */}
      <AssuranceStrip />

      {/* 6. Delivery & Footer Info */}
      <DeliveryCheck />
    </div>
  );
}
