import { api } from "./api";

export const fetchRequestsAPI = async () => {
  const res = await api.get("/payments/requests");
  return res.data;
};

export const acceptRequestAPI = async (id: string) => {
  const res = await api.post(`/payments/request/accept/${id}`);
  return res.data;
};

export const rejectRequestAPI = async (id: string) => {
  const res = await api.post(`/payments/request/reject/${id}`);
  return res.data;
};
