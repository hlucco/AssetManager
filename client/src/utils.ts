import { useEffect, useState } from "react";

export function useOutsideAlerter(ref: any, handler: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export function getToken() {
  const tokenString = sessionStorage.getItem("token");
  return tokenString;
}

export function clearSession() {
  sessionStorage.clear();
}

export function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: string) => {
    sessionStorage.setItem("token", userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token,
  };
}
