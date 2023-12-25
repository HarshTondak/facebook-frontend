import Cookies from "js-cookie";

// Here we are getting the user state data from Cookies(if it exists, otherwise null)
export function userReducer(
  state = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  action
) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    case "UPDATEPICTURE":
      return { ...state, picture: action.payload };
    case "VERIFY":
      return { ...state, verified: action.payload };

    default:
      return state;
  }
}
