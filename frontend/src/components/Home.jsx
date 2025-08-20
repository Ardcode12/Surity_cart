import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './home.css';

// Component now accepts props from App.js as its single source of truth
const HomePage = ({ isAuthenticated, userType, setIsAuthenticated, setUserType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  
  // Local state for UI elements like `isLoggedIn` has been completely REMOVED.
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // The logic to check auth status has been REMOVED; App.js handles this.

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array is correct.

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = () => {
    // 1. Clear all authentication data from browser storage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userInfo');
    
    // 2. Update the global state in App.js to reflect the logout
    setIsAuthenticated(false);
    setUserType(null);
    
    // 3. Close the menu and navigate for a smooth user experience
    setIsMenuOpen(false);
    navigate('/');
  };
  
  // Your static data arrays can remain here as they are not state-dependent
  const categories = [ { id: 1, name: 'Fashion & Apparel', icon: '👗', sellers: '2.5k+', color: '#FF6B6B' }, { id: 2, name: 'Handmade Crafts', icon: '🎨', sellers: '1.8k+', color: '#4ECDC4' }, { id: 3, name: 'Beauty & Skincare', icon: '💄', sellers: '3.2k+', color: '#F7B731' }, { id: 4, name: 'Home Decor', icon: '🏡', sellers: '1.5k+', color: '#5F27CD' }, { id: 5, name: 'Accessories', icon: '💍', sellers: '2.1k+', color: '#00D2D3' }, { id: 6, name: 'Food & Treats', icon: '🍰', sellers: '900+', color: '#FF6348' } ];
  const testimonials = [ { name: "Sarah Johnson", role: "Fashion Buyer", text: "Finally found authentic Instagram sellers in one place! The verification process gives me confidence to buy.", rating: 5 }, { name: "Mike Chen", role: "Instagram Seller", text: "This platform helped me reach customers beyond Instagram. The trust badges really help with conversions!", rating: 5 }, { name: "Priya Patel", role: "Regular Shopper", text: "Love supporting small businesses! The secure payment system makes shopping from Instagram sellers worry-free.", rating: 5 } ];
  const trustFeatures = [ { icon: '🛡️', title: 'Verified Sellers', desc: 'All sellers undergo strict verification process' }, { icon: '💳', title: 'Secure Payments', desc: 'Your money is safe with our escrow system' }, { icon: '📦', title: 'Buyer Protection', desc: 'Full refund if product doesn\'t match description' }, { icon: '⭐', title: 'Genuine Reviews', desc: 'Real feedback from verified purchases only' } ];

  return (
    <div className="homepage">
      {/* Sidebar Navigation */}
      <div className="sidebar-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
          <span></span><span></span><span></span>
        </div>
      </div>

      <div className={`sidebar ${isMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-logo">
            <span className="logo-icon">🛍️</span>
            <h1>InstaMarket</h1>
          </div>
        </div>
        <div className="sidebar-menu">
          <a href="#home" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>Home</a>
          <Link to="/products" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <a href="#categories" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>Categories</a>
          <a href="#about" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="#trust" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>Why Trust Us</a>
          
          <Link to="/login" state={{ defaultTab: 'signup', userType: 'seller' }} className="sidebar-cta" onClick={() => setIsMenuOpen(false)}>
            Start Selling
          </Link>
          
          {/* Conditional rendering now uses the `isAuthenticated` prop from App.js */}
          {isAuthenticated ? (
            <button className="sidebar-login" onClick={handleLogoutClick}>Logout</button>
          ) : (
            <Link to="/login" state={{ defaultTab: 'login' }} className="sidebar-login" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <div className="hero-content">
          <h2 className="hero-title" data-aos="fade-right">
            Connect with Trusted <span className="gradient-text"> Instagram Sellers</span>
          </h2>
          <p className="hero-subtitle" data-aos="fade-right" data-aos-delay="200">
            Discover unique products from verified Instagram businesses. 
            Shop with confidence through our secure platform.
          </p>
          <div className="hero-buttons" data-aos="fade-right" data-aos-delay="400">
            <Link to="/products" className="btn-primary">Start Shopping</Link>
            
            {/* This button now correctly uses the props from App.js */}
            {(!isAuthenticated || userType !== 'customer') && (
              <Link to="/login" state={{ defaultTab: 'signup', userType: 'seller' }} className="btn-primary">
                Become a Seller
              </Link>
            )}
          </div>
          <div className="hero-stats" data-aos="fade-up" data-aos-delay="600">
            <div className="stat"><h3>10K+</h3><p>Verified Sellers</p></div>
            <div className="stat"><h3>50K+</h3><p>Happy Customers</p></div>
            <div className="stat"><h3>100%</h3><p>Secure Payments</p></div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <h2 className="section-title" data-aos="fade-up">How InstaMarket Works</h2>
        <div className="steps-container">
          <div className="step" data-aos="fade-up" data-aos-delay="100">
            <div className="step-number">1</div>
            <div className="step-icon">🔍</div>
            <h3>Discover Sellers</h3>
            <p>Browse verified Instagram sellers in various categories</p>
          </div>
          <div className="step" data-aos="fade-up" data-aos-delay="200">
            <div className="step-number">2</div>
            <div className="step-icon">✅</div>
            <h3>Check Verification</h3>
            <p>See seller ratings, reviews, and verification badges</p>
          </div>
          <div className="step" data-aos="fade-up" data-aos-delay="300">
            <div className="step-number">3</div>
            <div className="step-icon">🛒</div>
            <h3>Shop Securely</h3>
            <p>Make purchases through our secure payment system</p>
          </div>
          <div className="step" data-aos="fade-up" data-aos-delay="400">
            <div className="step-number">4</div>
            <div className="step-icon">📦</div>
            <h3>Track & Receive</h3>
            <p>Track your order and enjoy buyer protection</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories" id="categories">
        <h2 className="section-title" data-aos="fade-up">Popular Categories</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          Explore thousands of verified Instagram sellers across these categories
        </p>
        <div className="category-grid">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="category-card" 
              data-aos="zoom-in" 
              data-aos-delay={index * 100}
              style={{'--card-color': category.color}}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p className="seller-count">{category.sellers} Active Sellers</p>
              <button className="explore-btn">Explore →</button>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us" id="about">
        <div className="about-container">
          <div className="about-content" data-aos="fade-right">
            <h2 className="section-title">Bridging the Gap Between You and Instagram Sellers</h2>
            <p>
              InstaMarket was born from a simple idea: making it easier and safer to buy from 
              Instagram sellers. We noticed how challenging it was for buyers to trust unknown 
              sellers and for genuine sellers to reach customers beyond their followers.
            </p>
            <p>
              Our platform brings together the creativity and uniqueness of Instagram businesses 
              with the security and convenience of established e-commerce. Every seller is verified, 
              every transaction is protected, and every review is genuine.
            </p>
            <div className="about-features">
              <div className="feature">
                <span className="feature-icon">🤝</span>
                <span>Direct seller relationships</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌟</span>
                <span>Quality guaranteed</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <span>Supporting small businesses</span>
              </div>
            </div>
          </div>
          <div className="about-image" data-aos="fade-left">
            <div className="image-card">
              <div className="image-placeholder">
                <span className="placeholder-icon">🤳</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section" id="trust">
        <h2 className="section-title" data-aos="fade-up">Why People Trust InstaMarket</h2>
        <div className="trust-features">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="trust-card" 
              data-aos="flip-left" 
              data-aos-delay={index * 100}
            >
              <div className="trust-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title" data-aos="fade-up">What Our Community Says</h2>
        <div className="testimonials-container" data-aos="fade-up" data-aos-delay="200">
          <div className="testimonial-track" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${activeTestimonial === index ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-aos="zoom-in">
        <div className="cta-content">
          <h2>Ready to Experience Secure Instagram Shopping?</h2>
          <p>Join thousands of buyers and sellers already using InstaMarket</p>
          <div className="cta-buttons">
            <button className="btn-primary">Start Shopping</button>
            <button className="btn-outline">Learn More</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🛍️</span>
              <h3>InstaMarket</h3>
            </div>
            <p>Your trusted platform for Instagram shopping</p>
            <div className="social-links">
              <a href="#">📘</a>
              <a href="#">📷</a>
              <a href="#">🐦</a>
              <a href="#">💼</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>For Buyers</h4>
            <ul>
              <li><a href="#">How to Shop</a></li>
              <li><a href="#">Buyer Protection</a></li>
              <li><a href="#">Payment Methods</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Sellers</h4>
            <ul>
              <li><a href="#">Start Selling</a></li>
              <li><a href="#">Seller Guidelines</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Trust & Safety</a></li>
              <li><a href="#">Report Issue</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 InstaMarket. Connecting buyers with trusted Instagram sellers.</p>
        </div>
      </footer>
      
      
    </div>
  );
};

export default HomePage;
