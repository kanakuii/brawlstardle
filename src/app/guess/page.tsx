import Image from 'next/image'
import { Lilita_One } from 'next/font/google'
import Link from "next/link";
import Footer from '@/src/components/footer';
import Logo from '@/src/components/logo';

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })

export default function GuessPage() {
  return (
    <main>
      <Logo />

    </main>
  )

  
}
