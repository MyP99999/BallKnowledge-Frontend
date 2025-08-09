const ringBg = (pct) =>
  `conic-gradient(#f59e0b ${pct}%, rgba(255,255,255,0.10) 0)`;

export function LivesPill({ lives, maxLives, pct, onWatchAd }) {
  const isFull = lives >= maxLives;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/40">
      {/* Progress ring */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isFull ? "rgba(255,255,255,0.10)" : ringBg(pct),
          }}
        />
        <div className="absolute inset-[3px] rounded-full bg-green-950 flex items-center justify-center text-[14px]">
          ❤️
        </div>
      </div>
      <div className="text-white text-sm font-bold tabular-nums">
        {lives}/{maxLives}
      </div>
      {!isFull && (
        <button
          onClick={onWatchAd}
          className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black 
                     flex items-center justify-center shadow-md transition"
        >
          🎥
        </button>
      )}
    </div>
  );
}
