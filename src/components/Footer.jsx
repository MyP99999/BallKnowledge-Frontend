import { useState } from "react";

export default function Footer() {
  return (
    <nav className="bg-green-900 text-white w-full shadow-md flex items-center justify-center">
      <img className="h-6 w-6" src="/Ball.png" alt="Logo" />
      <h5 className="text-gray-300">@MyP</h5>
    </nav>
  );
}
