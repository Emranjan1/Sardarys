import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../services/api';
import { useBasket } from '../context/BasketContext'; // Import useBasket from context
import './CategoryProducts.css';

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useBasket(); // Get addToBasket directly from context
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryProducts = await getProductsByCategory(id);
        setProducts(categoryProducts.filter(product => product.isVisible));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [id]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleClickOutside = useCallback((event) => {
    if (event.target.className === 'modal active') {
      closeModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const truncateString = (str, num) => {
    return str.length > num ? str.slice(0, num) + "..." : str;
  };

  return (
    <div className="category-products-container">
      <button onClick={() => navigate(-1)} className="back-button">&larr; Back</button>
      <h1>Products</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item" onClick={() => handleProductClick(product)}>
            <img src={`/${product.image}`} alt={product.name} className="product-image" />
            <div className="product-info">
              <strong className="product-name">{truncateString(product.name, 25)}</strong>
              <span className="product-price">£{product.price}</span>
              <button onClick={(e) => {
                  e.stopPropagation();
                  addToBasket({
                    ...product,
                    productId: product.id
                  });
              }} className="add-to-basket-button">+</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedProduct && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <img src={`/${selectedProduct.image}`} alt={selectedProduct.name} className="modal-image" />
            <h2 className="modal-name">{selectedProduct.name}</h2>
            <p className="modal-description">{selectedProduct.description}</p>
            {selectedProduct.ageVerificationRequired && (
              <span className="age-verification">Age verification required</span>
            )}
            <span className="modal-price">£{selectedProduct.price}</span>
            <button onClick={() => addToBasket({
                ...selectedProduct,
                productId: selectedProduct.id
            })}>Add to Basket</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
