import { api } from "./api";
export const fetchTransactionsAPI = async ({ filter, search, limit, skip, }) => {
    const res = await api.get("/transaction", {
        params: { filter, search, limit, skip },
    });
    return res.data;
};
export const exportTransactionsAPI = async ({ filter, search, from, to, }) => {
    const res = await api.get("/transaction/export", {
        params: { filter, search, from: from ?? "", to: to ?? "" },
        responseType: "blob",
    });
    return res.data;
};
