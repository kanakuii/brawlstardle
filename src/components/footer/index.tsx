"use client";
import { useState } from "react";
import { Lilita_One } from 'next/font/google'
import Button from '@/src/components/button'

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })


export default function Footer() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div> 
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-3 mt-[20px] mb-[20px] gap-[30px]">
                <a href="https://github.com/kanakuii/brawlstardle">
                    <img alt="" className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Github.svg"></img>
                </a>
                <button className="bg-transparent border border-transparent" onClick={() => setShowInfo(true)}>
                    <img alt="" className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Info.svg"></img>
                </button>
                <img alt="" className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Share.svg"></img>
                </div>
            </div>

            {showInfo && (
            <div 
                style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                }}
            >
                <div style={{
                backgroundColor: '#2B295A',
                color: 'white',
                padding: '40px',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80%',
                overflowY: 'auto'
                }}>
                <div className='flex justify-between'> 
                    <h1 className={`${lilita.className} info-heading`}>
                    About BrawlStardle
                    </h1>
                    <h1 className={`text-[#D32F2F] ${lilita.className} info-heading hover:scale-110 transition-transform duration-100`} onClick={() => setShowInfo(false)}>X</h1> 
                </div> 
                <hr></hr>
                <p className={`${lilita.className} info-paragraph`}>
                    Brawlstardle is a guessing game based on the mobile game Brawl Stars. Puzzles reset daily and you can
                    build a streak by playing consecutive days. Share your results and compete with friends!
                </p>

                <h1 className={`${lilita.className} info-heading`}>
                    Game Modes
                </h1>
                <hr></hr>
                <p className={`${lilita.className} info-paragraph`}>
                    <span className="text-[#FFE35B]">Brawlers:</span> Guess the brawler based on their rarity, class, and release date. 
                </p>
                <p className={`${lilita.className} info-paragraph`}>
                    <span className="text-[#FFE35B]">Skills:</span> Guess what skill belongs to which brawler based on the pixelated image.
                </p>
                <p className={`${lilita.className} info-paragraph`}>
                    <span className="text-[#FFE35B]">Skin:</span> Guess the skin name based on the image given.
                </p>
                <p className={`${lilita.className} info-paragraph`}>
                    <span className="text-[#FFE35B]">Voicelines:</span> Match the voiceline to the correct brawler. 
                </p>

                <h1 className={`${lilita.className} info-heading`}>Credits</h1>
                <hr></hr>
                <p className={`${lilita.className} info-paragraph`}>
                    This game was inspired by Wordle and Valdle and used assets from the Supercell Fan Kit.
                    BrawlStardle is unofficial and is not endorsed by Supercell. 
                </p> 
                <p className={`${lilita.className} info-paragraph`}>For more information, see &nbsp;
                    <a href="https://www.supercell.com/fan-content-policy"><span className="text-[#FFE35B]">Supercell's Fan Content Policy</span></a>
                </p>


                <Button onClick={() => setShowInfo(false)} imgSrc="blue_button.svg" altText="Close"></Button>
                </div>
            </div>
            )}
        </div> 
    );
}