import { useEffect } from "react";
import { Auth_URL } from "../apis/0Auth";

const Sign = () => {
  useEffect(() => {
    console.log("hi");

    open(Auth_URL, "__blank", "width=500,height=600");
  }, []);
  return <div className="sign-container"></div>;
};

export default Sign;
