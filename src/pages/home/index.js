import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { GridLoader } from "react-spinners";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import "./style.css";

export default function Home({ setVisible, posts, loading, getAllPosts }) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // setHeight(middle.current.clientHeight);
    setTimeout(() => {
      if (middle.current) {
        setHeight(middle.current.clientHeight);
      }
    }, 0);
  }, [loading]);

  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" getAllPosts={getAllPosts} />

      <LeftHome user={user} />

      <div className="home_middle" ref={middle}>
        <Stories />

        {user.verified === false && <SendVerification user={user} />}

        <CreatePost user={user} setVisible={setVisible} />

        {loading ? (
          <div className="sekelton_loader">
            <GridLoader color="#a5f" />
          </div>
        ) : (
          <div className="posts">
            {posts.map((post, i) => (
              <Post key={i} post={post} user={user} />
            ))}
          </div>
        )}
      </div>
      <RightHome user={user} />
    </div>
  );
}
