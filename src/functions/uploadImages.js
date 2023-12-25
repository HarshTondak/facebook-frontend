import axios from "axios";

// Uploading image to the DataBase and Cloudinary
export const uploadImages = async (formData, path, token) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/uploadImages`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
