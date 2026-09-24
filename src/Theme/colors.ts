export const lightColors = {
  bg: "#F8FAF9",
  surface: "#FFFFFF",
  border: "#e7e9e5",
  primary: "#1a7a4e",
  accent: "#1a7a4e",
  accentLight: "#4f9b72",
  textPrimary: "#141815",
  textSecondary: "#5c635b",
  textMuted: "#8a9089",
  textBody: "#3e453d",
  textDim: "#8a9089",
  textDark: "#141815",
  white: "#FFFFFF",
  green: "#1a7a4e",
  blue: "#0e7490",
  greenLight: "#4f9b72",
  orange: "#c08a2e",
  red: "#96382a",
  redLight: "#b4503f",
  glassBg: "#ffffff",
  glassBorder: "rgba(19,22,20,0.06)",
  itemBg: "#FFFFFF",
  itemBorder: "rgba(19,22,20,0.06)",
  progressBg: "#edefeb",
  streakToday: "#E8f3eb",
  streakEmpty: "#f1f2ef",
  headerGrad: "#edf4ef",
  quoteStart: "#f1f4f0",
  quoteEnd: "#f8f8f6",
  cardBg: "#ffffff",
  statLabel: "#8a9089",
  tabInactive:"#8a9089",
  chipActive: "#141518",
  chipBorder: "#e7e9e5",
  overlay: "rgba(248,248,246,0.94)",
  placeholder: "#b4bab2",
  disabled:"#c9d3cc",
  hairline:"#f1f2ef",
  fill: "#e6e9e3",
  ink: "#141815",
  onInk: "#ffffff"
};


export type Theme = typeof lightColors;

export const darkColors: Theme = {
  bg: "#101512",
  surface: "#18201b",
  border: "#26302a",
  primary: "#35a96d",
  accent: "#35a96d",
  accentLight: "#7bc79c",
  textPrimary: "#ebf1ec",
  textSecondary: "#a2afa5",
  textMuted:"#7d8a80",
  textBody: "#cbd7ce",
  textDim: "#7d8a80",
  textDark: "#ebf1ec",
  white: "#ffffff",
  green: "#35a96d",
  blue: "#5bc0de",
  greenLight: "#7bc79c",
  orange: "#d9a441",
  red: "#e0725f",
  redLight: "#ee9384",
  glassBg: "#18201b",
  glassBorder: "rgba(235,241,236,0.07)",
  itemBg: "#18201b",
  itemBorder: "rgba(235,241,236,0.07)",
  progressBg: "#232d26",
  streakToday: "#1b3527",
  streakEmpty: "#1d2620",
  headerGrad: "#16241b",
  quoteStart: "#1a231d",
  quoteEnd: "#101512",
  cardBg: "#18201b",
  statLabel: "#7d8a80",
  tabInactive: "#7d8a80",
  chipActive: "#ebf1ec",
  chipBorder: "#26302a",
  overlay: "rgba(16,21,18,0.94)",
  placeholder: "#6b7870",
  disabled: "#2c3a31",
  hairline: "#232d26",
  fill: "#232d26",
  ink: "#ebf1ec",
  onInk: "#101512"
};


export type SubjectColorSet ={
  bg:string;
  border: string;
  text: string;
  sub:string;
}

export const lightSubjectColors: Record<
"purple" | "green" | "blue" | "orange" | "red",
SubjectColorSet
> = {
  purple: {
    bg: "#f1f4f0",
    border: "#7fa98f",
    text: "#2c3a31",
    sub: "#6c7a70",
  },

  green: {
    bg: "#1a7a4e",
    border: "#1a7a4e",
    text: "#ffffff",
    sub: "rgba(255,255,255,0.82",
  },

  blue: {
    bg: "#f1f6f2",
    border: "#7fa98f",
    text: "#2c3a31",
    sub: "#6c7a70",
  },

  orange: {
    bg: "#faf1e1",
    border: "#c08a2a",
    text: "#5e4413",
    sub: "#8a5b12",
  },

  red: {
    bg: "#f7e7e3",
    border: "#96382a",
    text: "#7a2b15",
    sub: "#96382a",
  },
};


export const darkSubjectColors: Record<
"purple" | "green" | "blue" | "orange" | "red",
SubjectColorSet
> = {
  purple: {
    bg: "#1d2620",
    border: "#4f7a61",
    text: "#cbd7ce",
    sub: "#a2afa5",
  },

  green: {
    bg: "#35a96d",
    border: "#35a96d",
    text: "#0f1712",
    sub: "rgba(15,23,18,0.75)",
  },

  blue: {
    bg: "#1d2620",
    border: "#4f7a61",
    text: "#cbd7ce",
    sub: "#a2afa5",
  },

  orange: {
    bg: "#2a2317",
    border: "#d9a441",
    text: "#f2dfb5",
    sub: "#d9a441",
  },

  red: {
    bg: "#2a1d1a",
    border: "#e0725f",
    text: "#f0c4bb",
    sub: "#e0725f",
  },
};


export type TagColorSet = { bg: string; border: string; text: string };

export const lightTagColors: Record<
  "Urgent" | "Exam" | "Done" | "Medium" | "Normal" | "Later",
  TagColorSet
> = {
  Urgent: {
     bg: "#F7E7E3", 
     text: "#96382A",
     border: "transparent" 
  },

  Exam:   { 
    bg: "#FAF1E1", 
    text: "#8A5B12", 
    border: "transparent" 
  },

  Done:   { 
    bg: "#E8F2EB", 
    text: "#14603D", 
    border: "transparent" 
  },

  Medium: { 
    bg: "#FAF1E1", 
    text: "#8A5B12", 
    border: "transparent" 
  },

  Normal: { 
    bg: "#F1F2EF", 
    text: "#5C635B", 
    border: "transparent" 
  },

  Later:  { 
    bg: "#F1F2EF", 
    text: "#5C635B", 
    border: "transparent" 
  },

};

export const darkTagColors: typeof lightTagColors = {
  Urgent: { 
    bg: "#2A1D1A", 
    text: "#EE9384", 
    border: "transparent" 
  },
  
  Exam:   { 
    bg: "#2A2317", 
    text: "#E3BE72", 
    border: "transparent" 
  },
  
  Done:   { 
    bg: "#1B3527", 
    text: "#7BC79C", 
    border: "transparent" 
  },
  
  Medium: { 
    bg: "#2A2317", 
    text: "#E3BE72", 
    border: "transparent" 
  },
  
  Normal: { 
    bg: "#232D26", 
    text: "#A2AFA5", 
    border: "transparent" 
  },
  
  Later:  { 
    bg: "#232D26", 
    text: "#A2AFA5", 
    border: "transparent" 
  },
  
};



export const subjectColors = lightSubjectColors;


export function withOpacity(hex: string, alpha: number): string{
  const normlized = hex.replace("#", "");
  const full = normlized.length === 3 
    ? normlized
        .split("")
        .map((c) => c + c)
        .join("")
    : normlized;
  const bigint = parseInt(full, 16);
  const r =(bigint >> 16) & 255;
  const g =(bigint >> 8) & 255;
  const b =bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}