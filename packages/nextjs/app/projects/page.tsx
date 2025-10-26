"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// Mock data for projects - in a real app, this would come from your smart contract
const mockProjects = [
  {
    id: 1,
    title: "Milk cow",
    description: "Raising a healthy reproductive cow to provide fresh milk and calves for the community",
    creator: "0x1234567890123456789012345678901234567890",
    goal: 2000,
    raised: 890,
    backers: 15,
    daysLeft: 15,
    image: "https://images.unsplash.com/photo-1567879656049-f2265f23d8f8?w=400&h=300&fit=crop",
    category: "Livestock",
    featured: true,
  },
  {
    id: 2,
    title: "Garden Autonomous Watering System",
    description: "Automated irrigation system for gardens",
    creator: "0x2345678901234567890123456789012345678901",
    goal: 75000,
    raised: 45000,
    backers: 89,
    daysLeft: 22,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    category: "Technology",
    featured: false,
  },
  {
    id: 3,
    title: "Coffee machine in shared zone, Building B",
    description: "Providing a high-quality coffee machine for community use",
    creator: "0x3456789012345678901234567890123456789012",
    goal: 300,
    raised: 180,
    backers: 67,
    daysLeft: 8,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
    category: "Food & Drink",
    featured: false,
  },
  {
    id: 4,
    title: "Community Solar Panels, 2.5kW",
    description: "Installing solar panels to provide renewable energy for shared spaces",
    creator: "0x4567890123456789012345678901234567890123",
    goal: 11000,
    raised: 7800,
    backers: 203,
    daysLeft: 35,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    category: "Power supply",
    featured: true,
  },
  {
    id: 5,
    title: "Greenhouse, East wing",
    description: "Building a community greenhouse to grow fresh produce year-round",
    creator: "0x5678901234567890123456789012345678901234",
    goal: 8000,
    raised: 1500,
    backers: 134,
    daysLeft: 18,
    image: "https://images.unsplash.com/photo-1661264047307-4d692250a7ac?w=400&h=300&fit=crop",
    category: "Community Zones",
    featured: false,
  },
  {
    id: 6,
    title: "Local Food from another village",
    description: "Supporting local farmers and sustainable agriculture",
    creator: "0x6789012345678901234567890123456789012345",
    goal: 40000,
    raised: 28000,
    backers: 95,
    daysLeft: 12,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    category: "Community Zones",
    featured: false,
  },
];

const categories = ["All", "Power supply", "Community Zones", "Livestock", "Technology"];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return b.raised - a.raised;
      case "newest":
        return b.id - a.id;
      case "ending":
        return a.daysLeft - b.daysLeft;
      case "goal":
        return b.goal - a.goal;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Village needs</h1>
          <p className="text-center text-lg opacity-70 mb-8">Explore what are current needs of the village</p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content opacity-50" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select
                className="select select-bordered"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select className="select select-bordered" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="ending">Ending Soon</option>
                <option value="goal">Goal Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <figure className="relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && <div className="absolute top-2 left-2 badge badge-primary">Featured</div>}
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">{project.title}</h2>
                  <p className="text-sm opacity-70 line-clamp-2">{project.description}</p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>${project.raised.toLocaleString()}</span>
                      <span>${project.goal.toLocaleString()}</span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={project.raised}
                      max={project.goal}
                    ></progress>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{Math.round((project.raised / project.goal) * 100)}% funded</span>
                      <span>{project.daysLeft} days left</span>
                    </div>
                  </div>

                  {/* Creator and Backers */}
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <div>
                      <span className="opacity-70">by </span>
                      <Address address={project.creator} />
                    </div>
                    <span>{project.backers} backers</span>
                  </div>

                  {/* Category Badge */}
                  <div className="mt-2">
                    <div className="badge badge-outline">{project.category}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-70">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
