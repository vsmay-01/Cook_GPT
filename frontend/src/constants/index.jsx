import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#feature-section" },
  { label: "Workflow", href: "#workflow-section" },
  // { label: "Pricing", href: "#" },
  // { label: "Testimonials", href: "#" },
];


export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Drag-and-Drop Interface",
    description:
      "Easily analyze your documents with a user-friendly drag-and-drop interface.",
  },
  {
    icon: <Fingerprint />,
    text: "Multi-format Compatibility",
    description:
      "Process various document formats (PDF, CSV, voice files) and extract meaningful content,including handling images, links, and nested links.",
  },
  {
    icon: <ShieldHalf />,
    text: "User interaction",
    description:
      "Allow users to create multiple collections and query specific collections within the chatbot interface",
  },
  {
    // icon: <BatteryCharging />,
    icon: <GlobeLock />,
    text: "Security & Guardrails",
    description:
      "Implement guardrails to prevent hallucinations, misinformation, or inappropriate responses.Ensure secure document handling and retrieval.",
  },
  {
    icon: <PlugZap />,
    text: "AI-Powered Search & Retrieval (RAG)",
    description:
      "Implement Retrieval-Augmented Generation (RAG) for enhanced contextual understanding.",
  },
  {
    icon: <BotMessageSquare />,
    text: " Multi-Collection Organization ",
    description:
      "Create and manage multiple collections of documents effortlessly.",
  },
];

export const checklistItems = [
  {
    title: "Extract Key Insights Instantly",
    description:
      "AI-powered document analysis to summarize content, highlight important points, and provide key takeaways effortlessly.",
  },
  {
    title: "Seamless Multi-Format Support",
    description:
      "Process PDFs, Word documents, CSVs, and even voice files with advanced data extraction and structuring capabilities.",
  },
  {
    title: "AI-Powered Contextual Search",
    description:
      "Find answers faster with smart retrieval, enabling deep search within documents while maintaining context.",
  },
  {
    title: "Collaborate & Share with Ease",
    description:
      "Easily manage multiple document collections, share insights, and interact with AI-powered chat for team collaboration.",
  },
];


export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];

export const aiToolsLinks = [
  { href: "#", text: "AI Summarizer" },
  { href: "#", text: "Text Analyzer" },
];

export const integrationsLinks = [
  { href: "#", text: "API Access" },
  { href: "#", text: "Third-party Plugins" },
];

export const supportLinks = [
  { href: "#", text: "Help Center" },
  { href: "#", text: "Community Forum" },
];

