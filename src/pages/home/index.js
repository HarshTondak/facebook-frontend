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
      {/* Header Portion */}
      <Header page="home" getAllPosts={getAllPosts} />

      {/* Left Portion of main page */}
      <LeftHome user={user} />

      {/* Mid Portion of main page */}
      <div className="home_middle" ref={middle}>
        {/* Stories Section */}
        <Stories />

        {/* Account Verification Message Section */}
        {user.verified === false && <SendVerification user={user} />}

        {/* Create Post Section */}
        <CreatePost user={user} setVisible={setVisible} />

        {/* Show the Posts Section */}
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

      {/* Right Portion of main page */}
      <RightHome user={user} />
    </div>
  );
}
