import api from "../../services/api";

export const createOrderAPI = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getUserOrdersAPI = async (params) => {
  const response = await api.get("/orders", { params });
  return response.data;
};