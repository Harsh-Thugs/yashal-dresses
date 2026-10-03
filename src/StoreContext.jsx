import React, { createContext, useContext, useState, useMemo } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children, products, orders, categories, brands, cart, updateCartQty, removeCartItem, user, openLogin, query, setQuery, activeCategory, setActiveCategory, wishlist, toggleWishlist, setIsCartOpen }) {
  const brandMap = useMemo(() => {
    const map = {};
    if (brands && brands.length) {
      brands.forEach(b => {
        map[b.name] = b;
      });
    }
    return map;
  }, [brands]);

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      categories,
      brands,
      brandMap,
      cart,
      updateCartQty,
      removeCartItem,
      user,
      openLogin,
      query,
      setQuery,
      activeCategory,
      setActiveCategory,
      wishlist,
      toggleWishlist,
      setIsCartOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
