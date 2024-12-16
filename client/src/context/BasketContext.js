import React, { createContext, useContext, useState } from 'react';

const BasketContext = createContext({
  basket: [],
  addToBasket: () => {},
  removeFromBasket: () => {},
  updateQuantity: () => {}
});

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  const addToBasket = product => {
    setBasket(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex !== -1) {
        // Increment quantity if product already exists
        const newBasket = [...prev];
        newBasket[existingIndex] = {
          ...newBasket[existingIndex],
          quantity: newBasket[existingIndex].quantity + 1
        };
        return newBasket;
      }
      // Add new product with quantity initialized to 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromBasket = id => {
    setBasket(prev => prev.filter(item => item.id !== id));
  };

  // Adjusts the quantity; delta can be either +1 or -1
  const updateQuantity = (id, delta) => {
    setBasket(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const updatedQuantity = Math.max(1, item.quantity + delta); // Ensure quantity does not go below 1
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
    });
  };

  return (
    <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, updateQuantity }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);
