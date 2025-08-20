import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllProducts } from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Products.css';
import { 
  Shield, Star, Heart, Filter, ChevronDown, Grid, List, 
  TrendingUp, Clock, Award, Package, Search, ShoppingCart,
  Menu, X, ChevronLeft, ChevronRight, Zap, Tag, ArrowUpDown,
  Home, ShoppingBag, Users, Info, HelpCircle, LogIn, Store,
  CreditCard
} from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 12;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
    loadProducts();
  }, []);

  // Sample products data (fallback)
  const sampleProducts = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      seller: { name: "TechStore_Official", socialId: "@techstore_official", verified: true, rating: 4.8 },
      price: 2999,
      originalPrice: 4999,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      category: "electronics",
      rating: 4.5,
      reviews: 234,
      discount: 40,
      isProtected: true,
      isTrending: true,
      badge: "Best Seller"
    },
    {
      id: 2,
      title: "Designer Leather Handbag",
      seller: { name: "FashionHub", socialId: "@fashionhub", verified: true, rating: 4.6 },
      price: 3499,
      originalPrice: 6999,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
      category: "fashion",
      rating: 4.3,
      reviews: 156,
      discount: 50,
      isProtected: true,
      badge: "Limited Edition"
    },
    {
      id: 3,
      title: "Smart Watch Series 6",
      seller: { name: "GadgetZone", socialId: "@gadgetzone", verified: true, rating: 4.7 },
      price: 12999,
      originalPrice: 19999,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
      category: "electronics",
      rating: 4.6,
      reviews: 512,
      discount: 35,
      isProtected: true,
      isTrending: true,
      badge: "New Arrival"
    },
    {
      id: 4,
      title: "Professional Camera Lens",
      seller: { name: "PhotoPro", socialId: "@photopro", verified: true, rating: 4.9 },
      price: 45999,
      originalPrice: 59999,
      image: "https://images.unsplash.com/photo-1606986628025-35d57e735ae4?w=400",
      category: "electronics",
      rating: 4.8,
      reviews: 89,
      discount: 23,
      isProtected: true
    },
    {
      id: 5,
      title: "Organic Skincare Set",
      seller: { name: "BeautyNature", socialId: "@beautynature", verified: false, rating: 4.2 },
      price: 1999,
      originalPrice: 2999,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      category: "beauty",
      rating: 4.2,
      reviews: 178,
      discount: 33,
      isProtected: true
    },
    {
      id: 6,
      title: "Gaming Mechanical Keyboard",
      seller: { name: "GamersParadise", socialId: "@gamersparadise", verified: true, rating: 4.5 },
      price: 4999,
      originalPrice: 7999,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
      category: "electronics",
      rating: 4.4,
      reviews: 342,
      discount: 38,
      isProtected: true,
      badge: "Gaming Special"
    },
    {
      id: 7,
      title: "Yoga Mat Premium",
      seller: { name: "FitnessFirst", socialId: "@fitnessfirst", verified: true, rating: 4.3 },
      price: 999,
      originalPrice: 1999,
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
      category: "fitness",
      rating: 4.1,
      reviews: 267,
      discount: 50,
      isProtected: true
    },
    {
      id: 8,
      title: "Vintage Denim Jacket",
      seller: { name: "RetroStyle", socialId: "@retrostyle", verified: true, rating: 4.6 },
      price: 2499,
      originalPrice: 3999,
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400",
      category: "fashion",
      rating: 4.5,
      reviews: 198,
      discount: 38,
      isProtected: true,
      isTrending: true
    },
    {
      id: 9,
      title: "Bluetooth Speaker Waterproof",
      seller: { name: "AudioTech", socialId: "@audiotech", verified: true, rating: 4.4 },
      price: 3999,
      originalPrice: 5999,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
      category: "electronics",
      rating: 4.3,
      reviews: 421,
      discount: 33,
      isProtected: true,
      badge: "Top Rated"
    },
    {
      id: 10,
      title: "Running Shoes Pro",
      seller: { name: "SportZone", socialId: "@sportzone", verified: true, rating: 4.7 },
      price: 5999,
      originalPrice: 8999,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      category: "fitness",
      rating: 4.6,
      reviews: 892,
      discount: 33,
      isProtected: true,
      isTrending: true
    },
    {
      id: 11,
      title: "Luxury Perfume Collection",
      seller: { name: "FragranceWorld", socialId: "@fragranceworld", verified: true, rating: 4.5 },
      price: 7999,
      originalPrice: 11999,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      category: "beauty",
      rating: 4.4,
      reviews: 156,
      discount: 33,
      isProtected: true,
      badge: "Exclusive"
    },
    {
      id: 12,
      title: "Tablet 10 inch Display",
      seller: { name: "TechGiant", socialId: "@techgiant", verified: true, rating: 4.8 },
      price: 19999,
      originalPrice: 29999,
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
      category: "electronics",
      rating: 4.7,
      reviews: 678,
      discount: 33,
      isProtected: true
    },
    {
      id: 13,
      title: "Summer Dress Collection",
      seller: { name: "StyleBoutique", socialId: "@styleboutique", verified: false, rating: 4.3 },
      price: 1999,
      originalPrice: 3499,
      image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400",
      category: "fashion",
      rating: 4.2,
      reviews: 234,
      discount: 43,
      isProtected: true
    },
    {
      id: 14,
      title: "Fitness Tracker Band",
      seller: { name: "HealthTech", socialId: "@healthtech", verified: true, rating: 4.6 },
      price: 2999,
      originalPrice: 4999,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400",
      category: "fitness",
      rating: 4.5,
      reviews: 567,
      discount: 40,
      isProtected: true,
      isTrending: true
    },
    {
      id: 15,
      title: "Makeup Brush Set Professional",
      seller: { name: "BeautyPro", socialId: "@beautypro", verified: true, rating: 4.7 },
      price: 1499,
      originalPrice: 2499,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
      category: "beauty",
      rating: 4.6,
      reviews: 345,
      discount: 40,
      isProtected: true
    },
    {
      id: 16,
      title: "Gaming Console Controller",
      seller: { name: "GameWorld", socialId: "@gameworld", verified: true, rating: 4.8 },
      price: 3999,
      originalPrice: 5999,
      image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400",
      category: "electronics",
      rating: 4.7,
      reviews: 789,
      discount: 33,
      isProtected: true,
      badge: "Gamer's Choice"
    }
  ];

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllProducts();
      if (response && response.data && response.data.length > 0) {
        const formattedProducts = response.data.map(p => ({
          ...p,
          id: p._id || p.id,
          discount: p.discount || 0,
          isProtected: p.isProtected !== undefined ? p.isProtected : true,
          seller: p.seller || { name: "Unknown Seller", socialId: "@unknown", verified: false, rating: 0 }
        }));
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } else {
        // Use sample products if API returns no data
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Fallback to sample products
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and Sort functions
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.seller?.name && p.seller.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch(sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy, priceRange, searchQuery]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle price range change
  const handlePriceRangeChange = (value, type) => {
    const numValue = parseInt(value) || 0;
    if (type === 'min') {
      setPriceRange([Math.min(numValue, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(numValue, priceRange[0])]);
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/checkout/${product.id}`);
  };

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    // Implement cart functionality here
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && !event.target.closest('.sidebar-nav') && !event.target.closest('.menu-toggle-btn')) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSidebar]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🛍' },
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'fashion', label: 'Fashion', icon: '👕' },
    { value: 'beauty', label: 'Beauty', icon: '💄' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
  ];

  return (
    <div className="all-products-page">
      {/* Sidebar Navigation */}
      <nav className={`sidebar-nav ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <ShoppingBag className="logo-icon" />
            <h2>InstaMarket</h2>
          </div>
          <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="nav-menu">
          <Link to="/" className="nav-item" onClick={() => setShowSidebar(false)}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          
          <Link to="/products" className="nav-item active" onClick={() => setShowSidebar(false)}>
            <ShoppingBag size={20} />
            <span>Products</span>
          </Link>
          
          <Link to="/community-cart" className="nav-item" onClick={() => setShowSidebar(false)}>
            <Users size={20} />
            <span>Community Cart</span>
          </Link>
          
          <Link to="/seller-dashboard" className="nav-item" onClick={() => setShowSidebar(false)}>
            <Store size={20} />
            <span>Seller Hub</span>
          </Link>
          
          <Link to="/about" className="nav-item" onClick={() => setShowSidebar(false)}>
            <Info size={20} />
            <span>About Us</span>
          </Link>
          
          <Link to="/why-trust" className="nav-item" onClick={() => setShowSidebar(false)}>
            <HelpCircle size={20} />
            <span>Why Trust Us</span>
          </Link>
        </div>
        
        <div className="nav-actions">
          <Link to="/login" className="nav-button login-btn" onClick={() => setShowSidebar(false)}>
            <LogIn size={18} />
            <span>Login</span>
          </Link>
        </div>
      </nav>

      {/* Overlay */}
      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />}

      {/* Header */}
      <header className="header" data-aos="fade-down">
        <div className="header-container">
          <button className="menu-toggle-btn" onClick={() => setShowSidebar(true)}>
            <Menu size={24} />
          </button>

          <div className="logo-section">
            <Shield className="logo-icon" />
            <h1 className="logo-text">InstaMarket</h1>
          </div>
          
          <div className="search-bar">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <Link to="/wishlist" className="icon-btn">
              <Heart />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="icon-btn">
              <ShoppingCart />
              <span className="badge">3</span>
            </Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setShowMobileFilter(!showMobileFilter)}>
            <Filter />
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner" data-aos="fade">
        <div className="banner-content">
          <div className="banner-text">
            <h2 className="banner-title">
              <Zap className="zap-icon" />
              Flash Sale Live Now!
            </h2>
            <p className="banner-subtitle">Up to 70% OFF on verified sellers</p>
            <div className="banner-timer">
              <Clock className="timer-icon" />
              <span>Ends in: 23:59:45</span>
            </div>
          </div>
          <div className="banner-badges">
            <div className="trust-badge">
              <Shield />
              <span>100% Protected</span>
            </div>
            <div className="trust-badge">
              <Award />
              <span>Verified Sellers</span>
            </div>
            <div className="trust-badge">
              <Package />
              <span>Safe Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="categories-bar" data-aos="fade-up">
        <div className="categories-container">
          {categories.map((cat, index) => (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
              data-aos="zoom-in"
              data-aos-delay={index * 50}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="main-content">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showMobileFilter ? 'show' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="close-filter" onClick={() => setShowMobileFilter(false)}>
              <X />
            </button>
          </div>

          <div className="filter-section" data-aos="fade-right">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input 
                type="number" 
                placeholder="Min" 
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(e.target.value, 'min')}
                min="0"
                max={priceRange[1]}
              />
              <span>to</span>
              <input 
                type="number" 
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(e.target.value, 'max')}
                min={priceRange[0]}
                max="50000"
              />
            </div>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="price-slider"
            />
            <div className="price-range-display">
              ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </div>
          </div>

          <div className="filter-section" data-aos="fade-right" data-aos-delay="100">
            <h4>Seller Rating</h4>
            <div className="rating-filters">
              {[4, 3, 2].map(rating => (
                <label key={rating} className="checkbox-label">
                  <input type="checkbox" />
                  <div className="stars-filter">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={i < rating ? 'filled' : ''} size={16} />
                    ))}
                  </div>
                  <span>& above</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section" data-aos="fade-right" data-aos-delay="200">
            <h4>Special Offers</h4>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Verified Sellers Only</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Trending Now</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>New Arrivals</span>
            </label>
          </div>
        </aside>

        {/* Products Section */}
        <section className="products-section">
          {/* Toolbar */}
          <div className="toolbar" data-aos="fade-up">
            <div className="results-info">
              <h2>All Products</h2>
              <span>{filteredProducts.length} results found</span>
            </div>
            
            <div className="toolbar-actions">
              <div className="sort-dropdown">
                <ArrowUpDown size={18} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popularity">Popularity</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Discount</option>
                </select>
              </div>
              
              <div className="view-modes">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            /* Products Grid/List */
            <div className={`products-container ${viewMode}`}>
              {currentProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`product-card ${viewMode}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {product.badge && (
                    <div className="product-badge">
                      <Tag size={14} />
                      {product.badge}
                    </div>
                  )}
                  
                  <div className="product-image-container">
                    <img 
                      src={product.image || 'https://via.placeholder.com/400'} 
                      alt={product.title} 
                      className="product-image" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400' }}
                    />
                    <button 
                      className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart />
                    </button>
                    {product.isTrending && (
                      <div className="trending-badge">
                        <TrendingUp size={14} />
                        Trending
                      </div>
                    )}
                    <div className="hover-actions">
                      <button className="quick-view-btn">Quick View</button>
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="seller-info">
                      <span className="seller-name">
                        {product.seller?.name || 'Unknown Seller'}
                        {product.seller?.verified && <Shield className="verified-icon" />}
                      </span>
                      <span className="seller-social">{product.seller?.socialId || '@unknown'}</span>
                    </div>

                    <h3 className="product-title">{product.title}</h3>

                    <div className="rating-section">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={i < Math.floor(product.rating || 0) ? 'filled' : ''}
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="rating-text">{product.rating || 0} ({product.reviews || 0})</span>
                    </div>

                    <div className="price-section">
                      <span className="current-price">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                      {product.discount > 0 && (
                        <span className="discount">{product.discount}% OFF</span>
                      )}
                    </div>

                    {product.isProtected && (
                      <div className="protection-badge">
                        <Shield size={14} />
                        InstaMarket Protected
                      </div>
                    )}

                    <div className="product-actions">
                      <button 
                        className="buy-now-btn"
                        onClick={() => handleBuyNow(product)}
                      >
                        <CreditCard size={16} />
                        Buy Now
                      </button>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="empty-state">
              <Package size={64} />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" data-aos="fade-up">
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Button */}
      <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
        <Filter />
        Filters
      </button>
    </div>
  );
};

export default Products;
