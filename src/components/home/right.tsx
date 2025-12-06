import Image from "next/image";

export default function Right(){
    return <div className="md:p-5">
        <div>
        <Image src={"/twhite.jpg"} width={500} height={500} alt="logo" className="m-auto mt-5 aspect-2/1 object-cover object-center" />
        <h2 className="font-playfair text-gold-dark font-bold py-2">TEWA Launches Today, Celebrated in 30 different countries</h2>
        <p className="font-lora text-sm">
         Tewa Launches in Nigeria, India, USA, England and 26 other countries today, creating a new era of women ...
         <i className="block">By Julia Morgan</i>
        </p></div>
        <div>
        <Image src={"/twhite.jpg"} width={500} height={500} alt="logo" className="m-auto mt-5 aspect-2/1 object-cover object-center" />
        <h2 className="font-playfair text-gold-dark font-bold py-2">TEWA Launches Today, Celebrated in 30 different countries</h2>
        <p className="font-lora text-sm">
         Tewa Launches in Nigeria, India, USA, England and 26 other countries today, creating a new era of women ...
         <i className="block">By Julia Morgan</i>
        </p></div>
        </div>
}