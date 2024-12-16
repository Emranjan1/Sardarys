import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext'; // Make sure the import path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './Basket.css';

const Basket = () => {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const { basket, removeFromBasket, updateQuantity } = useBasket();
    const [deliveryCharge, setDeliveryCharge] = React.useState(0);

    // Assuming delivery charge is a fixed value for now, could be dynamic as well
    React.useEffect(() => {
        setDeliveryCharge(0);
    }, []);

    // Calculate total amount using useMemo for performance optimization
    const totalAmount = React.useMemo(() => {
        return basket.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryCharge;
    }, [basket, deliveryCharge]);

    // Navigate to payment options if authenticated, otherwise to login
    const handleNavigateToPaymentOptions = () => {
        if (authToken) {
            navigate('/payment', { state: { totalAmount, items: basket } });
        } else {
            navigate('/login', { state: { from: '/payment' } });
        }
    };

    // Handle removing items from the basket
    const handleRemoveItem = (id) => {
        removeFromBasket(id);
    };

    // Handle quantity changes, ensuring quantity never drops below 1
    const handleQuantityChange = (id, delta) => {
        const item = basket.find(item => item.id === id);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity > 0) {
                updateQuantity(id, delta);
            }
        }
    };

    return (
        <div className="basket-container">
            <h2>Your Basket</h2>
            {basket.length === 0 ? (
                <div>
                    <p>Your basket is empty.</p>
                    <Link to="/" className="back-to-shopping">Continue Shopping</Link>
                </div>
            ) : (
                <div>
                    <ul>
                        {basket.map((item) => (
                            <li key={item.id} className="basket-item">
                                <span className="item-quantity">{item.quantity}x</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">£{item.price.toFixed(2)}</span>
                                <button onClick={() => handleQuantityChange(item.id, -1)} className="quantity-modify">-</button>
                                <button onClick={() => handleQuantityChange(item.id, 1)} className="quantity-modify">+</button>
                                <button onClick={() => handleRemoveItem(item.id)} className="delete-button">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="basket-total">
                        <h3>Delivery Charge: £{deliveryCharge.toFixed(2)}</h3>
                        <h3>Total: £{totalAmount.toFixed(2)}</h3>
                    </div>
                    <button onClick={handleNavigateToPaymentOptions} className="checkout-button">Continue to Payment</button>
                </div>
            )}
        </div>
    );
};

export default Basket;
