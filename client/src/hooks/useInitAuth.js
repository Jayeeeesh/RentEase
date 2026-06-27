import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setInitializing,
  authSuccess,
  logout,
} from "../features/auth/authSlice";
import api from "../services/api";

const useInitAuth = () => {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const checkAuth = async () => {
      dispatch(setInitializing(true));
      const token = localStorage.getItem("accessToken");

      // No token → user not logged in
      if (!token) {
        dispatch(setInitializing(false));
        return;
      }

      try {
        // Step 1: verify token
        const res = await api.get("/users/me");

        dispatch(
          authSuccess({
            user: res.data.data,
            accessToken: token,
          }),
        );
      } catch {
        try {
          // Step 2: try refresh token
          const refreshRes = await api.post("/auth/refresh-token");

          const newToken = refreshRes.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);

          // Step 3: retry user fetch
          const res = await api.get("/users/me");

          dispatch(
            authSuccess({
              user: res.data.data,
              accessToken: newToken,
            }),
          );
        } catch {
          // Fully logged out
          localStorage.removeItem("accessToken");
          dispatch(logout());
        } finally {
          dispatch(setInitializing(false));
        }

        return;
      }

      dispatch(setInitializing(false));
    };

    checkAuth();
  }, [dispatch]);
};

export default useInitAuth;
