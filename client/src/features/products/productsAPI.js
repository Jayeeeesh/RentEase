import api from "../../services/api";

export const getAllProductsAPI = async (allProducts) => {
  const response = await api.get("/products", { params: allProducts });
  return response.data;
};

export const getProductByIdAPI = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
