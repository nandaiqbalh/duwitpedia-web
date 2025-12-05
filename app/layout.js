import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider/session-provider";
import { QueryProvider } from "@/components/provider/query-provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});


export const metadata = {
  title: "Duwitpedia - Manage Your Personal Finance",
  description: "Personal finance management application that helps you track income, expenses, and manage budgets with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
