import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderSummary = () => {
    const location = useLocation();
    const orderDetails = location.state ? location.state.orderDetails : null;

    if (!orderDetails) {
        return <div>No order details available. Please check your orders page.</div>;
    }

    const items = orderDetails.orderItems || []; 

    return (
        <div>
            <h1>Order Summary</h1>
            <p>Thank you for your purchase!</p>
            <div>
                <p>Order Number: {orderDetails.orderNumber}</p>
                <p>Total Amount: £{orderDetails.totalAmount.toFixed(2)}</p>
                <p>Payment Method: {orderDetails.paymentMethod}</p>
                <p>Status: {orderDetails.status}</p>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item.name || 'Product'} - Quantity: {item.quantity}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderSummary;
