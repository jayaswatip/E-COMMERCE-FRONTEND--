import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    countInStock: 0,
    brand: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          
          const data = await response.json();
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            category: data.category,
            countInStock: data.countInStock,
            brand: data.brand
          });
          if (data.image) {
            setImagePreview(data.image);
          }
        } catch (err) {
          setError(err.message);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEdit 
        ? `http://localhost:5000/api/products/${id}`
        : 'http://localhost:5000/api/products';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Redirect to products list after successful submission
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="4"
            required
          />
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="countInStock">Stock</label>
              <input
                type="number"
                id="countInStock"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                className="form-control"
                min="0"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
            required={!isEdit}
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
                className="img-thumbnail"
              />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary me-2"
            onClick={() => navigate('/admin/products')}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
