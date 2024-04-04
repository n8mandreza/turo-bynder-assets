import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

export default function Index() {

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <h1>Turo Bynder Figma Plugin</h1>
    </div>
  );
}
