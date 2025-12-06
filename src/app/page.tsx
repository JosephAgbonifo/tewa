import { Trending } from "@/components/general/headermarquee";
import Hero from "@/components/home/hero";
import Tewa from "@/components/home/main";
import { TrendingUp } from "lucide-react";

export default function Home(){
  return <div>
    <Hero />
        <div className="flex items-center justify-center gap-1 py-2 bg-white sticky mx-3 md:mx-0 text-xs">
            <div className="w-60 md:w-20">Trending <TrendingUp className="inline pl-2 text-gold" /></div>
            <Trending />
        </div>
        <hr className="w-4/5 m-auto mb-10"/>
    <Tewa />
  </div>
}