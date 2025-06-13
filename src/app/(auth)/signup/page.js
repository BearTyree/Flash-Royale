"use client";

import { useActionState } from "react";
import styles from "@/styles/signup.module.css";
import { createUser } from "@/actions/auth.js";

export default function Signup() {
  const [state, action, pending] = useActionState(createUser, null);
  return (
    <div id={styles.content}>
      <div className={styles.container}>
        <h2>Flash Royale</h2>
        <p>Signup</p>
        <form action={action}>
          <label>Username</label> <br />
          <input type="text" id="username" name="username" />
          <br />
          <label>Password</label>
          <br />
          <input type="password" id="password" name="password" />
          <br />
          <button>Register</button>
        </form>
      </div>
    </div>
  );
}
