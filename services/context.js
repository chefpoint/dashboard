import { useState, createContext } from 'react';
import orderManager from '../utils/orderManager';

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  //
  // Folders
  const [selectedFolderId, setSelectedFolderId] = useState();

  // App Data
  const [availableDiscounts, setAvailableDiscounts] = useState();

  // Order
  const [currentOrderItems, updateCurrentOrderItems] = useState([]);
  const [currentOrderDiscounts, updateCurrentOrderDiscounts] = useState([]);
  const [currentOrderTotals, updateCurrentOrderTotals] = useState();
  const [currentOrderCustomer, updateCurrentOrderCustomer] = useState();

  // Overlay
  const [overlayComponent, setOverlayComponent] = useState();

  // User Management
  const [currentUser, setCurrentUser] = useState();

  // CONTEXT
  const contextValue = {
    currentFolder: {
      _id: selectedFolderId,
      setId: setSelectedFolderId,
    },

    currentOrder: {
      items: currentOrderItems,
      discounts: currentOrderDiscounts,
      availableDiscounts: availableDiscounts,
      customer: currentOrderCustomer,
      setCustomer: updateCurrentOrderCustomer,
      setAvailableDiscounts,
      totals: currentOrderTotals,
      add: function (product, variation, qty) {
        const updatedOrderItems = orderManager.addProductVariationToCurrentOrder(currentOrderItems, product, variation, qty);
        updateCurrentOrderItems(updatedOrderItems);
        const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(updatedOrderItems, availableDiscounts);
        updateCurrentOrderDiscounts(validDiscounts);
        const updatedOrderTotals = orderManager.calculateOrderTotals(updatedOrderItems, validDiscounts);
        updateCurrentOrderTotals(updatedOrderTotals);
      },
      change: function (orderItem, variation, qty) {
        const updatedOrderItems = orderManager.updateProductVariationOfCurrentOrder(currentOrderItems, orderItem, variation, qty);
        updateCurrentOrderItems(updatedOrderItems);
        const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(updatedOrderItems, availableDiscounts);
        updateCurrentOrderDiscounts(validDiscounts);
        const updatedOrderTotals = orderManager.calculateOrderTotals(updatedOrderItems, validDiscounts);
        updateCurrentOrderTotals(updatedOrderTotals);
      },
      remove: function (orderItem) {
        const updatedOrderItems = orderManager.removeItemFromCurrentOrder(currentOrderItems, orderItem);
        updateCurrentOrderItems(updatedOrderItems);
        const validDiscounts = orderManager.getValidDiscountsForCurrentOrder(updatedOrderItems, availableDiscounts);
        updateCurrentOrderDiscounts(validDiscounts);
        const updatedOrderTotals = orderManager.calculateOrderTotals(updatedOrderItems, validDiscounts);
        updateCurrentOrderTotals(updatedOrderTotals);
      },
      clear: function () {
        updateCurrentOrderItems([]);
        updateCurrentOrderDiscounts([]);
        updateCurrentOrderTotals();
        updateCurrentOrderCustomer();
      },
    },

    overlay: {
      component: overlayComponent,
      setComponent: setOverlayComponent,
    },

    lockStatus: {
      currentUser: currentUser,
      setCurrentUser: setCurrentUser,
    },
  };

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}
