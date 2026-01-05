"use client"; 

import Image from 'next/image'
import { Lilita_One } from 'next/font/google'
import Link from "next/link";
import Footer from '@/src/components/footer';
import Logo from '@/src/components/logo';
import { useState, useEffect, useMemo } from "react";
import { data } from '@/src/scripts/brawlers';
import Guesses from '@/src/components/guesses';
import ConfettiEffect from '@/src/components/confetti';

const lilita = Lilita_One({ weight: '400', subsets: ['latin'] })


export type BrawlerKey = keyof typeof data;

export function getDailyIndex(total: number, startDateISO = "2026-01-01") {
  const start = new Date(startDateISO);
  const today = new Date();
  start.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return ((diffDays % total) + total) % total;
}

export function getTodayKey() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0, 10);
}

export type Brawler = {
  key: string;
  name: string;
  rarity: string;
  class: string;
  gender: string;
  released: number;
};

export type CellState = "correct" | "wrong" | "higher" | "lower";

export type GuessRow = {
  brawler: { value: string; state: CellState };
  gender: { value: string; state: CellState };
  class: { value: string; state: CellState };
  rarity: { value: string; state: CellState };
  release: { value: string; state: CellState };
  animate?: boolean;
};

export function toDisplayName(key: string) {
  // keep special chars but Title Case words
  return key
    .split(" ")
    .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function getAllBrawlers(): Brawler[] {
  return Object.entries(data).map(([key, v]) => ({
    key,
    name: toDisplayName(key),
    rarity: v.rarity,
    class: v.class,
    gender: v.gender,
    released: Number(v.released),
  }));
}

export function judgeGuess(guess: Brawler, answer: Brawler): GuessRow {
  return {
    brawler: { value: guess.name, state: guess.key === answer.key ? "correct" : "wrong" },
    gender: { value: guess.gender, state: guess.gender === answer.gender ? "correct" : "wrong" },
    class: { value: guess.class, state: guess.class === answer.class ? "correct" : "wrong" },
    rarity: { value: guess.rarity, state: guess.rarity === answer.rarity ? "correct" : "wrong" },
    release: { value: String(guess.released), state: guess.released === answer.released ? "correct" : "wrong" },
  };
}

function cellClasses(state: CellState) {
  if (state === "correct") return "!bg-[#34eb40]";
  return "!bg-[#db2727]";
}

export default function GuessPage() {
  const [isExploding, setIsExploding] = useState(false)
  const all = useMemo(() => getAllBrawlers(), []);
  const answer = useMemo(() => {
    const idx = getDailyIndex(all.length, "2026-01-01");
    return all[idx];
  }, [all]);

  const storageKey = useMemo(() => `brawlwordle:${getTodayKey()}`, []);
  const [guessKeys, setGuessKeys] = useState<string[]>([]);
  const [rows, setRows] = useState<GuessRow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"playing" | "won">("playing");

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
      animate: idx === guessed.length - 1, // only newest row flips
    }));

    setRows(newRows);

    if (guessed.some(g => g.key === answer.key)) {
      setStatus("won"); 
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 5000);
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

  return (
    <main>
      <Logo />

      <div className="relative flex flex-col justify-center mt-[10px]">
        <img src="guess_input.svg" className="w-[38%] mx-auto"></img>
        <div className="w-[40%] absolute top-[12%] left-[30%]">
            <h1 className={`${lilita.className} info-heading text-center`}>
                GUESS THE BRAWLER #1
            </h1>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("submitted", { query, suggestions: suggestions.map(s => s.name) });
          if (suggestions[0]) submitGuess(suggestions[0]);
        }}>
          <div className="absolute top-[63%] left-[33%]"> 
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
            <img src="arrow.svg" className="w-[45px] mx-auto mt-[5px]"></img>
          </button>
        </form>

      </div> 


      <div className="ml-[250px] mr-[250px] grid grid-cols-5 gap-6">
        <h1 className={`${lilita.className} info-heading text-center mt-[30px] mb-[10px]`}>
          Brawler
        </h1>
        <h1 className={`${lilita.className} info-heading text-center mt-[30px] mb-[10px]`}>
          Gender
        </h1>
        <h1 className={`${lilita.className} info-heading text-center mt-[30px] mb-[10px]`}>
          Class
        </h1>
        <h1 className={`${lilita.className} info-heading text-center mt-[30px] mb-[10px]`}>
          Rarity
        </h1>
        <h1 className={`${lilita.className} info-heading text-center mt-[30px] mb-[10px]`}>
          Release
        </h1>
      </div>

      <div className="ml-[250px] mr-[250px] mt-4 space-y-10">
        {[...rows].reverse().map((r, i) => (
          <div key={i} className="grid grid-cols-5 gap-6 place-items-center">
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
        ))}
      </div>

      {isExploding && <ConfettiEffect />}

      {status === "won" && (
        <div className="mt-6 text-white text-xl">
          You got it! ✅ The answer was {answer.name}.
        </div>
      )}



    </main>
  )  
}
