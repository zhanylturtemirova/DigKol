"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { parseEther } from "viem";
import { ArrowLeftIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Mock data - in a real app, this would come from your smart contract
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
        title: "Milk supply",
        description: "Monthly supply of fresh milk from the community cow",
        amount: 25,
        backers: 45,
        estimatedDelivery: "March 2026",
      },
      {
        id: 2,
        title: "Milk, butter, cream",
        description: "Monthly supply of fresh milk, butter, and cream",
        amount: 35,
        backers: 78,
        estimatedDelivery: "April 2026",
      },
      {
        id: 3,
        title: "Own a calf",
        description: "Ownership of a calf born from the community cow",
        amount: 180,
        backers: 27,
        estimatedDelivery: "November 2026",
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

  const handleBackProject = async () => {
    if (!selectedReward && !customAmount) {
      alert("Please select a reward or enter a custom amount");
      return;
    }

    try {
      const amount = selectedReward
        ? project.rewards.find(r => r.id === selectedReward)?.amount || 0
        : parseFloat(customAmount);

      if (amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      // For demo purposes, we'll use the setGreeting function with a message about backing
      // In a real implementation, you would have a proper crowdfunding contract
      await writeYourContractAsync({
        functionName: "setGreeting",
        args: [`Backed project: ${project.title} with $${amount}`],
        value: parseEther(amount.toString()),
      });

      alert("Thank you for backing this project!");
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

  const progressPercentage = Math.round((project.raised / project.goal) * 100);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/projects" className="btn btn-ghost btn-sm mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
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
                <h2 className="text-2xl font-bold">${project.raised.toLocaleString()}</h2>
                <span className="text-lg">of ${project.goal.toLocaleString()} goal</span>
              </div>
              <progress
                className="progress progress-primary w-full mb-2"
                value={project.raised}
                max={project.goal}
              ></progress>
              <div className="flex justify-between text-sm">
                <span>{progressPercentage}% funded</span>
                <span>{project.daysLeft} days left</span>
              </div>
              <div className="mt-4 text-center">
                <span className="text-lg font-semibold">{project.backers} backers</span>
              </div>
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
              <h3 className="text-xl font-bold mb-4">Back this project</h3>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="label">
                  <span className="label-text">Custom Amount</span>
                </label>
                <EtherInput value={customAmount} onChange={setCustomAmount} placeholder="Enter amount in ETH" />
              </div>

              {/* Rewards */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Select a reward</h4>
                {project.rewards.map(reward => (
                  <div
                    key={reward.id}
                    className={`border rounded-lg p-4 mb-3 cursor-pointer transition-colors ${
                      selectedReward === reward.id
                        ? "border-primary bg-primary/10"
                        : "border-base-300 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedReward(reward.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">${reward.amount}</h5>
                        <p className="text-sm opacity-80">{reward.title}</p>
                        <p className="text-xs mt-1">{reward.description}</p>
                        <p className="text-xs mt-1">Est. delivery: {reward.estimatedDelivery}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm opacity-70">{reward.backers} backers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary w-full" onClick={handleBackProject}>
                Back this project
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
