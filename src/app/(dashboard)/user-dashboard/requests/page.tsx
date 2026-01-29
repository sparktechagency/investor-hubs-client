"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import RequestDetailModal from "@/components/dashboard/Request/RequestDetailsModal";
import NewRequestModal from "@/components/dashboard/Request/NewRequestModal";

export default function RequestBoard() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const categories = [
    "All",
    "Vacant Land",
    "Farms",
    "Hotels",
    "Investment Portfolios",
  ];

  const requests = [
    {
      user: "Investor42",
      time: "2 hours ago",
      title: "Coastal Development Land Needed",
      description:
        "Looking for 50+ hectares near coastal region for luxury development. Budget open. Ideally looking for land with existing zoning rights or potential for rezoning. Access to main roads is crucial.",
      tag: "Vacant Land",
      budget: "$2M – $5M",
      urgency: "High",
      responses: 3,
    },
    {
      user: "Developer009",
      time: "5 hours ago",
      title: "Distressed Hotel Assets",
      description:
        "Seeking boutique hotel opportunities in Cape Town CBD. Distressed assets considered. We are looking for properties that can be turned around with renovation and rebranding.",
      tag: "Hotels",
      budget: "$10M+",
      urgency: "Medium",
      responses: 1,
    },
  ];

  const filteredRequests =
    activeCategory === "All"
      ? requests
      : requests.filter(
          (req) => req.tag.toLowerCase() === activeCategory.toLowerCase(),
        );

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Request Board</h1>
          <p className="text-sm text-gray-400">
            Connect with the community anonymously.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium hover:bg-[#F1D98A] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition cursor-pointer ${
              activeCategory === cat
                ? "bg-primary text-black border-[#E6C97A]"
                : "border-[#E6C97A]/30 text-gray-300 hover:border-[#E6C97A]"
            }`}
          >
            {cat}
          </button>
        ))}
        <br />
      </div>

      {/* Requests */}
      <div className="space-y-6">
        {filteredRequests.map((req, i) => (
          <div
            key={i}
            className="bg-[#111111] border border-[#D4AF371A] rounded-xl p-5 sm:p-6 hover:border-[#E6C97A]/40 transition"
          >
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E6C97A]/10 flex items-center justify-center text-sm font-medium text-[#E6C97A]">
                  {req.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{req.user}</p>
                  <p className="text-xs text-gray-500">{req.time}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs border border-[#D4AF3733] text-primary bg-[#D4AF371A] w-fit">
                {req.tag}
              </span>
            </div>

            {/* Content */}
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {req.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {req.description}
            </p>

            {/* Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded bg-[#1A1A1A] border border-white/10">
                  Budget: {req.budget}
                </span>
                <span
                  className={`px-3 py-1 rounded border ${
                    req.urgency === "High"
                      ? "border-red-500/40 text-red-400"
                      : "border-yellow-500/40 text-yellow-400"
                  }`}
                >
                  Urgency: {req.urgency}
                </span>
                <span className="px-3 py-1 rounded bg-[#1A1A1A] border border-white/10">
                  {req.responses} Responses
                </span>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="text-sm text-primary hover:underline w-fit cursor-pointer"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
      <RequestDetailModal open={open} onClose={() => setOpen(false)} />
      <NewRequestModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
