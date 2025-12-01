import Link from "next/link";
import { Lilita_One } from 'next/font/google';

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })

export default function LandingButton({ linkName, imgSrc, altText }: { linkName: string; imgSrc: string; altText: string }) {
  return (
    <div className="hover:scale-105 transition-transform duration-100">
        <Link href={linkName}>
            <div className="w-[200px] absolute top-0 left-0 right-0 mt-[50px] ml-[300px] mr-[200px] text-center">
                <h1 className={lilita.className} style={{
                    color: "white",
                    WebkitTextStrokeWidth: "6px",
                    WebkitTextStrokeColor: "black",
                    paintOrder: "stroke fill",
                    textShadow: "2px 8px 4px rgba(0, 0, 0, 0.6)",
                    fontSize: "30px",
                    paddingLeft: "20px"
                    }}
                >
                    {altText}
                </h1>
            </div>
            <img className="w-[90%]" src={imgSrc} alt={altText}/>
        </Link>
    </div>  
  );
}