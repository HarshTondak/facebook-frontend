import LeftLink from "./LeftLink";
import "./style.css";
import { left } from "../../../data/home";
import { Link } from "react-router-dom";
import { ArrowDown1 } from "../../../svg";
import { useState } from "react";
import Shortcut from "./Shortcut";

export default function LeftHome({ user }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="left_home scrollbar">
      {/* User Info */}
      <Link to="/profile" className="left_link hover2">
        <img src={user?.picture} alt="" />
        <span>
          {user?.first_name} {user.last_name}
        </span>
      </Link>

      {/* Showing 1st 8 links */}
      {left.slice(0, 8).map((link, i) => (
        <LeftLink
          key={i}
          img={link.img}
          text={link.text}
          notification={link.notification}
        />
      ))}

      {/* Show More Button */}
      {!visible && (
        <div
          className="left_link hover2"
          onClick={() => {
            setVisible(true);
          }}
        >
          <div className="small_circle">
            <ArrowDown1 />
          </div>
          <span>See more</span>
        </div>
      )}

      {/* On Clicking Show More Button we show rest of the links */}
      {visible && (
        <div className="more_left">
          {left.slice(8, left.length).map((link, i) => (
            <LeftLink
              key={i}
              img={link.img}
              text={link.text}
              notification={link.notification}
            />
          ))}
          <div
            className="left_link hover2"
            onClick={() => {
              setVisible(false);
            }}
          >
            <div className="small_circle rotate360">
              <ArrowDown1 />
            </div>
            <span>Show less</span>
          </div>
        </div>
      )}

      {/* Bottom Portion */}
      <div className="splitter"></div>
      <div className="shortcut">
        <div className="heading">Your Shortcuts</div>
        <div className="edit_shortcut">Edit</div>
      </div>
      <div className="shortcut_list">
        <Shortcut
          link="https://www.linkedin.com/in/harsh-tondak-a75742202/"
          img="../../images/linkedin.png"
          name="My LinkedIn"
        />

        <Shortcut
          link="https://www.instagram.com/tondakharsh/"
          img="../../images/insta.png"
          name="My Instagram "
        />
      </div>
      <div className={`fb_copyright ${visible && "relative_fb_copyright"}`}>
        <Link to="/">Privacy </Link>
        <span>. </span>
        <Link to="/">Terms </Link>
        <span>. </span>
        <Link to="/">
          Ad Choices <i className="ad_choices_icon"></i>
        </Link>
        <span>. </span>
        <Link to="/"></Link>Cookies <span>. </span>
        <Link to="/">More </Link>
        <span>. </span> <br />
        SnapBook © 2023
      </div>
    </div>
  );
}
