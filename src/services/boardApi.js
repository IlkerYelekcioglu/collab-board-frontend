import axios from "axios";

const getToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const fetchBoard = async () => {
  const token = getToken();
  console.log("İstek atılırken kullanılan token:", token);

  try {
    const res = await api.get("/board");
    return res.data;
  } catch (error) {
    console.error("Board API Hatası:", error.response?.data || error.message);
    throw error;
  }
};

export const moveCardApi = async (cardId, newColumnId) => {
  await api.put(`/board/card/${cardId}/move`, { newColumnId });
};
