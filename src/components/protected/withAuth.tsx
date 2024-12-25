/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    const router = useRouter();
    const [token, setToken] = useState("");
    useEffect(() => {
      const tokenData = localStorage.getItem("token");
      setToken(tokenData ?? "");
      if (!tokenData) {
        router.push("/login");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!token) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
