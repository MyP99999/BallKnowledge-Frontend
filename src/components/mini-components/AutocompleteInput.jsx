import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";

/**
 * AutocompleteInput
 * - value / onChange controlled input
 * - fetchUrl example: "/players/suggestTeam" or "/players/suggestCountry"
 */
export default function AutocompleteInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  fetchUrl,
  minChars = 2,
  maxItems = 8,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = (value || "").trim();
    if (q.length < minChars) {
      setSuggestions([]);
      setShowSug(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(fetchUrl, { params: { q } });
        const list = Array.isArray(res.data) ? res.data : [];
        setSuggestions(list.slice(0, maxItems));
        setShowSug(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setShowSug(false);
        setActiveIndex(-1);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [value, fetchUrl, minChars, maxItems]);

  const pick = (v) => {
    onChange({ target: { name, value: v } });
    setShowSug(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const onKeyDown = (e) => {
    if (!showSug || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) pick(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSug(false);
    }
  };

  return (
    <div className="relative">
      {label && <label className="block text-white text-sm mb-1">{label}</label>}

      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e);
          if (suggestions.length > 0) setShowSug(true);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSug(true)}
        onBlur={() => setTimeout(() => setShowSug(false), 150)}
        placeholder={placeholder}
        className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        autoComplete="off"
      />

      {showSug && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
          {suggestions.map((s, idx) => (
            <button
              key={`${s}-${idx}`}
              type="button"
              onMouseDown={(ev) => ev.preventDefault()} // keep focus for click
              onClick={() => pick(s)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 ${
                idx === activeIndex ? "bg-slate-800" : ""
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
