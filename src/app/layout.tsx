import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ማኅበረ ሥላሴ | Mahibere Silassie — የሰበታ ዋታ ቤተ ክርስቲያን",
  description:
    "ማኅበረ ሥላሴ — የሰበታ ዋታ ምዕራፈ ቅዱሳን ቅድስት ሥላሴ ወአቡነ አረጋዊ በዐታ ለማርያም ቤተ ክርስቲያን ደጋፊ መንፈሳዊ ማኅበር",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-slate antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
