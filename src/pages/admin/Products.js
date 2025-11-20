import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductForm from '../../components/admin/ProductForm';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { token } = useAuth();
  const { action, id } = useParams();

  // Check if we're in add/edit mode
  useEffect(() => {
    if (action === 'new') {
      setShowForm(true);
    } else if (action === 'edit' && id) {
      setShowForm(true);
      // The ProductForm will handle loading the product data
    } else {
      setShowForm(false);
    }
  }, [action, id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        // Remove the product from the list
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // If we're showing the form, render it instead of the product list
  if (showForm) {
    return <ProductForm isEdit={action === 'edit'} />;
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h2>Manage Products</h2>
        <Link to="new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.countInStock}</td>
                <td>
                  <Link 
                    to={`edit/${product._id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
