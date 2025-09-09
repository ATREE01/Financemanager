"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col pt-[--navbar-height] min-h-screen w-full items-center p-12 bg-gray-50">
      <div className="flex flex-col text-black items-center text-center">
        <div className="container mx-auto mt-10">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            輕鬆管理您的財務
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            一個展示財務狀況摘要的網站，包含銀行、股票資訊，並追蹤您的財務歷史紀錄。
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link
              href="https://github.com/ATREE01/Financemanager"
              target="_blank"
              className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              GitHub Repo
            </Link>
            <Link
              href="/auth/login"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="container mx-auto mt-10 px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">功能預覽</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="shadow-lg rounded-lg overflow-hidden ">
              <img
                src="/Dashboard_Summary.png"
                alt="Dashboard Summary"
                className="w-full h-auto"
              />
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">財務總覽</h3>
              </div>
            </div>
            <div className="shadow-lg rounded-lg overflow-hidden">
              <img
                src="/Dashboard_history.png"
                alt="Dashboard History"
                className="w-full h-auto"
              />
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">歷史紀錄</h3>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-8">
            <div className="shadow-lg rounded-lg overflow-hidden">
              <img
                src="/Income_Expense.png"
                alt="Income Expense"
                className="w-full h-auto"
              />
            </div>
            <div className="shadow-lg rounded-lg overflow-hidden">
              <img src="/Stock.png" alt="Stock" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
