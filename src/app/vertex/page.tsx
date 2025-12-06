"use client"
import React from "react";
import { motion } from "framer-motion";
import { Layers, Globe, ShieldCheck, LineChart } from "lucide-react";

// Inline UI components
function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>;
}

function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-8 ${className}`}>{children}</div>;
}

function Button({ className = "", children, ...props }: { className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-6 py-3 rounded-xl font-semibold transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-24 px-6 lg:px-20 gap-12">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Excellence at Every <span className="text-[#D4A23A]">Vertex</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            VertexOne Holdings delivers world-class, technology-powered solutions across
            finance, banking, insurance, investments, and event management, building a
            smarter, more connected future.
          </p>
          <Button className="bg-[#D4A23A] text-black font-semibold px-6 py-3 rounded-xl">
            Learn More
          </Button>
        </div>

        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=80"
          alt="Tech Visual"
          className="rounded-2xl shadow-2xl w-full lg:w-1/2"
        />
      </section>

      {/* Services Section */}
      <section className="bg-white text-black py-24 px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center mb-14">Our Core Divisions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={<Layers size={40} />}
            title="Technology"
            text="AI, automation, cybersecurity, and digital transformation solutions."
          />
          <ServiceCard
            icon={<Globe size={40} />}
            title="Finance & Banking"
            text="Digital banking, payment infrastructure, and financial solutions."
          />
          <ServiceCard
            icon={<ShieldCheck size={40} />}
            title="Insurance"
            text="Insurtech platforms, microinsurance, and risk advisory services."
          />
          <ServiceCard
            icon={<LineChart size={40} />}
            title="Investments & Capital"
            text="Venture funding, wealth management, and corporate advisory."
          />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0C1A36] text-white py-24 px-6 lg:px-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Partner With VertexOne Holdings</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          We connect industries, empower organizations, and create sustainable value
          through innovation and integration across global markets.
        </p>

        <Button className="bg-[#D4A23A] text-black font-semibold px-6 py-3 rounded-xl">
          Contact Us
        </Button>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition bg-white border-none">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4 text-[#0C1A36]">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </CardContent>
    </Card>
  );
}
