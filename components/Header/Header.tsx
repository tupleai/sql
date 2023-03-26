import Link from "next/link";
import Github from "../GitHub";
import { useEffect, useState } from "react";
import ThemeButton from "../ThemeButton";
import { useTheme } from "next-themes";
import { ChatCompletionResponseMessageRoleEnum } from "openai";

export const Header = () => {
  const { resolvedTheme } = useTheme();
  const svgFillColor = resolvedTheme === "dark" ? "#D8D8D8" : "black";
  const btnBgColor =
    resolvedTheme === "dark"
      ? "dark-button-w-gradient-border"
      : "light-button-w-gradient-border";

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between w-full pb-8 px-6">
      <Link href="/" className="flex flex-col">
        <h1 className="font-mono sm:text-xl tracking-tight">Max Swimming </h1>
        <p className="font-mono font-bold text-gray-600">
          Human Language to Apple Health Swimming SQL Translator
        </p>
      </Link>
      <div className="flex items-center gap-3 pt-4">
        <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      </div>
    </header>
  );
};
function useContext(ThemeContext: any): { theme: any } {
  throw new Error("Function not implemented.");
}
