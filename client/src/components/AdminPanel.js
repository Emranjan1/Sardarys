import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout, userDetails } = useAuth(); 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout(); 
    navigate('/login', { replace: true }); 
  };
  useEffect(() => {
    if (!userDetails.isAdmin) {
      navigate('/');
    }
  }, [userDetails.isAdmin, navigate]);
  
  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-options">
        <Link to="/add-product" className="admin-button">Add Product</Link>
        <Link to="/add-category" className="admin-button">Add Category</Link>
        <Link to="/admin/orders" className="admin-button">View All Orders</Link> {}
        <Link to="/charges-promotions" className="admin-button">Charges and Promotions</Link>
        <Link to="/promo-codes" className="admin-button">Manage Promo Codes</Link>
        {categories.length > 0 && (
          <Link to={`/admin/category/${categories[0].id}/layout`} className="admin-button">
            Manage {categories[0].name} Layout
          </Link>
        )}
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default AdminPanel;
