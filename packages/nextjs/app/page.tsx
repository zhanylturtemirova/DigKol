"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">DiKo</span>
          </h1>
          <p className="text-center text-lg opacity-70 mb-8">
            Digital Kolkhoz (DiKo) is a decentralized platform empowering communities to collaboratively fund and manage
            local projects transparently.
          </p>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/projects" className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
              <div className="card-body text-center">
                <RocketLaunchIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="card-title justify-center">Village needs</h2>
                <p className="text-sm opacity-70">Explore what are current needs of the village</p>
              </div>
            </Link>

            <Link href="/debug" className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
              <div className="card-body text-center">
                <BugAntIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="card-title justify-center">Debug Contracts</h2>
                <p className="text-sm opacity-70">Test and interact with smart contracts</p>
              </div>
            </Link>

            <Link href="/blockexplorer" className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
              <div className="card-body text-center">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="card-title justify-center">Block Explorer</h2>
                <p className="text-sm opacity-70">Explore transactions and addresses</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
