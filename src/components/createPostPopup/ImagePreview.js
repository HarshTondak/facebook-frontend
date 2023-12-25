import { useRef } from "react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";

export default function ImagePreview({
  text,
  user,
  setText,
  images,
  setImages,
  setShowPrev,
  setError,
}) {
  // Refrence for clickable components to be used to select files from the device
  const imageInputRef = useRef(null);

  // Validating the uploading image's format and its size
  const handleImages = (e) => {
    // "e.target.files" contains all the photos selected by user for uploading purpose
    // "Array.from(e.target.files)" converts the FileList object into a regular JS array -> "files"
    let files = Array.from(e.target.files);

    files.forEach((img) => {
      if (
        img.type !== "image/jpeg" &&
        img.type !== "image/png" &&
        img.type !== "image/webp" &&
        img.type !== "image/gif"
      ) {
        setError(
          `${img.name} format is unsupported ! only Jpeg, Png, Webp, Gif are allowed.`
        );
        // Filtering the "files[]" such that it only contains the data items which passes the validation checks.
        files = files.filter((item) => item.name !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 5) {
        setError(`${img.name} size is too large max 5mb allowed.`);
        // Filtering the "files[]" such that it only contains the data items which passes the validation checks.
        files = files.filter((item) => item.name !== img.name);
        return;
      } else {
        // If a file passes the type and size validation checks
        // It proceeds to read the file's data as a data URL using a "FileReader()"
        const reader = new FileReader();
        // Reading the file's contents
        reader.readAsDataURL(img);
        // "onload" event of the "FileReader()" is executed once the file has been read.
        reader.onload = (readerEvent) => {
          // New image data is added to the existing array of images using the spread operator
          setImages((images) => [...images, readerEvent.target.result]);
        };
      }
    });
  };

  return (
    <div className="overflow_a scrollbar">
      {/* passing the "type2" to set the text area accordingly */}
      <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />

      {/* Main body */}
      <div className="add_pics_wrap">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          ref={imageInputRef}
          onChange={handleImages}
        />
        {images && images.length ? (
          <div className="add_pics_inside1 p0">
            <div className="preview_actions">
              <button className="hover1">
                <i className="edit_icon"></i>
                Edit
              </button>
              <button
                className="hover1"
                onClick={() => {
                  // Opens the file dialog on the user's device, allowing them to select a file.
                  imageInputRef.current.click();
                }}
              >
                <i className="addPhoto_icon"></i>
                Add Photos/Videos
              </button>
            </div>

            <div
              className="small_white_circle"
              onClick={() => {
                setImages([]);
              }}
            >
              <i className="exit_icon"></i>
            </div>

            {/* Showing the preview of selected images */}
            <div
              className={
                images.length === 1
                  ? "preview1"
                  : images.length === 2
                  ? "preview2"
                  : images.length === 3
                  ? "preview3"
                  : images.length === 4
                  ? "preview4 "
                  : images.length === 5
                  ? "preview5"
                  : images.length % 2 === 0
                  ? "preview6"
                  : "preview6 singular_grid"
              }
            >
              {images.map((img, i) => (
                <img src={img} key={i} alt="" />
              ))}
            </div>
          </div>
        ) : (
          <div className="add_pics_inside1">
            <div
              className="small_white_circle"
              onClick={() => {
                setShowPrev(false);
              }}
            >
              <i className="exit_icon"></i>
            </div>

            <div
              className="add_col"
              onClick={() => {
                // Opens the file dialog on the user's device, allowing them to select a file.
                imageInputRef.current.click();
              }}
            >
              <div className="add_circle">
                <i className="addPhoto_icon"></i>
              </div>
              <span>Add Photos/Videos</span>
              <span>or drag and drop</span>
            </div>
          </div>
        )}

        <div className="add_pics_inside2">
          <div className="add_circle">
            <i className="phone_icon"></i>
          </div>

          <div className="mobile_text">Add phots from your mobile device.</div>
          <span className="addphone_btn">Add</span>
        </div>
      </div>
    </div>
  );
}
