import axios from 'axios';

// Define the base URL of your backend server
const API_URL = 'http://localhost:5000';

// --- Create separate Axios instances for different API modules ---

// 1. Authentication API instance
const authAPI = axios.create({
  baseURL: `${API_URL}/api/auth`,
});

// 2. Products API instance
const productAPI = axios.create({
  baseURL: `${API_URL}/api/products`,
});

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg'; // Add a placeholder image in your public folder
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}/${imagePath}`;
};

// --- Interceptor to add JWT token and Seller ID to protected routes ---
productAPI.interceptors.request.use((req) => {
  // Add the JWT token for authorization
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  // Add the Seller ID for seller-specific routes
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.role === 'seller') {
    req.headers['x-seller-id'] = userInfo.id;
  }
  
  return req;
});

// =================================================================
// AUTHENTICATION API CALLS
// =================================================================

export const signupCustomer = (data) => authAPI.post('/customer/signup', data);
export const loginCustomer = (data) => authAPI.post('/customer/login', data);
export const signupSeller = (data) => authAPI.post('/seller/signup', data);
export const loginSeller = (data) => authAPI.post('/seller/login', data);

// =================================================================
// PRODUCT MANAGEMENT API CALLS
// =================================================================

/**
 * Fetches ALL products for the public-facing product pages.
 * Corresponds to: GET /api/products
 */
export const fetchAllProducts = async () => {
  try {
    const response = await productAPI.get('/');
    // The backend already transforms the image URLs, but we ensure consistency
    const productsWithFullUrls = response.data.map(product => ({
      ...product,
      image: product.image.startsWith('http') ? product.image : getFullImageUrl(product.image)
    }));
    return { data: productsWithFullUrls };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetches only the products belonging to the currently logged-in seller.
 * This is a protected route. The interceptor automatically adds the required headers.
 * Corresponds to: GET /api/products/my-products
 */
export const fetchMyProducts = async () => {
  try {
    const response = await productAPI.get('/my-products');
    // Transform image URLs if needed
    const productsWithFullUrls = response.data.map(product => ({
      ...product,
      image: product.image.startsWith('http') ? product.image : getFullImageUrl(product.image)
    }));
    return { data: productsWithFullUrls };
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

/**
 * Adds a new product. (For the Seller Dashboard)
 * Corresponds to: POST /api/products
 * @param {FormData} productData - The product data, including the image file.
 */
export const addProduct = (productData) => productAPI.post('/', productData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

/**
 * Deletes a product by its ID. (For the Seller Dashboard)
 * Corresponds to: DELETE /api/products/:id
 * @param {string} productId - The ID of the product to delete.
 */
export const deleteProduct = (productId) => productAPI.delete(`/${productId}`);

/**
 * Updates an existing product. (For Seller Dashboard "Edit" functionality)
 * Corresponds to: PUT /api/products/:id
 * @param {string} productId - The ID of the product to update.
 * @param {FormData} updatedData - The new product data.
 */
export const updateProduct = (productId, updatedData) => productAPI.put(`/${productId}`, updatedData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

// Export the helper function
export { getFullImageUrl };
