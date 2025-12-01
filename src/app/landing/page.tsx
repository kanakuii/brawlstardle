"use client"; 
import { Lilita_One } from 'next/font/google'
import LandingButton from '@/src/components/landingButton';
import Footer from '@/src/components/footer';
import Logo from '@/src/components/logo';
import { useState } from "react";

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })

export default function LandingPage() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main>
      <div>
        <Logo />

        <div>
          <div className="absolute top-0 ml-[120px]">
              <img className="w-[55%]" src="/checkmark.png"></img>
          </div>
          <div className="flex justify-center">
            <div className="bg-[#2A1177] w-[85%] mt-[13px]">
              <p className={`${lilita.className} ml-[90px] text-[20px] info-heading`}>
                GUESSING GAMES BASED ON BRAWL STARS
              </p>
            </div>
          </div>
        </div> 

        <div className="flex items-center mt-[20px] ml-[150px] mr-[100px]">
          <div className="grid grid-cols-2 gap-y-[20px]">
            <LandingButton linkName="/guess" imgSrc="/brawler_button.png" altText="GUESS THE BRAWLER"></LandingButton>
            <LandingButton linkName="/guess" imgSrc="/skills_button.png" altText="GUESS THE SKILLS"></LandingButton>
            <LandingButton linkName="/guess" imgSrc="/skins_button.png" altText="GUESS THE SKINS"></LandingButton>
            <LandingButton linkName="/guess" imgSrc="/voicelines_button.png" altText="GUESS THE VOICELINES"></LandingButton>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="grid grid-cols-3 mt-[20px] mb-[20px] gap-[30px]">
            <a href="https://github.com/kanakuii/brawlstardle">
                <img className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Github.svg"></img>
            </a>
            <button className="bg-transparent border border-transparent" onClick={() => setShowInfo(true)}>
                <img className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Info.svg"></img>
            </button>
            <img className="hover:scale-105 hover:fill-[#93CEFF] transition-all duration-100 w-[30px]" src="./Share.svg"></img>
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
            <h1 className={`${lilita.className} info-heading`}>
              About BrawlStardle
            </h1>
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
              BrawlStardle is not endorsed or sponsored by Supercell.
            </p>

            <button 
              onClick={() => setShowInfo(false)}
              style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      </div>
    </main>
  )

  
}
