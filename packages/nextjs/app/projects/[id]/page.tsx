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
    title: "Eco-Friendly Water Bottle",
    description:
      "A revolutionary water bottle made from recycled ocean plastic that keeps your drinks cold for 24 hours and hot for 12 hours. Made from 100% recycled materials, this bottle is not only good for the environment but also incredibly functional.",
    longDescription: `
      Our Eco-Friendly Water Bottle is the result of years of research and development in sustainable materials. We've partnered with ocean cleanup organizations to source plastic waste directly from the ocean, transforming it into a premium, functional water bottle.

      **Key Features:**
      - Made from 100% recycled ocean plastic
      - 24-hour cold retention, 12-hour hot retention
      - BPA-free and food-safe materials
      - Leak-proof design with one-handed operation
      - Dishwasher safe
      - Lifetime warranty

      **Environmental Impact:**
      Each bottle removes approximately 50 plastic bottles worth of waste from the ocean. With your support, we can scale production and make a significant impact on ocean plastic pollution.

      **Production Timeline:**
      - Month 1-2: Finalize design and tooling
      - Month 3-4: Begin production of first batch
      - Month 5-6: Quality testing and refinement
      - Month 7-8: Mass production and shipping
    `,
    creator: "0x1234567890123456789012345678901234567890",
    creatorName: "Ocean Cleanup Co.",
    goal: 50000,
    raised: 25000,
    backers: 150,
    daysLeft: 15,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
    category: "Environment",
    featured: true,
    risks:
      "As with any new product, there are risks of production delays, quality issues, or supply chain disruptions. We've mitigated these risks by working with experienced manufacturers and having backup suppliers.",
    rewards: [
      {
        id: 1,
        title: "Early Bird Special",
        description: "One Eco-Friendly Water Bottle in your choice of color",
        amount: 25,
        backers: 45,
        estimatedDelivery: "March 2024",
      },
      {
        id: 2,
        title: "Standard Bottle",
        description: "One Eco-Friendly Water Bottle in your choice of color",
        amount: 35,
        backers: 78,
        estimatedDelivery: "April 2024",
      },
      {
        id: 3,
        title: "Bundle Pack",
        description: "Two Eco-Friendly Water Bottles + Custom Engraving",
        amount: 60,
        backers: 27,
        estimatedDelivery: "April 2024",
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
