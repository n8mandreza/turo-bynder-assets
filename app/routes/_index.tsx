import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useContext, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

export default function Index() {
  const { token, tokenData } = useContext(AuthContext)

  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <h1>Turo Bynder Figma Plugin</h1>
      { token ? (
          <div className="flex flex-col gap-3">
            <h4>Login information from Access Token</h4>
            <code className="break-words max-w-prose">
                {JSON.stringify(tokenData, null, 2)}
            </code>
        </div>
      ) : (
        <h4>You are not logged in</h4>
      )}
    </div>
  );
}
