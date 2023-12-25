import Moment from "react-moment";
// "Moment" is used for formatting date and time values

export default function Comment({ comment }) {
  return (
    <div className="comment">
      {/* Image of commenter */}
      <img src={comment.commentBy.picture} alt="" className="comment_img" />

      <div className="comment_col">
        <div className="comment_wrap">
          {/* Commenter's details */}
          <div className="comment_name">
            {comment.commentBy.first_name} {comment.commentBy.last_name}
          </div>

          {/* Text in Comment */}
          <div className="comment_text">{comment.comment}</div>
        </div>

        {/* Image in comment */}
        {comment.image && (
          <img src={comment.image} alt="" className="comment_image" />
        )}

        <div className="comment_actions">
          <span>Like</span>
          <span>Reply</span>
          <span>
            {/* Showing the amount time elapsed from the publish time of comment */}
            {/* "fromNow" prop is set to format the date or time value in a relative "from now" format.
                For example, "2 minutes ago" or "in 5 hours." */}
            {/* "interval" prop is set to "30", which means the component will update its display
                every "30" seconds to reflect the latest "from now" value.  */}
            <Moment fromNow interval={30}>
              {comment.commentAt}
            </Moment>
          </span>
        </div>
      </div>
    </div>
  );
}
