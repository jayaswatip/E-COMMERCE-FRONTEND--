import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiPackage } from 'react-icons/fi';
import AdvancedFilters from '../../components/AdvancedFilters';
import QuickFilters from '../../components/QuickFilters';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [quickFilter, setQuickFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest',
    minAmount: '',
    maxAmount: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'electronics',
    stock: '',
    image: '',
    featured: false
  });

  // API Base URL - uses environment variable
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching products from:', `${API_BASE_URL}/api/products`);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Products data:', data);
      
      if (response.ok) {
        const productList = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : [];
        setProducts(productList);
      } else {
        console.warn('API returned error:', data.message);
        setProducts([]); // Set empty array on error
        toast.warning(data.message || 'No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array on error
      toast.error('Unable to connect to server. Using offline mode.');
    } finally {
      setLoading(false);
      console.log('Loading finished');
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchProducts();
    
    // Safety timeout - force stop loading after 10 seconds
    const timeout = setTimeout(() => {
      console.warn('Loading timeout - forcing completion');
      setLoading(false);
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [fetchProducts, API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'electronics',
      stock: '',
      image: '',
      featured: false
    });
    setEditingProduct(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (formData.stock === '' || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      toast.error('Please enter a valid stock quantity');
      return false;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `${API_BASE_URL}/api/products/${editingProduct._id}`
        : `${API_BASE_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      // Prepare form data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        // Ensure category is trimmed and lowercase for consistency
        category: formData.category.trim().toLowerCase()
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      toast.success(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || 'electronics',
      stock: product.stock || 0,
      image: product.image || '',
      featured: product.featured || false
    });
    setShowModal(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Product deleted successfully!');
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleQuickFilter = (filterId) => {
    setQuickFilter(filterId);
    setCurrentPage(1);

    switch (filterId) {
      case 'active':
        setFilters(prev => ({ ...prev, status: 'active' }));
        break;
      case 'pending':
        setFilters(prev => ({ ...prev, status: 'pending' }));
        break;
      case 'all':
      default:
        setFilters(prev => ({ ...prev, status: 'all' }));
        break;
    }
  };

  // Filter and sort products with improved search
  const filteredProducts = products.filter(product => {
    const searchQuery = filters.search ? filters.search.trim().toLowerCase() : '';
    
    // Create a searchable string of all product properties
    const productSearchString = [
      product.name,
      product.description || '',
      product.category,
      product.price.toString(),
      product.stock.toString()
    ].join(' ').toLowerCase();
    
    const matchesSearch = !searchQuery || 
      productSearchString.includes(searchQuery);
    
    const matchesCategory = 
      filters.category === 'all' || 
      product.category.toLowerCase() === filters.category.toLowerCase();

    const matchesPrice =
      (!filters.minAmount || (product.price >= parseFloat(filters.minAmount) || isNaN(parseFloat(filters.minAmount)))) &&
      (!filters.maxAmount || (product.price <= parseFloat(filters.maxAmount) || isNaN(parseFloat(filters.maxAmount))));

    // Additional status filter
    const matchesStatus = 
      filters.status === 'all' ||
      (filters.status === 'in-stock' && product.stock > 0) ||
      (filters.status === 'out-of-stock' && product.stock <= 0) ||
      (filters.status === 'low-stock' && product.stock > 0 && product.stock <= 5);

    return matchesSearch && matchesCategory && matchesPrice && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'amount-high':
        return b.price - a.price;
      case 'amount-low':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="product-management-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management-container">
      <div className="product-management-wrapper">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">🛍️ Product Management</h1>
            <p className="page-subtitle">Manage your product inventory</p>
          </div>
          <button 
            className="btn-add-product"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FiPlus /> Add New Product
          </button>
        </div>

        {/* Quick Filters */}
        <QuickFilters 
          onQuickFilter={handleQuickFilter}
          activeFilter={quickFilter}
        />

        {/* Advanced Filters */}
        <AdvancedFilters 
          onFilterChange={handleFilterChange}
          placeholder="Search products by name or description..."
          showCategory={true}
        />

        {/* Results Summary */}
        <div className="results-summary">
          <h2 className="results-count">
            📦 {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'} Found
          </h2>
          <div className="results-info">
            Showing {Math.min(indexOfFirstProduct + 1, sortedProducts.length)}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">
                    <FiPackage size={48} />
                  </div>
                )}
                {product.featured && (
                  <span className="featured-badge">⭐ Featured</span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="low-stock-badge">⚠️ Low Stock</span>
                )}
                {product.stock === 0 && (
                  <span className="out-stock-badge">❌ Out of Stock</span>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description || 'No description available'}
                </p>
                
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span className="product-stock">Stock: {product.stock}</span>
                </div>

                <div className="product-footer">
                  <span className="product-price">₹{product.price}</span>
                  
                  <div className="product-actions">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(product)}
                      title="Edit product"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(product);
                      }}
                      title="Delete product"
                      disabled={loading}
                    >
                      {loading && productToDelete?._id === product._id ? '...' : <FiTrash2 />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentProducts.length === 0 && (
          <div className="empty-state">
            <FiPackage size={64} />
            <h3>No products found</h3>
            <p>Try adjusting your filters or add a new product</p>
            <button 
              className="btn-add-product"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <FiPlus /> Add Your First Product
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => {
            setShowModal(false);
            resetForm();
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                </h2>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Enter product description"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="home">Home & Garden</option>
                      <option value="sports">Sports & Outdoors</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="toys">Toys & Games</option>
                      <option value="food">Food & Grocery</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Product Image</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-input"
                      />
                      <label htmlFor="image-upload" className="image-upload-label">
                        <FiUpload />
                        <span>Choose Image</span>
                      </label>
                      {formData.image && (
                        <div className="image-preview">
                          <img src={formData.image} alt="Preview" />
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Or enter image URL"
                      style={{ marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      <span>Mark as Featured Product</span>
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {editingProduct ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {showDeleteModal && productToDelete && (
          <div className="modal-overlay" onClick={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}>
            <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">🗑️ Delete Product</h2>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                >
                  <FiX />
                </button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{productToDelete.name}</strong>?</p>
                <p className="modal-warning">This will deactivate the product and remove it from the storefront.</p>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;