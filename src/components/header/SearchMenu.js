import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import useClickOutside from "../../helpers/clickOutside";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
import { Link } from "react-router-dom";

export default function SearchMenu({ color, setShowSearchMenu, token }) {
  const [iconVisible, setIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const menu = useRef(null);
  const input = useRef(null);

  // Hides the SearchMenu on clicking outside it
  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });
  // To make the search input field in focus on clicking it once...
  useEffect(() => {
    input.current.focus();
  }, []);
  // To fetch the searched history as soon as the search input field is accessed...
  useEffect(() => {
    getHistory();
  }, []);

  // Shows the result according to the searched string
  const searchHandler = async () => {
    if (searchTerm === "") {
      setResults("");
    } else {
      const res = await search(searchTerm, token);
      setResults(res);
    }
  };
  // Update the searched history
  const addToSearchHistoryHandler = async (searchUser) => {
    const res = await addToSearchHistory(searchUser, token);
    getHistory();
  };
  // Fetches the search history
  const getHistory = async () => {
    const res = await getSearchHistory(token);
    setSearchHistory(res);
  };
  // Deletes the search history
  const handleRemove = async (searchUser) => {
    removeFromSearch(searchUser, token);
    getHistory();
  };

  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div
          className="search"
          onClick={() => {
            input.current.focus();
          }}
        >
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search SnapBook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => {
              setIconVisible(false);
            }}
            onBlur={() => {
              setIconVisible(true);
            }}
          />
        </div>
      </div>
      {results == "" && (
        <div className="search_history_header">
          <span>Recent searches</span>
          <a>Edit</a>
        </div>
      )}
      <div className="search_history scrollbar">
        {searchHistory &&
          results == "" &&
          searchHistory
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((user) => (
              <div className="search_user_item hover1" key={user._id}>
                <Link
                  className="flex"
                  to={`/profile/${user.user.username}`}
                  onClick={() => addToSearchHistoryHandler(user.user._id)}
                >
                  <img src={user.user.picture} alt="" />
                  <span>
                    {user.user.first_name} {user.user.last_name}
                  </span>
                </Link>
                <i
                  className="exit_icon"
                  onClick={() => {
                    handleRemove(user.user._id);
                  }}
                ></i>
              </div>
            ))}
      </div>
      <div className="search_results scrollbar">
        {results &&
          results.map((user) => (
            <Link
              to={`/profile/${user.username}`}
              className="search_user_item hover1"
              onClick={() => addToSearchHistoryHandler(user._id)}
              key={user._id}
            >
              <img src={user.picture} alt="" />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
