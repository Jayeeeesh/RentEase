import api from "../../services/api";

export const createRentalAPI = async (rentalData) => {
  const response = await api.post("/rentals", rentalData);
  return response.data;
};

export const getUserRentalsAPI = async (params) => {
  const response = await api.get("/rentals", { params });
  return response.data;
};

export const getRentalByIdAPI = async (id) => {
  const response = await api.get(`/rentals/${id}`);
  return response.data;
};

export const cancelRentalAPI = async (id) => {
  const response = await api.patch(`/rentals/${id}/cancel`);
  return response.data;
};
