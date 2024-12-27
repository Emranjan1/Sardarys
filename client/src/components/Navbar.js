import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { useBasket } from '../context/BasketContext';

const Navbar = ({ onSearch, isLoggedIn, isAdmin }) => {
    const navigate = useNavigate();
    const { basket } = useBasket();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (basket.length > 0) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [basket]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.elements.search.value.trim();
        if(query) {
            onSearch(query); // Ensure onSearch is defined in the parent component
            navigate(`/search?q=${query}`);
        }
    };

    const handleAccountClick = () => {
        navigate(isLoggedIn ? (isAdmin ? '/adminpanel' : '/profile') : '/login');
    };

    const handleBasketClick = () => {
        navigate('/basket');
    };

    return (
        <nav className="navbar cp-navbar">
            <Link to="/" className="home-button">
                <FontAwesomeIcon icon={faHome} />
            </Link>
            <form className="search-form cp-navbar-search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    name="search"
                    className="search-input cp-navbar-search-input"
                    placeholder="Search for products..."
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="navbar-right">
                <button onClick={handleAccountClick} className="account-button cp-navbar-account-btn">
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <button onClick={handleBasketClick} className={`basket-icon cp-navbar-basket-icon ${animate ? 'basket-animate' : ''}`}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {basket.length > 0 && <span className="badge cp-badge">{basket.length}</span>}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
