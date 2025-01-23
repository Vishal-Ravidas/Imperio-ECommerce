import axios from "axios";

export const postTransaction= async (data) => {
  try {
    const response = await axios.post("/api/Transaction", data);
    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export const getTransaction = async (params) => {
  try {
    const response = await axios.get("/api/Transaction");

    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export const putTransaction= async (data) => {
  try {
    const response = await axios.put(
      "/api/Transaction",
      data
    );
    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export const deleteTransaction= async (data) => {
  try {
    const response = await axios.delete("/api/Transaction");
    return response.data;
  } catch (error) {
    throw error;
  }
};
