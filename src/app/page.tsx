"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/auth/login')
      // const data = await response.json()
      console.log(response)
    }
    getUsers()
  })
  return (
   
    <div>
     hello
    </div>
  );
}

