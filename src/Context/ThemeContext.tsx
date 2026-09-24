import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { darkColors, darkSubjectColors, darkTagColors, lightColors, lightSubjectColors, lightTagColors, SubjectColorSet, TagColorSet, Theme } from "../Theme/colors";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";




const DARK_MODE_STORAGE_KEY = "lsync:darkMode";

export type ThemeContextType = {
  isDark: boolean;
  colors: Theme;
  subjectColors: Record<"purple" | "green" | "blue" | "orange" | "red",
  SubjectColorSet>;
  
  tagColors: Record<"Urgent" | "Exam" | "Done" | "Medium" | "Normal" | "Later", 
  TagColorSet>;
  
  setDarkMode: (value: boolean) => void;
  
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  subjectColors: lightSubjectColors,
  tagColors: lightTagColors,
  setDarkMode: ()=>{},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({children}: {children: ReactNode}) =>{
  const {setColorScheme} = useColorScheme();
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    AsyncStorage.getItem(DARK_MODE_STORAGE_KEY).then((stored) => {
      if (stored === "true"){
        setIsDark(true);
        setColorScheme("dark")
      }
    });
  }, [setColorScheme])

  const setDarkMode = (value: boolean) => {
    setIsDark(value);
    setColorScheme(value ? "dark" : "light");
    AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, value ? "true" : "false");
  }

  return (
    <ThemeContext.Provider value={{
      isDark,
      colors: isDark ? darkColors : lightColors,
      subjectColors: isDark ? darkSubjectColors : lightSubjectColors,
      tagColors: isDark ? darkTagColors : lightTagColors,
      setDarkMode,
    }}>{children}</ThemeContext.Provider>
  )
}

export default ThemeProvider
