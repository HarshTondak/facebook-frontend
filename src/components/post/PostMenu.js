import { useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
import { deletePost, savePost } from "../../functions/post";
import { saveAs } from "file-saver";

export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
  postId,
  token,
  checkSaved,
  setCheckSaved,
  images,
  postRef,
}) {
  // "test" if true shows that the post if of logged-in user's own post
  const [test, setTest] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);

  // Hides the menu on clicking outside it
  useOnClickOutside(menu, () => setShowMenu(false));

  // Bookmarking the posts
  const saveHandler = async () => {
    savePost(postId, token);
    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };

  // Downloading Posts[only posts that have image(s)] on local storage
  const downloadImages = async () => {
    images.map((img) => {
      saveAs(img.url, "image.jpg");
    });
  };

  // Deleting the post(user's own) from database
  const deleteHandler = async () => {
    const res = await deletePost(postId, token);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };

  return (
    <ul className="post_menu" ref={menu}>
      {test && <MenuItem icon="pin_icon" title="Pin Post" />}

      {/* Save(Bookmark) post */}
      <div onClick={() => saveHandler()}>
        {checkSaved ? (
          <MenuItem
            icon="save_icon"
            title="Unsave Post"
            subtitle="Remove this from your saved items."
          />
        ) : (
          <MenuItem
            icon="save_icon"
            title="Save Post"
            subtitle="Add this to your saved items."
          />
        )}
      </div>

      <div className="line"></div>

      {test && <MenuItem icon="edit_icon" title="Edit Post" />}

      {!test && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}

      {/* Download the post[only posts that have image(s)] */}
      {imagesLength && (
        <div onClick={() => downloadImages()}>
          <MenuItem icon="download_icon" title="Download" />
        </div>
      )}

      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}

      {test && <MenuItem img="../../../icons/lock.png" title="Edit audience" />}

      {test && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post"
        />
      )}

      {test && <MenuItem icon="delete_icon" title="Turn off translations" />}

      {test && <MenuItem icon="date_icon" title="Edit Date" />}

      {test && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}

      {test && <MenuItem icon="archive_icon" title="Move to archive" />}

      {/* Delete the post */}
      {test && (
        <div onClick={() => deleteHandler()}>
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
            subtitle="items in your trash are deleted after 30 days"
          />
        </div>
      )}

      {!test && <div className="line"></div>}

      {!test && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report post"
          subtitle="i'm concerned about this post"
        />
      )}
    </ul>
  );
}
