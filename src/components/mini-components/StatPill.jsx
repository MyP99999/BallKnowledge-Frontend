const colorMap = {
  red: "bg-red-500/20 text-red-200",
  yellow: "bg-yellow-500/20 text-yellow-200",
  purple: "bg-purple-500/20 text-purple-200",
};

export function StatPill({ icon, label, value, color = "yellow" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/40">
      <span className={`flex items-center justify-center w-7 h-7 rounded-full ${colorMap[color]} text-base`}>
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-sm font-bold text-white tabular-nums">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-green-300/80">
          {label}
        </div>
      </div>
    </div>
  );
}
