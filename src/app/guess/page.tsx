import Image from 'next/image'
import { Lilita_One } from 'next/font/google'
import Link from "next/link";
import LandingButton from '@/src/components/landingButton';
import Footer from '@/src/components/footer';
import Logo from '@/src/components/logo';

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })

export default function GuessPage() {
  return (
    <main>
      <Logo />
      
      <div className="flex justify-center">
        <div className="bg-[#2A1177] w-[90%]">
          <h1 className={lilita.className} style={{
              color: "white",
              WebkitTextStrokeWidth: "6px",
              WebkitTextStrokeColor: "black",
              paintOrder: "stroke fill",
              textShadow: "2px 8px 4px rgba(0, 0, 0, 0.6)",
              fontSize: "20px",
              paddingLeft: "20px"
            }}
          >
            heh hey heh
          </h1>
        </div>
      </div> 

      <div className="flex items-center mt-[20px] ml-[100px] mr-[100px]">
        <div className="grid grid-cols-2 gap-y-[20px]">
          <LandingButton linkName="/guess" imgSrc="/brawler_button.png" altText="GUESS THE BRAWLER"></LandingButton>
          <LandingButton linkName="/guess" imgSrc="/skills_button.png" altText="GUESS THE SKILLS"></LandingButton>
          <LandingButton linkName="/guess" imgSrc="/skins_button.png" altText="GUESS THE SKINS"></LandingButton>
          <LandingButton linkName="/guess" imgSrc="/voicelines_button.png" altText="GUESS THE VOICELINES"></LandingButton>
        </div>
      </div>
      
      <Footer />

    </main>
  )

  
}
