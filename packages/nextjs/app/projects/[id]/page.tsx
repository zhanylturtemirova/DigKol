"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { parseEther } from "viem";
import { ArrowLeftIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Mock data - in production, this will come from your smart contract
const mockProjectData = {
  1: {
    id: 1,
    title: "Milk cow",
    description: "Raising a healthy reproductive cow to provide fresh milk and calves for the community",
    longDescription: `
      Owning a cow as a community asset provides daily food security and long-term economic benefits. The cow produces milk for members and calves that grow into future assets.

      Benefits
        •	Daily Milk Supply – fresh dairy for families or for selling to generate shared income.
        •	Calving – each calf can be raised, sold, or kept to grow the herd.
        •	Natural Asset Growth – cows reproduce, meaning the community’s wealth increases over time.
        •	Shared Risk – purchase and maintenance costs are spread among members rather than one person.
        •	Local Food Independence – less reliance on external markets and fluctuating prices.

      Responsibilities & Risks
        •	Feeding & Care – daily food, vet care, vaccinations.
        •	Shared Workload – milking schedule, health monitoring, breeding decisions.
        •	Market Price Fluctuations – milk and calf prices may vary with season or economy.
        •	Animal Health Risks – illness or infertility can reduce productivity.
        •	Decision-Making – the community must agree on how to share milk, sell calves, and divide profits.

      Example Timeline
        •	Month 1: Voting & crowdfunding
        •	Month 2: Cow purchased, ownership shares recorded via smart contract
        •	Month 3: Daily milk distribution starts
        •	Month 12: First calf expected; asset value increases
        •	Year 2+: Calves sold or added to herd, profits distributed or reinvested
    `,
    creator: "0x1234567890123456789012345678901234567890",
    creatorName: "Maria H.",
    goal: 2000,
    raised: 890,
    backers: 15,
    daysLeft: 15,
    image: "https://images.unsplash.com/photo-1567879656049-f2265f23d8f8?w=400&h=300&fit=crop",
    category: "Livestock",
    featured: true,
    risks:
      "Owning a cow requires daily care, feeding, and veterinary attention. The community must coordinate responsibilities and share costs. Market prices for milk and calves can fluctuate, impacting returns. Illness or infertility are risks that could reduce productivity. Clear agreements on milk distribution and calf sales are essential to avoid conflicts.",
    rewards: [
      {
        id: 1,
        title: "Small stake",
        description: "5% ownership share in the community cow",
        amount: 5,
        backers: 45,
        estimatedDelivery: "Immediate",
      },
      {
        id: 2,
        title: "Medium stake",
        description: "10% ownership share in the community cow",
        amount: 10,
        backers: 78,
        estimatedDelivery: "Immediate",
      },
      {
        id: 3,
        title: "Large stake",
        description: "25% ownership share in the community cow",
        amount: 25,
        backers: 27,
        estimatedDelivery: "Immediate",
      },
    ],
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const project = mockProjectData[projectId as keyof typeof mockProjectData];

  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  // Read cow info from smart contract
  const { data: cowInfo, refetch: refetchCowInfo } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getCowInfo",
  });

  // Read greenhouse info from smart contract
  const { data: greenhouseInfo, refetch: refetchGreenhouseInfo } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getGreenhouseInfo",
  });

  const handleBackProject = async () => {
    if (!selectedReward && !customAmount) {
      alert("Please select a reward or enter a custom amount");
      return;
    }

    try {
      const sharePercentage = selectedReward
        ? project.rewards.find(r => r.id === selectedReward)?.amount || 0
        : parseFloat(customAmount);

      if (sharePercentage <= 0 || sharePercentage > 100) {
        alert("Please enter a valid share percentage (1-100)");
        return;
      }

      // Determine which function to call based on project category
      const functionName = project.category === "Livestock" ? "buyLivestockShares" : "buyGreenhouseShares";

      await writeYourContractAsync({
        functionName: functionName,
        args: [BigInt(sharePercentage)],
        value: parseEther("0.01"), // You can adjust this based on your pricing logic
      });

      // Refetch the contract data to update the UI
      if (project.category === "Livestock") {
        await refetchCowInfo();
      } else {
        await refetchGreenhouseInfo();
      }

      alert(`Successfully purchased ${sharePercentage}% shares of ${project.title}!`);

      // Clear the selection
      setSelectedReward(null);
      setCustomAmount("");
    } catch (error) {
      console.error("Error backing project:", error);
      alert("Failed to back project. Please try again.");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress based on smart contract data
  const getProjectProgress = () => {
    if (project.category === "Livestock" && cowInfo) {
      const [name, pricePerShare, sharesSold, sharesAvailable, active] = cowInfo;
      return {
        sharesSold: Number(sharesSold),
        sharesAvailable: Number(sharesAvailable),
        progressPercentage: Number(sharesSold),
        pricePerShare: Number(pricePerShare),
        assetName: name,
        active: active,
      };
    } else if (project.category !== "Livestock" && greenhouseInfo) {
      const [name, pricePerShare, sharesSold, sharesAvailable, active] = greenhouseInfo;
      return {
        sharesSold: Number(sharesSold),
        sharesAvailable: Number(sharesAvailable),
        progressPercentage: Number(sharesSold),
        pricePerShare: Number(pricePerShare),
        assetName: name,
        active: active,
      };
    }

    // Fallback to mock data if contract data not available
    return {
      sharesSold: Math.round((project.raised / project.goal) * 100),
      sharesAvailable: 100 - Math.round((project.raised / project.goal) * 100),
      progressPercentage: Math.round((project.raised / project.goal) * 100),
      assetName: project.title,
      active: true,
    };
  };

  const projectProgress = getProjectProgress();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/projects" className="btn btn-ghost btn-sm mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to village needs
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="mb-8">
              <Image
                src={project.image}
                alt={project.title}
                width={800}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Project Info */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <button onClick={() => setIsLiked(!isLiked)} className="btn btn-ghost btn-sm">
                  {isLiked ? <HeartSolidIcon className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
                </button>
                <button onClick={() => setShowShareModal(true)} className="btn btn-ghost btn-sm">
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>

              <p className="text-lg opacity-80 mb-4">{project.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <span className="badge badge-primary">{project.category}</span>
                <span>
                  by <Address address={project.creator} />
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="card bg-base-200 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{projectProgress.sharesSold}% sold</h2>
                <span className="text-lg">{projectProgress.sharesAvailable}% available</span>
              </div>
              <progress
                className="progress progress-primary w-full mb-2"
                value={projectProgress.sharesSold}
                max={100}
              ></progress>
              <div className="flex justify-between text-sm">
                <span>{projectProgress.sharesSold}% shares sold</span>
                <span>{projectProgress.sharesAvailable}% remaining</span>
              </div>
              <div className="mt-4 text-center">
                <span className="text-lg font-semibold">{project.backers} backers</span>
              </div>
              {projectProgress.sharesSold >= 100 && (
                <div className="mt-2 text-center">
                  <span className="badge badge-success">🎉 FULLY FUNDED!</span>
                </div>
              )}
            </div>

            {/* Long Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About this project</h2>
              <div className="prose max-w-none">
                {project.longDescription.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Risks and challenges</h2>
              <p className="opacity-80">{project.risks}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Confirm & Fund</h3>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="label">
                  <span className="label-text">Custom Share Percentage (1-100%)</span>
                </label>
                <EtherInput value={customAmount} onChange={setCustomAmount} placeholder="Enter share percentage" />
              </div>

              {/* Rewards */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Select a reward</h4>
                {project.rewards.map(reward => {
                  const isAvailable = reward.amount <= projectProgress.sharesAvailable;
                  return (
                    <div
                      key={reward.id}
                      className={`border rounded-lg p-4 mb-3 transition-colors ${
                        !isAvailable
                          ? "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"
                          : selectedReward === reward.id
                            ? "border-primary bg-primary/10 cursor-pointer"
                            : "border-base-300 hover:border-primary/50 cursor-pointer"
                      }`}
                      onClick={() => isAvailable && setSelectedReward(reward.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">{reward.amount}%</h5>
                          <p className="text-sm opacity-80">{reward.title}</p>
                          <p className="text-xs mt-1">{reward.description}</p>
                          <p className="text-xs mt-1">Est. delivery: {reward.estimatedDelivery}</p>
                          {!isAvailable && (
                            <p className="text-xs mt-1 text-red-500">
                              ❌ Not enough shares available ({projectProgress.sharesAvailable}% left)
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm opacity-70">{reward.backers} backers</span>
                          {isAvailable && <div className="text-xs text-green-600">✅ Available</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="btn btn-primary w-full" onClick={handleBackProject}>
                Confirm & Fund
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs opacity-70">You will be charged when the project reaches its funding goal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Share this project</h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                value={`${window.location.origin}/projects/${project.id}`}
                readOnly
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/projects/${project.id}`);
                  setShowShareModal(false);
                }}
              >
                Copy
              </button>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowShareModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
