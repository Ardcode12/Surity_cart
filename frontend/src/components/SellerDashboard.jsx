import React, { useState, useMemo, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaPlus,
  FaBox,
  FaChartLine,
  FaStore,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaShoppingCart,
  FaClipboardList,
  FaCog,
  FaTimes,
  FaSearch,
  FaFilter,
  FaUser,
  FaMoon,
  FaSun,
  FaSortAmountDown,
  FaSortAmountUp,
  FaMagic,
  FaEnvelope,
  FaBars
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const PREMIUM_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

const initialProducts = [
  {
    id: "p1",
    name: "Premium Headphones",
    brand: "SonicPro",
    category: "electronics",
    price: 299.99,
    originalPrice: 399.99,
    quantity: 42,
    sales: 128,
    views: 1420,
    image: "https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=1200&auto=format&fit=crop",
    description: "Audiophile-grade over-ear headphones with active noise cancellation and spatial audio.",
  },
  {
    id: "p2",
    name: "Wireless Mouse",
    brand: "GlideX",
    category: "electronics",
    price: 39.99,
    originalPrice: 59.99,
    quantity: 230,
    sales: 300,
    views: 2450,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop",
    description: "Ergonomic wireless mouse with 2.4GHz dongle and Bluetooth dual mode.",
  },
  {
    id: "p3",
    name: "Mechanical Keyboard",
    brand: "KeySmith",
    category: "electronics",
    price: 129.99,
    originalPrice: 159.99,
    quantity: 80,
    sales: 210,
    views: 1980,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=1200&auto=format&fit=crop",
    description: "Hot-swappable mechanical keyboard with RGB and PBT keycaps.",
  },
  {
    id: "p4",
    name: "Running Shoes",
    brand: "FleetRun",
    category: "fitness",
    price: 89.99,
    originalPrice: 119.99,
    quantity: 95,
    sales: 97,
    views: 860,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    description: "Breathable mesh upper, responsive foam midsole, road-ready outsole.",
  },
  {
    id: "p5",
    name: "Skincare Set",
    brand: "GlowLab",
    category: "beauty",
    price: 59.99,
    originalPrice: 79.99,
    quantity: 150,
    sales: 188,
    views: 1340,
    image: "https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1200&auto=format&fit=crop",
    description: "Cleanser, toner, serum, moisturizer — all dermatologically tested.",
  },
];

const initialOrders = [
  { id: "o1", orderNumber: "ORD-001", customer: "John Doe", product: "Premium Headphones", quantity: 2, total: 599.98, status: "pending", date: "2025-08-01" },
  { id: "o2", orderNumber: "ORD-002", customer: "Jane Smith", product: "Wireless Mouse", quantity: 1, total: 39.99, status: "processing", date: "2025-08-02" },
  { id: "o3", orderNumber: "ORD-003", customer: "Peter Jones", product: "Mechanical Keyboard", quantity: 1, total: 129.99, status: "shipped", date: "2025-08-03" },
  { id: "o4", orderNumber: "ORD-004", customer: "Aisha Khan", product: "Running Shoes", quantity: 1, total: 89.99, status: "pending", date: "2025-08-04" },
  { id: "o5", orderNumber: "ORD-005", customer: "Ravi Kumar", product: "Skincare Set", quantity: 3, total: 179.97, status: "processing", date: "2025-08-05" },
];

const monthlySales = [
  { month: "Mar", sales: 4200, orders: 92 },
  { month: "Apr", sales: 6100, orders: 120 },
  { month: "May", sales: 5400, orders: 108 },
  { month: "Jun", sales: 6800, orders: 136 },
  { month: "Jul", sales: 7200, orders: 145 },
  { month: "Aug", sales: 9100, orders: 182 },
];

const SellerDashboard = () => {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [draftedEmail, setDraftedEmail] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    description: "",
    price: "",
    originalPrice: "",
    quantity: "",
    category: "",
    image: null,
  });

  // Settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    inventoryAlerts: false,
  });

  useEffect(() => {
    AOS.init({ 
      duration: 700, 
      once: true, 
      easing: "ease-in-out",
      offset: 100 
    });
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Derived analytics
  const totalViews = useMemo(
    () => products.reduce((sum, p) => sum + (p.views || 0), 0),
    [products]
  );
  const totalSales = useMemo(
    () => products.reduce((sum, p) => sum + (p.sales || 0), 0),
    [products]
  );

  const categoryData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + (p.sales || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Filtering + sorting
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    const sorted = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "price") return (a.price - b.price) * dir;
      if (sortKey === "sales") return ((a.sales || 0) - (b.sales || 0)) * dir;
      if (sortKey === "views") return ((a.views || 0) - (b.views || 0)) * dir;
      if (sortKey === "quantity") return (a.quantity - b.quantity) * dir;
      return 0;
    });
    return sorted;
  }, [products, searchTerm, filterCategory, sortKey, sortDir]);

  // Handlers
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `p_${Date.now()}`,
      name: formData.title,
      brand: formData.brand,
      category: formData.category,
      price: parseFloat(formData.price || "0"),
      originalPrice: parseFloat(formData.originalPrice || "0"),
      quantity: parseInt(formData.quantity || "0", 10),
      sales: 0,
      views: 0,
      image: imagePreview || "https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=1200&auto=format&fit=crop",
      description: formData.description,
    };
    
    setProducts(prev => [newProduct, ...prev]);
    resetForm();
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      brand: "",
      description: "",
      price: "",
      originalPrice: "",
      quantity: "",
      category: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleEditProduct = (product) => {
    console.log("Edit product:", product);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleDraftEmail = async (order) => {
    setDraftedEmail(`Dear ${order.customer},

Thank you for your order #${order.orderNumber}!

Your order for ${order.product} (Qty: ${order.quantity}) totaling $${order.total.toFixed(2)} is currently ${order.status}.

We appreciate your business and will keep you updated on your order status.

Best regards,
Boss Mart Team`);
    setShowEmailModal(true);
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-default';
    }
  };

  const inventoryData = products.map(p => ({
    name: p.name.slice(0, 10) + "…",
    qty: p.quantity
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid" data-aos="fade-up">
              <div className="stat-card gradient-1">
                <div className="stat-icon-wrapper">
                  <FaShoppingCart />
                </div>
                <div className="stat-details">
                  <h3>Total Orders</h3>
                  <p className="stat-number">{orders.length}</p>
                  <span className="stat-change positive">+8.2%</span>
                </div>
              </div>
              <div className="stat-card gradient-2">
                <div className="stat-icon-wrapper">
                  <FaEye />
                </div>
                <div className="stat-details">
                  <h3>Total Views</h3>
                  <p className="stat-number">{totalViews}</p>
                  <span className="stat-change positive">+15.3%</span>
                </div>
              </div>
              <div className="stat-card gradient-3">
                <div className="stat-icon-wrapper">
                  <FaBox />
                </div>
                <div className="stat-details">
                  <h3>Products</h3>
                  <p className="stat-number">{products.length}</p>
                  <span className="stat-change positive">+5.7%</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid" data-aos="fade-up" data-aos-delay="150">
              {/* Sales Chart */}
              <div className="chart-card glassmorphism">
                <div className="chart-header">
                  <h3>Sales Overview</h3>
                  <div className="chart-controls">
                    <span className="chart-trend positive">↗ 12.5%</span>
                    <select className="chart-filter">
                      <option>Last 6 months</option>
                      <option>Last year</option>
                    </select>
                  </div>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySales}>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(20px)',
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#06b6d4" 
                        strokeWidth={3}
                        dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Chart */}
              <div className="chart-card glassmorphism">
                <div className="chart-header">
                  <h3>Sales by Category</h3>
                  <div className="chart-meta">This month</div>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(20px)',
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#9ca3af' }}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="recent-section glassmorphism" data-aos="fade-up" data-aos-delay="250">
              <div className="section-header">
                <h3>Recent Orders</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="recent-orders-list">
                {orders.slice(0, 5).map((order, index) => (
                  <div key={order.id} className="order-item">
                    <div className="order-avatar">
                      {order.customer.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="order-info">
                      <p className="order-customer">{order.customer}</p>
                      <p className="order-product">{order.product}</p>
                    </div>
                    <div className="order-amount">
                      <p className="order-total">${order.total.toFixed(2)}</p>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="top-products-section glassmorphism" data-aos="fade-up" data-aos-delay="300">
              <div className="section-header">
                <h3>Top Products</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="top-products-grid">
                {products.slice(0, 3).map((product, index) => (
                  <div key={product.id} className="top-product-card" data-aos="zoom-in" data-aos-delay={index * 100}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <h4>{product.name}</h4>
                    <p className="product-brand">{product.brand}</p>
                    <div className="product-stats-row">
                      <span className="product-price">${product.price}</span>
                      <div className="product-metrics">
                        <span><FaShoppingCart /> {product.sales || 0}</span>
                        <span><FaEye /> {product.views || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "products":
        return (
          <div className="products-section">
            <div className="products-header">
              <h2>My Products</h2>
              <div className="products-controls">
                {/* Search */}
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search by name or brand…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div className="filter-dropdown">
                  <FaFilter />
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="fitness">Fitness</option>
                    <option value="home">Home</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                {/* Sort Controls */}
                <div className="sort-controls">
                  {[
                    { key: "name", label: "Name" },
                    { key: "price", label: "Price" },
                    { key: "sales", label: "Sales" },
                    { key: "views", label: "Views" },
                    { key: "quantity", label: "Stock" },
                  ].map((sort) => (
                    <button
                      key={sort.key}
                      className={`sort-btn ${sortKey === sort.key ? "active" : ""}`}
                      onClick={() => toggleSort(sort.key)}
                    >
                      {sortKey === sort.key && sortDir === "asc" ? (
                        <FaSortAmountDown />
                      ) : (
                        <FaSortAmountUp />
                      )}
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.length ? (
                filteredProducts.map((product, index) => (
                  <div key={product.id} className="product-card" data-aos="zoom-in" data-aos-delay={index * 60}>
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay">
                        <button className="overlay-btn" onClick={() => handleViewProduct(product)}>
                          <FaEye />
                        </button>
                        <button className="overlay-btn" onClick={() => handleEditProduct(product)}>
                          <FaEdit />
                        </button>
                        <button className="overlay-btn delete" onClick={() => handleDeleteProduct(product.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p className="product-brand">{product.brand}</p>
                      <div className="product-meta">
                        <div className="price-section">
                          <span className="price">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="original-price">${product.originalPrice}</span>
                          )}
                        </div>
                        <span className="stock">Stock: {product.quantity}</span>
                      </div>
                      <div className="product-stats">
                        <span><FaShoppingCart /> {product.sales || 0} sales</span>
                        <span><FaEye /> {product.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <FaSearch />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="orders-section">
            <h2>Orders Management</h2>
            <div className="orders-table-container glassmorphism">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} data-aos="fade-up" data-aos-delay={index * 50}>
                      <td className="order-number">{order.orderNumber}</td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {order.customer.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          {order.customer}
                        </div>
                      </td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td className="order-total">${order.total.toFixed(2)}</td>
                      <td>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDraftEmail(order)}
                          className="action-btn"
                        >
                          <FaEnvelope />
                          Draft Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="settings-section" data-aos="fade-in">
            <h2>Settings</h2>
            <div className="settings-grid">
              <div className="card">
                <h3>Appearance</h3>
                <div className="setting-row">
                  <label>Theme</label>
                  <div className="theme-buttons">
                    <button
                      className={`theme-btn ${theme === "light" ? "active" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      Light
                    </button>
                    <button
                      className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3>Notifications</h3>
                <div className="setting-row">
                  <label>Order updates</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderUpdates}
                      onChange={(e) =>
                        setNotificationSettings(prev => ({ ...prev, orderUpdates: e.target.checked }))
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-row">
                  <label>Inventory alerts</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.inventoryAlerts}
                      onChange={(e) =>
                        setNotificationSettings(prev => ({ ...prev, inventoryAlerts: e.target.checked }))
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`} data-aos="fade-right">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <FaStore />
            </div>
            <div className="logo-text">
              <h2>Boss Mart</h2>
              <p>Seller Dashboard</p>
            </div>
          </div>
          <button 
            className="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
          >
            <FaBox />
            <span>Products</span>
          </button>
          <button
            className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
          >
            <FaClipboardList />
            <span>Orders</span>
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
          >
            <FaCog />
            <span>Settings</span>
          </button>
          <button
            className="nav-item logout-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header" data-aos="fade-down">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars />
            </button>
            <div className="header-title">
              <h1>Dashboard Overview</h1>
              <p>Welcome back! Here's what's happening with your store.</p>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <FaSearch />
              <input
                type="text"
                placeholder="Search products..."
              />
            </div>
            
            <button className="primary-btn" onClick={() => setShowAddProduct(true)}>
              <FaPlus />
              Add Product
            </button>
          </div>
        </header>

        {renderTabContent()}
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="modal-overlay">
          <div className="modal-content" data-aos="zoom-in">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="close-btn" onClick={() => setShowAddProduct(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Enter brand name"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports & Outdoors</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="fitness">Fitness</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Product Image</label>
                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <div className="upload-placeholder">
                        <FaPlus />
                        <p>Drag and drop an image here, or click to select</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                        <button type="button" className="upload-btn">Choose File</button>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddProduct(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content" data-aos="zoom-in">
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="close-btn" onClick={() => setShowProductDetails(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="product-details-content">
              <div className="product-image-large">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="product-info-section">
                <div className="product-title-section">
                  <h3>{selectedProduct.name}</h3>
                  <p className="product-brand">{selectedProduct.brand}</p>
                </div>
                <div className="product-price-section">
                  <span className="product-price-large">${selectedProduct.price}</span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="original-price-large">${selectedProduct.originalPrice}</span>
                  )}
                  <span className="product-category">{selectedProduct.category}</span>
                </div>
                <p className="product-description">{selectedProduct.description}</p>
                <div className="product-metrics-grid">
                  <div className="metric-card">
                    <p className="metric-number">{selectedProduct.quantity}</p>
                    <p className="metric-label">In Stock</p>
                  </div>
                  <div className="metric-card">
                    <p className="metric-number">{selectedProduct.sales || 0}</p>
                    <p className="metric-label">Sales</p>
                  </div>
                  <div className="metric-card">
                    <p className="metric-number">{selectedProduct.views || 0}</p>
                    <p className="metric-label">Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal-content" data-aos="zoom-in">
            <div className="modal-header">
              <h3>Draft Email</h3>
              <button className="close-btn" onClick={() => setShowEmailModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="email-content">
              <textarea
                value={draftedEmail}
                onChange={(e) => setDraftedEmail(e.target.value)}
                className="email-textarea"
                placeholder="Email content will appear here..."
              />
              <div className="email-actions">
                <button className="cancel-btn" onClick={() => setShowEmailModal(false)}>
                  Cancel
                </button>
                <button className="send-btn">
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// hi<<
export default SellerDashboard;