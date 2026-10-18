import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GoldPage from './pages/GoldPage';
import SilverPage from './pages/SilverPage';
import CoinsBarsPage from './pages/CoinsBarsPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import CollectionsCatalogPage from './pages/CollectionsCatalogPage';
import BridalPage from './pages/BridalPage';
import OffersPage from './pages/OffersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import { AuthProvider, RequireAuth } from './context/AuthContext';

import ProductDetailPage from './pages/ProductDetailPage';
import ProductDetailModal from './components/ProductDetailModal';
import ShowroomModal from './components/ShowroomModal';
import CartDrawer from './components/CartDrawer';
import AccountModal from './components/AccountModal';
import WishlistModal from './components/WishlistModal';
import { products } from './data/products';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prevPathRef = React.useRef(pathname);

  useEffect(() => {
    const isGoldSubNavigation = pathname.startsWith('/gold') && prevPathRef.current.startsWith('/gold');
    const isSilverSubNavigation = pathname.startsWith('/silver') && prevPathRef.current.startsWith('/silver');

    if (!isGoldSubNavigation && !isSilverSubNavigation) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname, search]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([
    products[0] // 1 sample item in bag
  ]);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([
    products[0], // Temple Lakshmi Gold Necklace
    products[1]  // Classic Silver Anklet
  ]);

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (index) => {
    setWishlistItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveToBag = (item, index) => {
    setCartItems(prev => [...prev, item]);
    setWishlistItems(prev => prev.filter((_, idx) => idx !== index));
    setIsCartOpen(true);
  };

  // If on Admin routes, render AuthProvider with Login & Protected Dashboard
  if (isAdminRoute) {
    return (
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            } 
          />
        </Routes>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] flex flex-col font-sans selection:bg-[#581923] selection:text-white relative">
        <ScrollToTop />

        {/* Shared Persistent Header Across All Storefront Routes */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cartItems.length}
          wishlistCount={wishlistItems.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
        />

        {/* Multi-Page Routes for Gold, Silver, Coins & Bars, New Arrivals, Collections */}
        <main className="flex-grow">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              } 
            />

          {/* Home */}
          <Route 
            path="/" 
            element={
              <HomePage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
              />
            } 
          />

          {/* 1. Gold Routes */}
          <Route 
            path="/gold" 
            element={
              <GoldPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/gold/:subCategory" 
            element={
              <GoldPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/gold/:category/:subType" 
            element={
              <GoldPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />

          {/* 2. Silver Routes */}
          <Route 
            path="/silver" 
            element={
              <SilverPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/silver/:subCategory" 
            element={
              <SilverPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/silver/:category/:subType" 
            element={
              <SilverPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />

          {/* 3. Coins & Bars Routes */}
          <Route 
            path="/coins-bars" 
            element={
              <CoinsBarsPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/coins-bars/:subCategory" 
            element={
              <CoinsBarsPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />

          {/* 4. New Arrivals Route */}
          <Route 
            path="/new-arrivals" 
            element={
              <NewArrivalsPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />

          {/* 5. Collections Routes */}
          <Route 
            path="/collections" 
            element={
              <CollectionsCatalogPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/collections/:subCategory" 
            element={
              <CollectionsCatalogPage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />

          {/* Additional / Footer Routes */}
          <Route 
            path="/bridal" 
            element={
              <BridalPage 
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/jewellery" 
            element={
              <GoldPage 
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />
          <Route 
            path="/offers" 
            element={<OffersPage />} 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          <Route 
            path="/contact" 
            element={<ContactPage />} 
          />

          {/* Dedicated Full Product Page Route */}
          <Route 
            path="/product/:productId" 
            element={
              <ProductDetailPage 
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlistItems={wishlistItems}
              />
            } 
          />

          {/* Fallback */}
          <Route 
            path="*" 
            element={
              <HomePage 
                searchQuery={searchQuery}
                onViewProduct={(p) => setSelectedProduct(p)}
              />
            } 
          />
        </Routes>
      </main>

      {/* Shared Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isWishlisted={wishlistItems.some(item => item.id === selectedProduct?.id)}
        onSelectRelatedProduct={(p) => setSelectedProduct(p)}
      />

      <ShowroomModal
        isOpen={isShowroomOpen}
        onClose={() => setIsShowroomOpen(false)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToBag={handleMoveToBag}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      </div>
    </AuthProvider>
  );
}

