"use client"
import Image from "next/image";
import { InfiniteCards } from "../ui/marqueeHero";

export default function Hero() {
  return (
    <div className="relative w-full h-[75vh] md:h-[84vh] overflow-hidden">

      {/* Background video */}
      <video
        ref={(el) => {
          if (el) el.playbackRate = 0.8;
        }}
        src="/your-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.7)" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">

        <Image
          src="/tewa.png"
          width={1500}
          height={1500}
          alt="logo"
          className="
            mb-4 
            w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 
            grayscale-100 brightness-0 invert
          "
        />

        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gold">
          Empowering Women Everywhere
        </h1>

        <p className="font-lora max-w-sm sm:max-w-md md:max-w-2xl text-xs sm:text-sm md:text-base text-gold">
          Tewa is creating a global movement for women to rise, connect and
          inspire across continents.
        </p>

        <HeroSlide />
      </div>
    </div>
  );
}

function HeroSlide() {
  return (
    <div className="
      h-8 sm:h-10 
      mt-10 sm:mt-16 md:mt-20 
      rounded-md flex flex-col antialiased 
      items-center justify-center relative overflow-hidden
    ">
      <InfiniteCards
        items={testimonials}
        direction="left"
        speed="fast"
      />
    </div>
  );
}

const testimonials = [
  { name: "Events" },
  { name: "Business" },
  { name: "Innovation" },
  { name: "Travels" },
  { name: "Money" },
];
