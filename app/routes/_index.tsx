import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

export default function Index() {

  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <h1>Turo Bynder Figma Plugin</h1>
      <Link to="/login">Go to log in</Link>
    </div>
  );
}
