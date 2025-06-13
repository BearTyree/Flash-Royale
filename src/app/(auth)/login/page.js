"use client";

import { useActionState } from "react";
import styles from "@/styles/login.module.css";
import { authenticate } from "@/actions/auth.js";

export default function Login() {
  const [state, action, pending] = useActionState(authenticate, null);
  return (
    <div id={styles.content}>
      <div className={styles.container}>
        <h2>Flash Royale</h2>
        <p>Login</p>
        <form action={action}>
          <label>Username</label> <br />
          <input type="text" id="username" name="username" />
          <br />
          <label>Password</label>
          <br />
          <input type="password" id="password" name="password" />
          <br />
          <button>Login</button>
        </form>
      </div>
    </div>
  );
}
