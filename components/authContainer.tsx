"use client";

import { useQuery } from "@tanstack/react-query";
// import { Alert, AlertIcon } from "@chakra-ui/react";
import { Button } from "antd";
import { GetServerSideProps } from "next";
import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  signIn,
} from "next-auth/react";
import { useRouter } from "next/router";
import { use, useState } from "react";
import styles from "../styles/Signin.module.css";
import clsx from "clsx";
import { motion } from "framer-motion";
interface Credentials {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export async function getData(): Promise<{
  credentials?: ClientSafeProvider | null;
  csrf?: string;
}> {
  const res = await getProviders();
  const csrf = await getCsrfToken();

  return {
    credentials: res?.credentials,
    csrf,
  };
}

// { children }: { children: React.ReactNode }
const AuthContainer = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data, error, status } = useQuery({
    queryFn: async () => await getData(),
    queryKey: ["providers"],
  });

  if (!data) return <></>;
  if (!data.credentials) return <></>;
  if (!data.csrf) return <></>;

  const { credentials, csrf } = data;
  const goSignIn = async (credentials: Credentials) => {
    setLoading(true);

    if (!email.trim()) {
      // alert("Email is required");

      setLoading(false);
      return;
    }
    const signInfo = await signIn(credentials.id, {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (signInfo?.error) {
      // alert(signInfo?.error);
      return <></>;
    }

    // router.replace("/kanban");
  };

  return (
    <motion.div className="caonima relative left-0 top-0 w-full h-full overflow-hidden font-mono">
      <h1 className="fixed z-50 text-white left-3 top-2 text-sm">
        Cherry Vision Shop
      </h1>

      {/* transform: rotate(11deg) translate(-20%, -10%); */}
      {/* ${styles.wrapper} bg-slate-400 rotate-[11deg] translate-x-[-20%] translate-y-[-10%] */}
      <motion.div
        initial={{
          rotate: 0,
          width: 0,
          translateX: 0,
          translateY: 0,
        }}
        animate={{
          rotate: 11,
          width: "80%",
          translateX: "-40%",
          translateY: "-10%",
        }}
        transition={{
          duration: 0.5,
          delay: 1,
        }}
        // "rotate-[11deg]": true,
        className={clsx({
          [styles.wrapper]: true,
          "bg-slate-400": true,

          "translate-x-[-20%] translate-y-[-10%]": true,
        })}
      />

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
          delay: 1.5,
        }}
        className={styles.content}
      >
        <article className={styles.cardWrapper}>
          <form
            className={styles.cardContent}
            onSubmit={(evt) => {
              evt.preventDefault();
              goSignIn(credentials);
            }}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrf!} />
            <input
              id="email"
              type="text"
              autoComplete="on"
              placeholder="Please enter your email"
              size={30}
              value={email}
              onInput={(evt) => {
                setEmail((evt.target as HTMLInputElement).value);
              }}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") {
                  // goSignIn(providers);
                }
              }}
            />
            <input
              id="password"
              type="password"
              autoComplete="on"
              placeholder="Please enter your password"
              size={30}
              value={password}
              onInput={(evt) => {
                setPassword((evt.target as HTMLInputElement).value);
              }}
              onKeyDown={(evt) => {
                // if (evt.key === "Enter") {
                // }
              }}
            />

            <Button
              type="link"
              loading={loading}
              htmlType="submit"
              className="font-mono"
            >
              登录
            </Button>
            <hr />
          </form>
        </article>
      </motion.div>

      <motion.img
        initial={{
          right: 0,
          scale: 1,
        }}
        animate={{
          top: "-35%",
          right: "-30%",
          scale: 0.8,
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 1,
        }}
        className="fixed min-w-full min-h-full z-10 top-[-20%] right-[-40%]"
        src="/dragon.jpg"
        alt="Pattern Background"
      />

      {/* <img src="/dragon.jpg" alt="Pattern Background" className={} /> */}
    </motion.div>
  );
};

export default AuthContainer;
