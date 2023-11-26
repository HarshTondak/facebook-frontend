import { useEffect, useReducer } from "react";
import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import { friendspage } from "../../../functions/reducers";
import { getFriendsPageInfos } from "../../../functions/user";
import "./style.css";
export default function RightHome({ user }) {
  const [{ loading, error, data }, dispatch] = useReducer(friendspage, {
    loading: false,
    data: {},
    error: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    dispatch({ type: "FRIENDS_REQUEST" });
    const data = await getFriendsPageInfos(user.token);
    if (data.status === "ok") {
      dispatch({ type: "FRIENDS_SUCCESS", payload: data.data });
    } else {
      dispatch({ type: "FRIENDS_ERROR", payload: data.data });
    }
  };

  const color = "#65676b";
  return (
    <div className="right_home">
      <div className="heading">Sponsored</div>
      <div className="splitter1"></div>
      <div className="contacts_wrap">
        <div className="contacts_header">
          <div className="contacts_header_left">Friends</div>
          <div className="contacts_header_right">
            <div className="contact_circle hover1">
              <NewRoom color={color} />
            </div>
            <div className="contact_circle hover1">
              <Search color={color} />
            </div>
            <div className="contact_circle hover1">
              <Dots color={color} />
            </div>
          </div>
        </div>
        <div className="contacts_list">
          {data?.friends ? (
            data?.friends
              .slice(0, 5)
              .map((friend) => <Contact user={friend} key={friend._id} />)
          ) : (
            <div className="contacts_header">You have no Friends</div>
          )}
        </div>
      </div>
    </div>
  );
}
