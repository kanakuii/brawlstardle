type CellState = "correct" | "wrong" | "higher" | "lower";

export default function Guesses({
  children,
  state,
  delayMs,
  animate,
}: {
  children: React.ReactNode;
  state: CellState;
  delayMs: number;
  animate: boolean;
}) {
  const finalColor = state === "correct" ? "#34eb40" : "#db2727";

  return (
    <div
      className={[
        "text-center border w-[160px] h-[120px] flex justify-center items-center mt-[10px]",
        "border-[#000000] border-[5px] shadow-[5px_5px_2px_rgba(0,0,0,0.5)]",
        animate ? "tile-flip" : "",
      ].join(" ")}
      style={{
        animationDelay: `${delayMs}ms`,
        backgroundColor: animate ? "#1b2a57" : finalColor,
        ["--tile-color" as any]: finalColor,
      }}
    >
      { 
        state === "higher" ? (
          <img src="/up_arrow.png" className={["absolute inset-0 top-[1/2] left-[1/2] z-0 h-[100px] w-[110px]", animate ? "opacity-0 show-image" : "" ].join(" ")} style={{animationDelay: `${delayMs}ms`}}/>
        ) : state === "lower" ? (
          <img src="/down_arrow.png" className={["absolute inset-0 top-[1/2] left-[1/2] z-0 h-[100px] w-[110px]", animate ? "opacity-0 show-image" : "" ].join(" ")} style={{animationDelay: `${delayMs}ms`}}/>
        ) : null 
      }

      {children} 
    </div>
  );
}
