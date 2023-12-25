import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { comment } from "../../functions/post";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
import { ClipLoader } from "react-spinners";

export default function CreateComment({ user, postId, setComments, setCount }) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);
  const imgInput = useRef(null);

  // To make the cursor stay at any position and not reset after adding emojis
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  // Adding emogis to the text message in the post
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  // Validating the uploading comment image's format and its size
  const handleImage = (e) => {
    // Only one image is allowed to be added in comments at a time
    let file = e.target.files[0];

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      // Validation for file formats
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      // Validation for file size
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }
    // If a file passes the type and size validation checks
    // It proceeds to read the file's data as a data URL using a "FileReader()"
    const reader = new FileReader();
    // Reading the file's contents
    reader.readAsDataURL(file);
    // "onload" event of the "FileReader()" is executed once the file has been read.
    reader.onload = (event) => {
      // New image comment is added
      setCommentImage(event.target.result);
    };
  };

  // Adding Comments
  const handleComment = async (e) => {
    // On pressing enter
    if (e.key === "Enter") {
      if (commentImage != "") {
        // If there is an image in the comment
        setLoading(true);
        // Converting image dataURI into BLOB data
        const img = dataURItoBlob(commentImage);
        // Defining path
        const path = `${user.username}/post_images/${postId}`;
        // "FormData()" used for sending data(files) in HTTP requests
        let formData = new FormData();
        // The "append" method of the "FormData()" is used to add key-value pairs to the formdata.
        formData.append("path", path);
        formData.append("file", img);
        // Uploading the image file
        const imgComment = await uploadImages(formData, path, user.token);
        // Adding the comment under the given post
        const comments = await comment(
          postId,
          text,
          imgComment[0].url,
          user.token
        );
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      } else {
        // If comment conatains only text data
        setLoading(true);
        // Adding the comment under the given post
        const comments = await comment(postId, text, "", user.token);
        // Updating the comments in ui
        setComments(comments);
        // Updating comments count
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      }
    }
  };

  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        {/* Current user's image */}
        <img src={user?.picture} alt="" />

        {/* Commenting Section */}
        <div className="comment_input_wrap">
          {/* Emoji picker Component(shows on clicking emoji icon) */}
          {picker && (
            <div className="comment_emoji_picker">
              <Picker onEmojiClick={handleEmoji} />
            </div>
          )}

          {/* Image uploader(hidden) */}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImage}
          />

          {/* Error Handling */}
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}

          {/* Textual Area */}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleComment}
          />

          <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader size={20} color="#1876f2" loading={loading} />
          </div>

          {/* Emoji Icon */}
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker((prev) => !prev);
            }}
          >
            <i className="emoji_icon"></i>
          </div>

          {/* Camera Icon(for image uploading) */}
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current.click()}
          >
            <i className="camera_icon"></i>
          </div>

          {/* Gif Icon */}
          <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>

          {/* Sticker Icon */}
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>

      {/* Showing the commented images */}
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            {/* Cancle image comment button */}
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
}
