// src/components/Tooltip.jsx
export default function Tooltip({ text, children }) {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 
                      bg-black text-white text-xs rounded px-2 py-1 
                      opacity-0 group-hover:opacity-100 transition duration-200
                      whitespace-nowrap z-[9999]">
        {text}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 
                        w-0 h-0 border-l-4 border-l-transparent 
                        border-r-4 border-r-transparent border-t-4 border-t-black" />
      </div>
    </div>
  );
}
