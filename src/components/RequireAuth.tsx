import React, { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/user/AuthSlice";
import { useSelector } from "react-redux";
const RequireAuth: React.FC = () => {
  const token = useSelector(selectCurrentUser);
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    token;
  }, []);
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
