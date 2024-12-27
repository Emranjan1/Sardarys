import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '../services/api';
import { useBasket } from '../context/BasketContext';
import './SearchResults.css'; // Ensure the same CSS styling rules apply as CategoryProducts

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const { addToBasket } = useBasket();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const { products, similarProducts } = await searchProducts(query);
          setResults(products);
          setSuggestions(similarProducts);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchResults();
  }, [query]);

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num - 3) + "...";
    } else {
      return str;
    }
  };

  return (
    <div className="cp-container">
      <h1>Search Results for "{query}"</h1>
      <div className="row">
        {results.length > 0 ? results.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
            <div className="card cp-product-card">
              <img src={`/${product.image}`} className="card-img-top cp-product-image" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title cp-product-name">{truncateString(product.name, 25)}</h5>
                <p className="card-text cp-product-price">${product.price}</p>
                <button onClick={() => addToBasket(product)} className="btn btn-primary cp-add-to-basket-button">Add to Basket</button>
              </div>
            </div>
          </div>
        )) : <p>No products found</p>}
      </div>

      {suggestions.length > 0 && (
        <>
          <h2>Did you mean?</h2>
          <div className="row">
            {suggestions.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
                <div className="card cp-product-card">
                  <img src={`/${product.image}`} className="card-img-top cp-product-image" alt={product.name} />
                  <div className="card-body">
                    <h5 className="card-title cp-product-name">{truncateString(product.name, 25)}</h5>
                    <p className="card-text cp-product-price">${product.price}</p>
                    <button onClick={() => addToBasket(product)} className="btn btn-primary cp-add-to-basket-button">Add to Basket</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
