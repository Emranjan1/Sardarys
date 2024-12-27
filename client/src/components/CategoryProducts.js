import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../services/api';
import { useBasket } from '../context/BasketContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './CategoryProducts.css'; // Importing the CSS file for styling

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useBasket();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const categoryProducts = await getProductsByCategory(id);
        setProducts(categoryProducts.filter(product => product.isVisible));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setIsLoading(false);
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
    if (event.target.classList.contains('cp-modal')) {
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
    if (str.length > num) {
      return str.slice(0, num - 3) + "...";
    } else {
      return str;
    }
  };

  if (isLoading) {
    return <div className="cp-loading-container">Loading...</div>;
  }

  return (
    <div className="cp-container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3 cp-back-button">&larr; Back</button>
      <h1>Products</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
            <div className="card cp-product-card" onClick={() => handleProductClick(product)}>
              <img src={`/${product.image}`} className="card-img-top cp-product-image" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title cp-product-name">{truncateString(product.name, 25)}</h5>
                <p className="card-text cp-product-price">£{product.price}</p>
                <button onClick={(e) => {
                    e.stopPropagation();
                    addToBasket({
                      ...product,
                      productId: product.id
                    });
                }} className="btn btn-primary cp-add-to-basket-button">Add to Basket</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="cp-modal active">
          <div className="cp-modal-content">
            <span className="cp-close-modal" onClick={closeModal}>&times;</span>
            <img src={`/${selectedProduct.image}`} alt={selectedProduct.name} className="cp-modal-image" />
            <h2 className="cp-modal-name">{selectedProduct.name}</h2>
            <p className="cp-modal-description">{selectedProduct.description}</p>
            {selectedProduct.ageVerificationRequired && (
              <span className="cp-age-verification">Age verification required</span>
            )}
            <span className="cp-modal-price">£{selectedProduct.price}</span>
            <button onClick={() => addToBasket({
                ...selectedProduct,
                productId: selectedProduct.id
            })} className="btn btn-primary cp-add-to-basket-button">Add to Basket</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
