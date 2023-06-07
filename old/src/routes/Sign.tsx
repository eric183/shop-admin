import { useEffect } from "react";
import { Auth_URL } from "../apis/Auth";
import { Button } from "antd";

const Sign = () => {
  return (
    <div className="sign-container">
      <Button onClick={() => open(Auth_URL, "_self")}>登录</Button>
    </div>
  );
};

export default Sign;
