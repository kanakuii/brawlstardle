import Link from "next/link";
import { Lilita_One } from 'next/font/google';

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })

export default function Button({ onClick, imgSrc, altText }: { onClick: () => void; imgSrc: string; altText: string }) {
  return (
    <div className="hover:scale-105 transition-transform duration-100">
        <div onClick={onClick} className="cursor-pointer flex justify-center items-center relative">
            <img className="w-[200px]" src={imgSrc} alt={altText}/>
            <div className="absolute top-0 left-0 right-0 mt-[-10px]">
                <h1 className={lilita.className} style={{
                    color: "white",
                    WebkitTextStrokeWidth: "6px",
                    WebkitTextStrokeColor: "black",
                    paintOrder: "stroke fill",
                    textShadow: "2px 8px 4px rgba(0, 0, 0, 0.6)",
                    fontSize: "30px",
                    }}
                >
                    {altText}
                </h1>
            </div>
        </div>
    </div>  
  );
}