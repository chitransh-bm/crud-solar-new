"use client";

import { trpc } from "./_trpc/client";

// import { serverClient } from "./_trpc/serverClient"; //for server side

export default function Home() {
  // const { greeting } = await serverClient.getHello();
  const { data } = trpc.getHello.useQuery();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Hello {data?.greeting}</h1>
    </div>
  );
}
