import Cookies from "js-cookie";

// Here we are getting the theme state data from Cookies(if it exists, otherwise false)
export function themeReducer(
  state = Cookies.get("darkTheme")
    ? JSON.parse(Cookies.get("darkTheme"))
    : false,
  action
) {
  switch (action.type) {
    case "DARK":
      return true;
    case "LIGHT":
      return false;

    default:
      return state;
  }
}
