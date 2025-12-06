import Image from "next/image"
import Link from "next/link"

export default function Left(){
    const recent = [{
        href:"/lola_akinola_won_the_2024_presidential_election",
        title:"Lola Akinola won the 2024 presidential election, beats all opposition"
    }, {
        href:"/lola_akinola_won_the_2024_presidential_election",
        title:"Janet Akinson won the WWE Wrestler of the year, becoming the first woman to win such an award"
    }, {
        href:"/lola_akinola_won_the_2024_presidential_election",
        title:"How I went from a bread seller to the CEO of a multi-billion dollar company - Clara Saunders"
    }, {
        href:"/lola_akinola_won_the_2024_presidential_election",
        title:"'Become the woman of your dream' launches today, get a free copy of the book"
    }, {
        href:"/lola_akinola_won_the_2024_presidential_election",
        title:"Controlling the 'men's world'"
    }, {
        href:"/lola_akinola_won_the_2024_presidential_election",
        title:"First female Nigerian to win the Nobel Prize in Literature, Bola Sunkanmi"
    }]
    return <div className="md:pr-5">
        <h2 className="font-playfair text-gold-dark text-lg font-bold">Recent</h2>

        {recent.map((item, index) => {
            return <div key={index} className="flex flex-col gap-2">
                <Link href={item.href} className="text-sm font-inter hover:underline hover:text-purple transition-all duration-300 p-1 before:content-['•'] before:text-purple before:pr-1">{item.title}</Link>
            </div>
        })}

<div className="hidden md:flex flex-col items-center justify-center mt-5">
            <div className="flex-1">
            <h2 className="font-playfair text-gold-dark text-xs ">money</h2>
            <Image src={"/twhite.jpg"} width={500} height={500} alt="logo" className="m-auto mt-5 aspect-2/1 object-cover object-center" />
        <h2 className="font-playfair text-gold-dark font-bold md:py-2">TEWA Launches Today, Celebrated in 30 different countries</h2>
        <p className="font-lora text-sm">
         Tewa Launches in Nigeria, India, USA, England and 26 other countries today, creating a new era of women ...
         <i className="block">By Julia Morgan</i>
        </p>
            </div>
            <div className="flex-1 ">
            <h2 className="font-playfair text-gold-dark text-xs ">innovation</h2>
            <Image src={"/twhite.jpg"} width={500} height={500} alt="logo" className="m-auto mt-5 aspect-2/1 object-cover object-center" />
        <h2 className="font-playfair text-gold-dark font-bold md:py-2">TEWA Launches Today, Celebrated in 30 different countries</h2>
        <p className="font-lora text-sm">
         Tewa Launches in Nigeria, India, USA, England and 26 other countries today, creating a new era of women ...
         <i className="block">By Julia Morgan</i>
        </p>
            </div>
        </div>



    </div>
}
