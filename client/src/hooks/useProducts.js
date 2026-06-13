import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchStart,
  fetchProductsSuccess,
  fetchProductSuccess,
  fetchFailure,
  clearSelectedProduct,
  clearProducts,
  resetProductsState,
} from "../features/products/productsSlice";

import {
  getAllProductsAPI,
  getProductByIdAPI,
} from "../features/products/productsAPI";

const useProducts = () => {
  const dispatch = useDispatch();

  const productsState = useSelector((state) => state.products);

  const {
    products,
    selectedProduct,
    pagination,
    loading,
    error,
  } = productsState;

  /**
   * Generic API Handler
   */
  const handleRequest = useCallback(
    async ({
      apiCall,
      payload = null,
      successAction,
      fallbackMessage,
    }) => {
      dispatch(fetchStart());

      try {
        const result = await apiCall(payload);

        dispatch(successAction(result.data));

        return result.data;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          fallbackMessage;

        dispatch(fetchFailure(message));

        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch Products List
   */
  const fetchProducts = useCallback(
    async (params = {}) =>
      handleRequest({
        apiCall: getAllProductsAPI,
        payload: params,
        successAction: fetchProductsSuccess,
        fallbackMessage: "Failed to fetch products",
      }),
    [handleRequest]
  );

  /**
   * Fetch Single Product
   */
  const fetchProductById = useCallback(
    async (id) =>
      handleRequest({
        apiCall: getProductByIdAPI,
        payload: id,
        successAction: fetchProductSuccess,
        fallbackMessage: "Failed to fetch product",
      }),
    [handleRequest]
  );

  /**
   * Redux Actions
   */
  const clearCurrentProduct = useCallback(() => {
    dispatch(clearSelectedProduct());
  }, [dispatch]);

  const clearAllProducts = useCallback(() => {
    dispatch(clearProducts());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetProductsState());
  }, [dispatch]);

  return {
    // State
    products,
    selectedProduct,
    pagination,
    loading,
    error,

    // API Actions
    fetchProducts,
    fetchProductById,

    // Utility Actions
    clearCurrentProduct,
    clearAllProducts,
    resetState,
  };
};

export default useProducts;