import { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import "./style.css";
import Post from "../../components/post";
import { GridLoader } from "react-spinners";
import { savedPostsReducer } from "../../functions/reducers";
import axios from "axios";

export default function SavedPosts({}) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState(0);

  const [{ loading, error, posts }, dispatch] = useReducer(savedPostsReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  useEffect(() => {
    if (user) getAllSavedPosts();
  }, [user, dispatch]);

  const getAllSavedPosts = async () => {
    try {
      if (user) {
        dispatch({
          type: "SAVED_POSTS_REQUEST",
        });
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getAllSavedPosts`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        dispatch({
          type: "SAVED_POSTS_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "SAVED_POSTS_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (middle.current) {
        setHeight(middle.current.clientHeight);
      }
    }, 0);
  }, [loading]);

  return (
    <>
      <Header page="savedPosts" />
      <div className="saved">
        <div className="saved_left">
          <div className="saved_left_header">
            <h3>Saved Posts</h3>
          </div>
        </div>

        <div className="saved_right" style={{ height: `${height + 150}px` }}>
          {loading ? (
            <div className="sekelton_loader">
              <GridLoader color="#a5f" />
            </div>
          ) : (
            <div className="posts" ref={middle}>
              {posts?.length > 0 ? (
                posts?.map((post, i) => (
                  <Post key={i} post={post} user={user} />
                ))
              ) : (
                <h3>No Saved Posts Yet...</h3>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
