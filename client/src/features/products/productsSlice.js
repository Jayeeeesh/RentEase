import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null,

  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    },

    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    },

    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearProducts: (state) => {
      state.products = [];
      state.pagination = initialState.pagination;
    },

    resetProductsState: () => initialState,
  },
});

export const {
  fetchStart,
  fetchProductsSuccess,
  fetchProductSuccess,
  fetchFailure,
  clearSelectedProduct,
  clearProducts,
  resetProductsState,
} = productsSlice.actions;

export default productsSlice.reducer;