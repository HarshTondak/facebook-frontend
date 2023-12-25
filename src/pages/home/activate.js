import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import ActivateForm from "./ActivateForm";
import "./style.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((user) => ({ ...user }));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Getting the token from the params in URL
  const { token } = useParams();

  // Runs the function as soon as the page loads
  useEffect(() => {
    activateAccount();
  }, []);

  const activateAccount = async () => {
    try {
      setLoading(true);
      // Sending the token from URL to backend for verification...
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(data.message);
      // Updating the verified status in Cookies
      Cookies.set("user", JSON.stringify({ ...user, verified: true }));
      // Updating the verified status in Redux Store
      dispatch({
        type: "VERIFY",
        payload: true,
      });
      // After 3 seconds navigate to Home
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
      // After 3 seconds navigate to Home
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  // This Component is excatly same as the Home component with only 1 difference
  return (
    <div className="home">
      {/* The difference is ActivateForm Component */}
      {success && (
        <ActivateForm
          type="success"
          header="Account verification succeded."
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={error}
          loading={loading}
        />
      )}
      {/* Everything from here is same as Home Component */}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
}
