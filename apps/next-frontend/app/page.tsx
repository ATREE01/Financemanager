"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col pt-[--navbar-height] h-screen w-full items-center justify-between p-24">
      <div className="flex text-black h-full align-center items-center">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Manage Your Finances with Ease
          </h1>
          <p className="text-xl mb-6">
            Track your expenses, budget wisely, and achieve your financial
            goals.
          </p>
          <Link href="#" className="bg-white text-blue-500 py-2 px-4 rounded">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
