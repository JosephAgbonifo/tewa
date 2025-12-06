"use client"
import { Search} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import HeaderBar from "./bar"


export default function Header(){

    const [search, setSearch] = useState(false)

   return  <div className="bg-tewa-black/10 text-tewa-black ">
        <div className="flex justify-between bg-tewa-black/5 z-99 backdrop-blur-md border-b border-gold-dark px-10 py-5 items-center fixed w-full h-20">
            <Image src="/tewa.png" alt="tewa logo" width={200} height={100} unoptimized className=" object-center"/>
            <div className={`flex items-center ${search? "justify-center" : "justify-end"} transition-all duration-300 w-60`}>
                <button className="w-10 flex items-center justify-center" onClick={() => setSearch(!search)}><Search /></button>
                 <input type="text" placeholder="Search" className={`border border-tewa-black rounded-md ${search ? "w-52 p-1" : "w-0 p-0"} transition-all  duration-300 text-xs outline-0`}/>
            </div>
        </div>
        
        <HeaderBar />
    </div>
}
