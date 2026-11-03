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
import { CustomerAuthProvider } from './context/CustomerAuthContext';

import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProductDetailModal from './components/ProductDetailModal';
import ShowroomModal from './components/ShowroomModal';
import CartDrawer from './components/CartDrawer';
import AccountModal from './components/AccountModal';
import WishlistModal from './components/WishlistModal';
import { cartClient } from './api/cartClient';

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

  // Cart state - loaded from PostgreSQL backend via anonymous cart token
  const [cartItems, setCartItems] = useState([]);

  // Wishlist state - initialized empty for real user interactions
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function initCart() {
      const res = await cartClient.getCart();
      if (isMounted && res.success) {
        setCartItems(res.items);
      }
    }
    initCart();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      cartClient.getCart().then(res => {
        if (res.success) setCartItems(res.items);
      });
    }
  }, [isCartOpen]);

  const handleAddToCart = async (product) => {
    const prodId = product?.id || product?.sku;
    if (prodId) {
      const res = await cartClient.addItem(prodId, 1);
      if (res.success) {
        setCartItems(res.items);
      } else if (res.error) {
        alert(res.error);
      }
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = async (item, index) => {
    const targetItem = item && item.id ? item : cartItems[index];
    if (targetItem?.id) {
      const res = await cartClient.removeItem(targetItem.id);
      if (res.success) {
        setCartItems(res.items);
        return;
      }
    }
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = async () => {
    await cartClient.clearCart();
    setCartItems([]);
  };

  const handleUpdateCartQuantity = async (item, newQuantity) => {
    if (!item?.id) return;
    if (newQuantity < 1) return;

    if (item.isUnique && newQuantity > 1) {
      alert("This authentic handcrafted jewellery piece is unique. Only 1 piece is available.");
      return;
    }

    try {
      const res = await cartClient.updateQuantity(item.id, newQuantity);
      if (res.success) {
        setCartItems(res.items);
      } else if (res.error) {
        alert(res.error);
        const refreshRes = await cartClient.getCart();
        if (refreshRes.success) setCartItems(refreshRes.items);
      }
    } catch (err) {
      console.warn('Failed to update quantity:', err);
    }
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

  const handleMoveToBag = async (item, index) => {
    const prodId = item?.id || item?.sku;
    if (prodId) {
      const res = await cartClient.addItem(prodId, 1);
      if (res.success) {
        setCartItems(res.items);
      }
    }
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
    <CustomerAuthProvider>
      <AuthProvider>
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] flex flex-col font-sans selection:bg-[#581923] selection:text-white relative">
        <ScrollToTop />

        {/* Shared Persistent Header Across All Storefront Routes */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
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

          {/* Full Shopping Cart Page */}
          <Route 
            path="/cart" 
            element={
              <CartPage 
                onCartUpdated={(items) => {
                  setCartItems(items);
                }} 
              />
            } 
          />

          {/* Checkout & Order Fulfillment Flow */}
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage 
                onCartUpdated={async () => {
                  const res = await cartClient.getCart();
                  if (res.success) setCartItems(res.items);
                }} 
              />
            } 
          />
          <Route 
            path="/order-confirmation/:orderNumber" 
            element={<OrderConfirmationPage />} 
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

      {/* Bottom Center Credit for all other storefront pages */}
      {location.pathname !== '/' && (
        <footer className="bg-[#FAF7F2] border-t border-[#DECDBB]/60 py-4 text-center text-xs text-[#73655C]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <span>Designed &amp; Developed by </span>
            <a
              href="https://www.izonetech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#581923] font-semibold hover:underline hover:text-[#7A2332] transition-colors"
            >
              Izone Technologies
            </a>
          </div>
        </footer>
      )}

      {/* Shared Modals & Drawers */}
      <ProductDetailModal
        key={selectedProduct?.id || 'no-product'}
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
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
      />

      </div>
      </AuthProvider>
    </CustomerAuthProvider>
  );
}

