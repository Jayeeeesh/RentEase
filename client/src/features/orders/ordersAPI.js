import api from "../../services/api";

export const createOrderAPI = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getUserOrdersAPI = async (params) => {
  const response = await api.get("/orders", { params });
  return response.data;
};

export const cancelOrderAPI = async (id) => {
  const response = await api.patch(`/orders/${id}/cancel`);
  return response.data;
};