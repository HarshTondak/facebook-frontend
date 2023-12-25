import { Link } from "react-router-dom";
import "./style.css";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useRef, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReacts, reactPost } from "../../functions/post";
import Comment from "./Comment";

export default function Post({ post, user, profile }) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(1);
  const [checkSaved, setCheckSaved] = useState();
  const [comments, setComments] = useState([]);

  const isMountedRef = useRef(true); // Flag to track component mount state

  useEffect(() => {
    return () => {
      isMountedRef.current = false; // Update flag when component is unmounted
    };
  }, []);

  useEffect(() => {
    getPostReacts();
    // Cleanup function to cancel the asynchronous task if component is unmounted
    return () => {
      isMountedRef.current = false;
    };
  }, [post]);

  // Adding the comments for the post
  useEffect(() => {
    setComments(post?.comments);
  }, [post]);

  // Fetching reactions for a post
  const getPostReacts = async () => {
    const res = await getReacts(post._id, user.token);
    // Check if component is still mounted before updating state
    if (isMountedRef.current) {
      console.log(isMountedRef.current);
      setReacts(res.reacts);
      setCheck(res.check);
      setTotal(res.total);
      setCheckSaved(res.checkSaved);
    }
  };

  // Handles user reactions to a post based on the "type" of reaction passed to it
  const reactHandler = async (type) => {
    // Register reaction on the post
    reactPost(post._id, type, user.token);

    if (check === type) {
      // If Current reaction is same as previous, then we remove that reaction altogether
      setCheck();
      let index = reacts.findIndex((x) => x.react === check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotal((prev) => --prev);
      }
    } else {
      // If Current reaction is different from previous, then we register new reaction
      setCheck(type);
      let index = reacts.findIndex((x) => x.react === type);
      let index1 = reacts.findIndex((x) => x.react === check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotal((prev) => ++prev);
        // console.log(reacts);
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
        // console.log(reacts);
      }
    }
  };

  // Showing more comments
  const showMore = () => {
    setCount((prev) => prev + 3);
  };

  const postRef = useRef(null);

  return (
    <div
      className="post"
      style={{ width: `${profile && "100%"}` }}
      ref={postRef}
    >
      {/* Post Header */}
      <div className="post_header">
        <Link
          to={`/profile/${post.user.username}`}
          className="post_header_left"
        >
          {/* Image of the user that posted the given post */}
          <img src={post.user.picture} alt="" />

          {/* Info of the user that posted the given post */}
          <div className="header_col">
            <div className="post_profile_name">
              {/* User's Full Name */}
              {post.user.first_name} {post.user.last_name}
              {/* In case of profile-picture or cover-picture we show some message */}
              <div className="updated_p">
                {post.type === "profilePicture" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post.type === "coverPicture" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>

            {/* Time elapsed till now from the publishing time */}
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              . <Public color="#828387" />
            </div>
          </div>
        </Link>

        {/* Post Menu */}
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <Dots color="#828387" />
        </div>
      </div>

      {post.background ? (
        // If Post contains bg-image
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          {/* Text(if any) of the post */}
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : post.type === null ? (
        // If Post contains text or image
        <>
          {/* Text(if any) of the post */}
          <div className="post_text">{post.text}</div>
          {/* Images(if any) in the post */}
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img
                  src={image.url}
                  key={i}
                  alt=""
                  className={`img-${i}`}
                  loading="lazy"
                />
              ))}
              {/* If number of images in the post is > 5 */}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post.type === "profilePicture" ? (
        // If Post is of profile-picture
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post.user.cover} alt="" />
          </div>
          <img
            src={post.images[0].url}
            alt=""
            className="post_updated_picture"
            loading="lazy"
          />
        </div>
      ) : (
        // If Post of cover-image
        <div className="post_cover_wrap">
          <img src={post?.images?.[0]?.url} alt="" loading="lazy" />
        </div>
      )}

      {/* Info about the post */}
      <div className="post_infos">
        {/* Number of reactions */}
        <div className="reacts_count">
          {/* We will show top 3 types of reactions */}
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .slice(0, 3)
                .map(
                  (react, i) =>
                    react.count > 0 && (
                      <img
                        src={`../../../reacts/${react.react}.svg`}
                        alt=""
                        key={i}
                      />
                    )
                )}
          </div>
          {/* The total count of reactions on the post */}
          <div className="reacts_count_num">{total > 0 && total}</div>
        </div>

        <div className="to_right">
          {/* Number of comments */}
          <div className="comments_count">{comments?.length} comments</div>
          {/* Number of shares */}
          <div className="share_count">1 share</div>
        </div>
      </div>

      {/* Reaction Pop-ups(by default shows "like") */}
      <div className="post_actions">
        <ReactsPopup
          visible={visible}
          setVisible={setVisible}
          reactHandler={reactHandler}
        />
        <div
          className="post_action hover1"
          onMouseOver={() => {
            // On hovering over the react portion
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onMouseLeave={() => {
            // On moving the mouse out of the react portion
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }}
          onClick={() => reactHandler(check ? check : "like")}
        >
          {/* If reaction is chosen after hovering, then "check" === reaction,
              otherwise if only clicked directly then "check" will be registered as "like" */}
          {check ? (
            // Image of the reaction selected
            <img
              src={`../../../reacts/${check}.svg`}
              alt=""
              className="small_react"
              style={{ width: "18px" }}
            />
          ) : (
            // Like Image
            <i className="like_icon"></i>
          )}

          {/* Name of the reaction with their respective font colors */}
          <span
            style={{
              color: `
          
          ${
            check === "like"
              ? "#4267b2"
              : check === "love"
              ? "#f63459"
              : check === "haha"
              ? "#f7b125"
              : check === "sad"
              ? "#f7b125"
              : check === "wow"
              ? "#f7b125"
              : check === "angry"
              ? "#e4605a"
              : ""
          }
          `,
            }}
          >
            {check ? check : "Like"}
          </span>
        </div>

        <div className="post_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>

        <div className="post_action hover1">
          <i className="share_icon"></i>
          <span>Share</span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="comments_wrap">
        <div className="comments_order"></div>

        <CreateComment
          user={user}
          postId={post._id}
          setComments={setComments}
          setCount={setCount}
        />

        {/* Showing the comments(latest first) */}
        {/* "count" = 1 */}
        {comments &&
          comments
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .slice(0, count)
            .map((comment, i) => <Comment comment={comment} key={i} />)}

        {/* For Showing rest of the comments */}
        {count < comments.length && (
          <div className="view_comments" onClick={() => showMore()}>
            Show more Comments
          </div>
        )}
      </div>

      {/* Post Menu */}
      {showMenu && (
        <PostMenu
          userId={user.id}
          postUserId={post.user._id}
          imagesLength={post?.images?.length}
          setShowMenu={setShowMenu}
          postId={post._id}
          token={user.token}
          checkSaved={checkSaved}
          setCheckSaved={setCheckSaved}
          images={post.images}
          postRef={postRef}
        />
      )}
    </div>
  );
}
