import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "AI Travel Planner | Plan Your Dream Trip",
  description:
    "Generate personalized 3-day travel itineraries powered by Gemini AI. Enter a destination and travel style to get started.",
  keywords: ["travel", "AI", "itinerary", "planner", "Gemini"],
};

export const viewport = {
  themeColor: "#0d0020",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
