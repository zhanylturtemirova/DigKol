"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: delegate } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "delegate",
  });
  const [newDelegate, setNewDelegate] = useState("");

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">CrowdFund</span>
          </h1>
          <p className="text-center text-lg opacity-70 mb-8">
            Discover and support innovative projects on the blockchain
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

          {/* Connection Status */}
          <div className="card bg-base-200 p-6">
            <h2 className="card-title mb-4">Connection Status</h2>
            <div className="flex justify-center items-center space-x-2 flex-col">
              <p className="my-2 font-medium">Connected Address:</p>
              <Address address={connectedAddress} />
            </div>
            <div className="mt-4 flex justify-center items-center space-x-2 flex-col">
              <Address address={delegate} />
            </div>
            <div className="mt-4 flex justify-center items-center space-x-2 flex-col">
              <AddressInput value={newDelegate} onChange={setNewDelegate} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
