import { api } from "./api";

export const fetchTransactionsAPI = async ({
  filter,
  search,
  limit,
  skip,
}: {
  filter: string;
  search: string;
  limit: number;
  skip: number;
}) => {
  const res = await api.get("/transactions", {
    params: { filter, search, limit, skip },
  });
  return res.data;
};

export const exportTransactionsAPI = async ({
  filter,
  search,
  from,
  to,
}: {
  filter: string;
  search: string;
  from?: string | null;
  to?: string | null;
}) => {
  const res = await api.get("/transactions/export", {
    params: { filter, search, from: from ?? "", to: to ?? "" },
    responseType: "blob",
  });
  return res.data;
};
