import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";

export default function EmojiPickerBackgrounds({
  text,
  user,
  setText,
  type2,
  background,
  setBackground,
}) {
  const [picker, setPicker] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const bgRef = useRef(null);

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

  // Background Images
  const postBackgrounds = [
    "../../../images/postbackgrounds/1.jpg",
    "../../../images/postbackgrounds/2.jpg",
    "../../../images/postbackgrounds/3.jpg",
    "../../../images/postbackgrounds/4.jpg",
    "../../../images/postbackgrounds/5.jpg",
    "../../../images/postbackgrounds/6.jpg",
    "../../../images/postbackgrounds/7.jpg",
    "../../../images/postbackgrounds/8.jpg",
    "../../../images/postbackgrounds/9.jpg",
  ];

  // Setting the bg-image in post
  const backgroundHanlder = (i) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`;
    setBackground(postBackgrounds[i]);
    bgRef.current.classList.add("bgHandler");
  };

  // Removing the bg-image from post
  const removeBackground = (i) => {
    bgRef.current.style.backgroundImage = "";
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };

  const sm = useMediaQuery({
    query: "(max-width: 550px)",
  });

  return (
    // "type2" is when you are posting an image
    // It is used to set the text area correctly for (1)when posting bg-image, and (2)when posting image
    <div className={type2 ? "images_input" : ""}>
      {/* Text area */}
      <div className={!type2 ? "flex_center" : ""} ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          placeholder={`What's on your mind, ${user.first_name}`}
          className={`post_input ${type2 ? "input2" : ""} ${
            sm && !background && 10
          }`}
          onChange={(e) => setText(e.target.value)}
          // Making the text always stay in the center after adding the bg-image
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 32)
                : "0"
            }%`,
          }}
        ></textarea>
      </div>

      {/* Main Body */}
      <div className={!type2 ? "post_emojis_wrap" : ""}>
        {picker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? "movepicker2" : "rlmove"
            }`}
          >
            <Picker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && (
          <img
            src="../../../icons/colorful.png"
            alt=""
            onClick={() => {
              setShowBgs((prev) => !prev);
            }}
          />
        )}
        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div
              className="no_bg"
              onClick={() => {
                removeBackground();
              }}
            ></div>
            {postBackgrounds.map((bg, i) => (
              <img
                src={bg}
                key={i}
                alt=""
                onClick={() => {
                  backgroundHanlder(i);
                }}
              />
            ))}
          </div>
        )}

        {/* Emoji Icon */}
        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          onClick={() => {
            setPicker((prev) => !prev);
          }}
        ></i>
      </div>
    </div>
  );
}
