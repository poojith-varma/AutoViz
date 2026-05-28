import {
  Moon,
  Sun,
} from "lucide-react";

type Props = {
  darkMode: boolean;

  setDarkMode:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
};

export default function ThemeToggle({
  darkMode,
  setDarkMode,
}: Props) {

  return (
    <button
      onClick={() =>
        setDarkMode(
          !darkMode
        )
      }
      className="fixed top-6 right-6 z-50 bg-slate-800 text-white p-4 rounded-2xl shadow-xl border border-slate-700 hover:scale-105 transition"
    >
      {darkMode ? (
        <Sun size={22} />
      ) : (
        <Moon size={22} />
      )}
    </button>
  );
}