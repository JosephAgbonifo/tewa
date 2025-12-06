import Image from "next/image";

export default function Centre(){
    return <div className="md:p-5">
        <Image 
  src="/twhite.jpg"
  width={1200}
  height={600}
  alt="poster"
  className="w-full max-h-[500px] object-cover rounded"
/>

        <h2 className="font-playfair text-gold-dark text-2xl font-bold md:py-2">TEWA Launches Today, Celebrated in 30 different countries</h2>
        <p className="font-lora">
         Tewa Launches in Nigeria, India, USA, England and 26 other countries today, creating a new era of women empowerment, a world that doesn&apos;t hate man but fights to accommodate women.
         Tewa is not just a movement, it is a ...
         <i className="block">By Julia Morgan</i>
        </p>


        <div className="border-l rounded border-tewa-black">

</div>

      
    </div>
}