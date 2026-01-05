import { useState } from 'react';
import CellState from '@/src/app/guess/page';

export type state = keyof typeof CellState;

export default function Guesses({ children, state, delayMs, animate, }: {
children: React.ReactNode;
  state: state;
  delayMs: number;
  animate: boolean;
}) {
  const finalColor = state === "correct" ? "#34eb40" : "#db2727";

  return (
    <div
      className={[
        "text-center border w-[150px] h-[150px] flex justify-center items-center mt-[10px]",
        "border-[#000000] border-[5px] shadow-[5px_5px_2px_rgba(0,0,0,0.5)]",
        animate ? "tile-flip" : "",
      ].join(" ")}
      style={{
        animationDelay: `${delayMs}ms`,
        backgroundColor: animate ? "#1b2a57" : finalColor,
        ["--tile-color" as any]: finalColor,
      }}
    >
      {children}
    </div>
  );
}