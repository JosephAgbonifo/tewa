"use client";

import { InfiniteMovingCards } from "../ui/marquee";

export function Trending() {
  return (
    <div className="h-10 rounded-md flex flex-col antialiased bg-white items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="fast"
      />
    </div>
  );
}

const testimonials = [
  {
    name: "Charles Dickens",
  },
  {
   name: "William Shakespeare",
   
  },
  {
   name: "Edgar Allan Poe",
  },
  {
   name: "Jane Austen",
  },
  {
   name: "Herman Melville",
  },
];
