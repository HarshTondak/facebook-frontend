import "./style.css";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Bookmark,
  BookmarkActive,
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Logo,
  Market,
  Menu,
  Messenger,
  Notifications,
  Search,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useRef, useState } from "react";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./userMenu";

export default function Header({ page, getAllPosts }) {
  const { user } = useSelector((user) => ({ ...user }));
  // const color = "#65676b";
  const color = "#7149C6";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);

  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });

  return (
    <header>
      {/* Left section of the header */}
      <div className="header_left">
        {/* Search input field */}
        <Link to="/" className="header_logo" onClick={() => getAllPosts()}>
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search SnapBook"
            className="hide_input"
          />
        </div>
      </div>

      {/* Showing the Search Menu on clicking the Search input field */}
      {showSearchMenu && (
        <SearchMenu
          color={color}
          setShowSearchMenu={setShowSearchMenu}
          token={user.token}
        />
      )}

      {/* Middle Section of the header */}
      <div className="header_middle">
        {/* Home Icon */}
        <Link
          to="/"
          className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
          onClick={() => getAllPosts()}
        >
          {page === "home" ? <HomeActive /> : <Home color={color} />}
        </Link>

        {/* Friends Icon */}
        <Link
          to="/friends"
          className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}
        >
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
        </Link>

        {/* Watch Bookmarked Posts Icon */}
        <Link
          to="/getAllSavedPosts"
          className={`middle_icon ${
            page === "getAllSavedPosts" ? "active" : "hover1"
          }`}
        >
          {page === "savedPosts" ? (
            <BookmarkActive color={color} />
          ) : (
            <Bookmark color={color} />
          )}
          <div className="middle_notification">+9</div>
        </Link>

        {/* <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link> */}
        {/* <Link to="/" className="middle_icon hover1 ">
          <Gaming color={color} />
        </Link> */}
      </div>

      {/* Right Section of the Header */}
      <div className="header_right">
        {/* Profile Pic */}
        <Link
          to="/profile"
          className={`profile_link hover1 ${
            page === "profile" ? "active_link" : ""
          }`}
        >
          <img src={user?.picture} alt="" />
          <span>{user?.first_name}</span>
        </Link>
        {/* Multi-Menu Button */}
        <div
          className={`circle_icon hover1 ${showAllMenu && "active_header"}`}
          ref={allmenu}
        >
          <div
            onClick={() => {
              setShowAllMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <Menu />
            </div>
          </div>
          {showAllMenu && <AllMenu />}
        </div>
        {/* Messanger Icon */}
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        {/* Notification Icon */}
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">5</div>
        </div>
        {/* User Options Menu */}
        <div
          className={`circle_icon hover1 ${showUserMenu && "active_header"}`}
          ref={usermenu}
        >
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <ArrowDown />
            </div>
          </div>
          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
