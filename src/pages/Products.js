import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from "react-toastify";
import { FiX, FiUpload } from 'react-icons/fi';
import './Products.css';

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // Fallback products (original hardcoded products)
  const fallbackProducts = [
    {
      id: 1,
      name: 'Smart Watch Pro',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format',
      description: 'Advanced smartwatch with health tracking and notifications',
      category: 'electronics',
      stock: 10,
      rating: 4.5,
      reviewCount: 12
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format',
      description: 'High-quality wireless earbuds with noise cancellation',
      category: 'electronics',
      stock: 15,
      rating: 4.3,
      reviewCount: 8
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format',
      description: 'Water-resistant laptop backpack with multiple compartments',
      category: 'accessories',
      stock: 20,
      rating: 4.7,
      reviewCount: 25
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format',
      description: 'Portable bluetooth speaker with 20-hour battery life',
      category: 'electronics',
      stock: 12,
      rating: 4.6,
      reviewCount: 18
    },
    {
      id: 5,
      name: 'Phone Case',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&auto=format',
      description: 'Durable protective phone case with card holder',
      category: 'accessories',
      stock: 50,
      rating: 4.4,
      reviewCount: 30
    },
    {
      id: 6,
      name: 'Power Bank',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format',
      description: '20000mAh portable charger with fast charging',
      category: 'electronics',
      stock: 25,
      rating: 4.5,
      reviewCount: 22
    },
    {
      id: 7,
      name: 'Fitness Tracker Band',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=500&auto=format',
      description: 'Fitness band with sleep, heart-rate and step tracking',
      category: 'electronics',
      stock: 18,
      rating: 4.2,
      reviewCount: 15
    },
    {
      id: 8,
      name: 'Noise Cancelling Headphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224e542?w=500&auto=format',
      description: 'Comfortable headphones with active noise cancellation',
      category: 'electronics',
      stock: 8,
      rating: 4.8,
      reviewCount: 35
    },
    {
      id: 9,
      name: 'Smartphone Stand',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?w=500&auto=format',
      description: 'Adjustable stand for phones and tablets',
      category: 'accessories',
      stock: 40,
      rating: 4.1,
      reviewCount: 10
    },
    {
      id: 10,
      name: 'USB-C Hub',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1601981705412-c8bfa7431b33?w=500&auto=format',
      description: 'Multiport adapter for laptops with HDMI, USB, SD card',
      category: 'accessories',
      stock: 30,
      rating: 4.6,
      reviewCount: 20
    },
    {
      id: 11,
      name: 'Wireless Charging Pad',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1611078489935-e9920a0e4088?w=500&auto=format',
      description: 'Qi-certified fast wireless charger pad for smartphones',
      category: 'electronics',
      stock: 22,
      rating: 4.3,
      reviewCount: 14
    },
    {
      id: 12,
      name: 'Gaming Mouse',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=500&auto=format',
      description: 'RGB gaming mouse with high precision and programmable buttons',
      category: 'electronics',
      stock: 15,
      rating: 4.7,
      reviewCount: 28
    }
  ];

  const [products, setProducts] = useState(fallbackProducts); // Start with fallback products
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['all']);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001';

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'electronics',
    stock: '',
    image: '',
    featured: false
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${API_BASE}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Handle both array response and object with products property
        let productsList = Array.isArray(data) ? data : (data.products || []);
        
        // Filter only active products
        productsList = productsList.filter(product => product.isActive !== false);
        
        // Transform products to match ProductCard expectations
        const transformedProducts = productsList.map(product => ({
          id: product.id || product._id,
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || (product.images && product.images.length > 0 ? product.images[0].url : ''),
          description: product.description || '',
          category: product.category || 'electronics',
          stock: product.stock || 0,
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0
        }));

        // Use API products if available, otherwise keep fallback
        if (transformedProducts.length > 0) {
          setProducts(transformedProducts);
          // Extract unique categories from API products
          const uniqueCategories = ['all', ...new Set(transformedProducts.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          // If API returns empty, use fallback products
          setProducts(fallbackProducts);
          const uniqueCategories = ['all', ...new Set(fallbackProducts.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // On error, use fallback products so page still works
        setProducts(fallbackProducts);
        const uniqueCategories = ['all', ...new Set(fallbackProducts.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
        console.log('Using fallback products due to API error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE]);

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'all' || 
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);  // ✅ Toast notification
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'electronics',
      stock: product.stock || 0,
      image: product.image || '',
      featured: product.featured || false
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock),
        category: editFormData.category.trim().toLowerCase()
      };

      const productId = editingProduct._id || editingProduct.id;
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      toast.success('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      
      // Refresh products list
      const refreshResponse = await fetch(`${API_BASE}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        let productsList = Array.isArray(refreshData) ? refreshData : (refreshData.products || []);
        productsList = productsList.filter(product => product.isActive !== false);
        
        const transformedProducts = productsList.map(product => ({
          id: product.id || product._id,
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || (product.images && product.images.length > 0 ? product.images[0].url : ''),
          description: product.description || '',
          category: product.category || 'electronics',
          stock: product.stock || 0,
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0
        }));

        if (transformedProducts.length > 0) {
          setProducts(transformedProducts);
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditFormData({
      name: '',
      description: '',
      price: '',
      category: 'electronics',
      stock: '',
      image: '',
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-header">
          <h1>Discover Our Products</h1>
          <p className="products-subtitle">Explore our collection of premium tech accessories</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Discover Our Products</h1>
        <p className="products-subtitle">Explore our collection of premium tech accessories</p>
      </div>

      <div className="products-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={'category-btn ' + (selectedCategory === category ? 'active' : '')}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id || product._id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
