"use client"; 

import Image from 'next/image'
import { Lilita_One } from 'next/font/google'
import Link from "next/link";
import Footer from '@/src/components/footer';
import Logo from '@/src/components/logo';
import { useState, useEffect, useMemo } from "react";
import { data } from '@/src/scripts/brawlers';
import Guesses from '@/src/components/guesses';
import Button from '@/src/components/button';
import { useRef } from "react";
import Confetti from "canvas-confetti";
import { useRouter } from 'next/navigation'; 

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })


type BrawlerKey = keyof typeof data;

// Get new brawler for each day
function getDailyIndex(startDateISO = "2026-01-01") {
  const start = new Date(startDateISO);
  const today = new Date();
  start.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return diffDays;
}

// Get today's date
function getTodayKey() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0, 10);
}

function hashStringToInt(str: string) {
  let h = 2166136261; // FNV-1a-ish
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0; // unsigned
}

// Mulberry32 PRNG (small + good enough for games)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDailyRandomIndex(total: number, dateKey = getTodayKey()) {
  const seed = hashStringToInt(dateKey);
  const rand = mulberry32(seed);
  return Math.floor(rand() * total);
}

type Brawler = {
  key: string;
  name: string;
  rarity: string;
  class: string;
  gender: string;
  released: number;
};

type CellState = "correct" | "wrong";

type GuessRow = {
  brawler: { value: string; state: CellState };
  gender: { value: string; state: CellState };
  class: { value: string; state: CellState };
  rarity: { value: string; state: CellState };
  release: { value: string; state: CellState };
  animate?: boolean;
};

