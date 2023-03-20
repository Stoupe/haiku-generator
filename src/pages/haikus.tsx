import { type NextPage } from "next";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const Haikus: NextPage = () => {
  const { data } = api.example.getMySavedHaikus.useQuery();

  return (
    <div className="p-5">
      <h1 className="text-5xl">Saved haikus</h1>
      <Link href="/" className="underline">
        Home
      </Link>
      <div className="flex flex-col gap-5">
        {data?.map((h) => (
          <pre key={h.id}>{h.haiku}</pre>
        ))}
      </div>
    </div>
  );
};

export default Haikus;
