"use client"; 
import { Lilita_One } from 'next/font/google'
import LandingButton from '@/src/components/landingButton';
import Footer from '@/src/components/footer';
import Logo from '@/src/components/logo';

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })

export default function LandingPage() {
  return (
    <main>
      <div>
        <Logo />

        <div>
          <div className="absolute top-0 ml-[120px]">
              <img alt="" className="w-[55%]" src="/checkmark.png"></img>
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
          <div className="grid grid-cols-2 gap-y-[20px] place-items-center">
            <LandingButton linkName="/guess" imgSrc="/brawler_button.png" altText="GUESS THE BRAWLER"></LandingButton>
            <LandingButton linkName="/guess" imgSrc="/skills_button.png" altText="GUESS THE SKILLS"></LandingButton>
            <LandingButton linkName="/guess" imgSrc="/skins_button.png" altText="GUESS THE SKINS"></LandingButton>
            <LandingButton linkName="/guess" imgSrc="/voicelines_button.png" altText="GUESS THE VOICELINES"></LandingButton>
          </div>
        </div>

        <Footer />

      </div>
    </main>
  )

  
}
