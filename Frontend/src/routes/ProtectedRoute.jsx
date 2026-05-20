import {
  Navigate,
  useLocation
} from "react-router-dom";

export default function ProtectedRoute({
  children
}) {

  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // 🚫 NOT CONNECTED
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // 🔒 FORCE CHANGE PASSWORD
  if (
    user.firstLogin &&
    location.pathname !== "/change-password"
  ) {

    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  return children;
}