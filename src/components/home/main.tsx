import Centre from "./centre";
import Left from "./left";
import Right from "./right";

export default function Tewa(){
    return <div className="md:flex m-auto w-4/5">
        <div className="md:w-1/4 md:border-r border-tewa-black">
        <Left />
        </div>
        <div className="md:w-1/2">
        <Centre />
        </div>
        <div className="md:w-1/4 md:border-l border-tewa-black">
        <Right />
        </div>
    </div>
}