// Makes names readable
function toDisplayName(key: string) {
  return key
    .split(" ")
    .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Makes all brawlers into brawler type
function getAllBrawlers(): Brawler[] {
  return Object.entries(data).map(([key, v]) => ({
    key,
    name: toDisplayName(key),
    rarity: v.rarity,
    class: v.class,
    gender: v.gender,
    released: Number(v.released),
  }));
}


function judgeGuess(guess: Brawler, answer: Brawler): GuessRow {
  return {
    brawler: { value: guess.name, state: guess.key === answer.key ? "correct" : "wrong" },
    gender: { value: guess.gender, state: guess.gender === answer.gender ? "correct" : "wrong" },
    class: { value: guess.class, state: guess.class === answer.class ? "correct" : "wrong" },
    rarity: { value: guess.rarity, state: guess.rarity === answer.rarity ? "correct" : "wrong" },
    release: { value: String(guess.released), state: guess.released === answer.released ? "correct" : "wrong" },
  };
}

export default function GuessPage() {
  const all = useMemo(() => getAllBrawlers(), []);
  const answer = useMemo(() => {
    const idx = getDailyRandomIndex(all.length, "2026-01-01");
    return all[idx];
  }, [all]);

  console.log(answer);

  const diffDays = getDailyIndex("2026-01-01");

  const storageKey = useMemo(() => `brawlstardle:${getTodayKey()}`, []);
  const [guessKeys, setGuessKeys] = useState<string[]>([]);
  const [rows, setRows] = useState<GuessRow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"playing" | "won">("playing");

  const router = useRouter();

  const homeButton = () => {
    router.push('/');
  }

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setGuessKeys(parsed);
    } catch {}
  }, [storageKey]);

  // rebuild rows when guesses load/change
  useEffect(() => {
    const guessed = guessKeys
      .map(k => all.find(b => b.key === k))
      .filter(Boolean) as Brawler[];

    const newRows = guessed.map((g, idx) => ({
      ...judgeGuess(g, answer),
      animate: idx === guessed.length - 1, 
    }));

    setRows(newRows);

    if (guessed.some(g => g.key === answer.key)) {
      setStatus("won"); 
      HandleConfetti(); 
    } else setStatus("playing");
  }, [guessKeys, all, answer]);

  // persist
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(guessKeys));
  }, [guessKeys, storageKey]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all
      .filter(b => b.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, all]);

  function submitGuess(b: Brawler) {
    if (status !== "playing") return;
    if (guessKeys.includes(b.key)) return;
    setGuessKeys(prev => [...prev, b.key]);
    setQuery("");
  }

  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "won" && statsRef.current) {
      setTimeout(() => {
        statsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }, [status]);

  const HandleConfetti = () => {
    Confetti({
      particleCount: 100,
      angle: 60,
      spread: 55, 
      origin: {x: 0, y: 0.6},
    }); 
    Confetti({
      particleCount: 100,
      angle: 120,
      spread: 55, 
      origin: {x: 1, y: 0.6},
    });
  };

  function tileEmoji(state: CellState) {
    return state === "correct" ? "🟩" : "🟥";
  }

  function buildShareText() {
    const header = `I got the BrawlStardle ${diffDays} in ${guessKeys.length} tries!`;

    const grid = rows
      .map(r => [
        tileEmoji(r.brawler.state),
        tileEmoji(r.gender.state),
        tileEmoji(r.class.state),
        tileEmoji(r.rarity.state),
        tileEmoji(r.release.state),
      ].join(""))
      .join("\n");

    return `${header}\n${grid}`;
  }

  async function handleShare() {
    const text = buildShareText();

    try {
      await navigator.clipboard.writeText(text);
      // optional: show a toast / alert
      alert("Copied results to clipboard!");
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Copied results to clipboard!");
    }
  }

  return (
    <main> 
      <Logo />

      <div className="relative flex flex-col justify-center mt-[10px]">
        <img alt="" src="guess_input.svg" className="w-[38%] mx-auto"></img>
        <div className="w-[40%] absolute top-[12%] left-[30%] right-[30%]">
            <h1 className={`${lilita.className} info-heading text-center`}>
                GUESS THE BRAWLER #{diffDays}
            </h1>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("submitted", { query, suggestions: suggestions.map(s => s.name) });
          if (suggestions[0]) submitGuess(suggestions[0]);
        }}>
          <div className="absolute top-[63%] left-[33%] right-[66%]"> 
            <input type="text" disabled={status === "won"} value={query} onChange={e => setQuery(e.target.value)} className={`${lilita.className} info-paragraph rounded-lg transform skew-x-[-5deg] w-[360px] h-[30px] bg-[#2A3045] border border-none p-[10px] rounded-[10px]`}></input>
          </div> 
          {suggestions.length > 0 && (
            <div className="absolute top-[80%] left-[33%] w-[360px] bg-[#151a2b] border border-slate-700 rounded-lg overflow-hidden z-10">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  className="block w-full text-left px-3 py-2 hover:bg-slate-700/50 w-[100px]"
                  onClick={() => submitGuess(s)}
                  disabled={status === "won"}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
          <button type="submit" disabled={status === "won"} className="hover:scale-105 transition-transform duration-100 bg-transparent border border-none absolute top-[63%] left-[62%] cursor-pointer">
            <img alt="" src="arrow.svg" className="w-[45px] mx-auto mt-[5px]"></img>
          </button>
        </form>

      </div> 


      <div className="ml-[250px] mr-[250px] grid grid-cols-5 gap-6">
        <h1 className={`${lilita.className} info-heading underline decoration-[#FFFFFF] text-center mt-[30px] mb-[10px]`}>
          Brawler
        </h1>
        <h1 className={`${lilita.className} info-heading underline decoration-[#FFFFFF] text-center mt-[30px] mb-[10px]`}>
          Gender
        </h1>
        <h1 className={`${lilita.className} info-heading underline decoration-[#FFFFFF] text-center mt-[30px] mb-[10px]`}>
          Class
        </h1>
        <h1 className={`${lilita.className} info-heading underline decoration-[#FFFFFF] text-center mt-[30px] mb-[10px]`}>
          Rarity
        </h1>
        <h1 className={`${lilita.className} info-heading underline decoration-[#FFFFFF] text-center mt-[30px] mb-[10px]`}>
          Release
        </h1>
      </div>

      <div className="ml-[250px] mr-[250px] mt-4 space-y-10">
        {[...rows].reverse().map((r, i) => {
          const guessKey = guessKeys[guessKeys.length - 1 - i]; 
          return (
            <div key={guessKey} className="grid grid-cols-5 gap-6 place-items-center">
              <Guesses state={r.brawler.state} delayMs={0} animate={!!r.animate}>
                <h2 className={`${lilita.className} info-heading`}>{r.brawler.value}</h2>
              </Guesses>

              <Guesses state={r.gender.state} delayMs={150} animate={!!r.animate}>
                <h2 className={`${lilita.className} info-heading`}>{r.gender.value}</h2>
              </Guesses>

              <Guesses state={r.class.state} delayMs={300} animate={!!r.animate}>
                <h2 className={`${lilita.className} info-heading`}>{r.class.value}</h2>
              </Guesses>

              <Guesses state={r.rarity.state} delayMs={450} animate={!!r.animate}>
                <h2 className={`${lilita.className} info-heading`}>{r.rarity.value}</h2>
              </Guesses>

              <Guesses state={r.release.state} delayMs={600} animate={!!r.animate}>
                <h2 className={`${lilita.className} info-heading`}>{r.release.value}</h2>
              </Guesses>
            </div>
          );
        })}
      </div>

      {status === "won" && (
        <div ref={statsRef} className="scroll-mt-20">
          <div className="relative flex flex-col justify-center mt-[10px]">
            <img alt="" src="stats.svg" className="w-[75%] mx-auto mt-[20px]"></img>
            <div className="flex flex-row justify-center absolute top-[8%] left-[0] right-[0]">
              <img alt="" src="/brawler_gifs/bo_win.gif"></img> 
              <div className="relative">
                <h1 className={`${lilita.className} info-heading !text-[#FFE35B] -rotate-1`}>
                  TODAY&apos;S BRAWLER!
                </h1>
                <img alt="" src="namecard.svg"></img> 
                <div className="absolute top-[0%] left-[5%] -rotate-2 w-[75%]">
                  <h1 className={`${lilita.className} info-heading !text-[90px] !mb-[0px]`}>{answer.name.toUpperCase()}</h1>
                  <h1 className={`${lilita.className} info-heading !text-[30px] !mt-[0px] !mb-[0px]`}>{answer.class.toUpperCase()}</h1>
                  <h1 className={`${lilita.className} info-heading !text-[30px] !mt-[0px] text-right`}>TRIES: {guessKeys.length}</h1> 
                </div> 
              </div> 
            </div>
            <div className="flex justify-center absolute top-[43%] left-[0] right-[0]"> 
              <h1 className={`${lilita.className} info-heading`}>STATS</h1> 
            </div> 
            <div className="absolute top-[50%] left-[20%] right-[20%] grid grid-cols-4 place-items-center">
              <h1 className={`${lilita.className} info-heading text-center`}>GAMES<br></br><span className="underline decoration-[#FFFFFF]"> WON</span> </h1>
              <h1 className={`${lilita.className} info-heading text-center`}>AVERAGE<br></br><span className="underline decoration-[#FFFFFF]"> GUESSES</span></h1> 
              <h1 className={`${lilita.className} info-heading text-center`}>CURRENT<br></br><span className="underline decoration-[#FFFFFF]"> STREAK</span></h1> 
              <h1 className={`${lilita.className} info-heading text-center`}>HIGHEST<br></br><span className="underline decoration-[#FFFFFF]"> STREAK</span></h1>
              <h1 className={`${lilita.className} info-heading text-center`}>1</h1> 
              <h1 className={`${lilita.className} info-heading text-center`}>1</h1> 
              <h1 className={`${lilita.className} info-heading text-center`}>1</h1> 
              <h1 className={`${lilita.className} info-heading text-center`}>1</h1> 
            </div> 
            <div className="absolute top-[83%] left-[0] right-[0]"> 
              <Button onClick={() => handleShare()} imgSrc="blue_button.svg" altText="Share"></Button>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-[20px] mt-[30px] mb-[50px]">
            <Button onClick={() => homeButton()} imgSrc="blue_button.svg" altText="Home"></Button>
            <Button onClick={() => homeButton()} imgSrc="yellow_button.svg" altText="Next"></Button>
          </div> 
        </div>
      )}

    </main>
  )  
}
