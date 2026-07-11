"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

interface FooterProps {
  locale: "en" | "am";
}

export default function Footer({ locale }: FooterProps) {
  const isAm = locale === "am";

  return (
    <footer className="bg-wine-dark text-white relative">
      {/* Decorative Ethiopian line */}
      <div className="eth-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber/30">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-amber-light">
                  {isAm ? "ማኅበረ ሥላሴ" : "Mahibere Silassie"}
                </div>
                <div className="text-[10px] text-white/40">
                  {isAm ? "መንፈሳዊ ማኅበር" : "Spiritual Association"}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              {isAm
                ? "የሰበታ ዋታ ምዕራፈ ቅዱሳን ቅድስት ሥላሴ ወአቡነ አረጋዊ በዐታ ለማርያም ቤተ ክርስቲያንን ለመደገፍ የተቋቋመ መንፈሳዊ ማኅበር።"
                : "A spiritual association established to support the Sebeta Wata Mi'irafe Kidusan Kidist Silassie We'Abune Aregawi Be'ata LeMariam Church."}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber/60">
              <Heart className="w-3 h-3" />
              <span>{isAm ? "በእምነት አንድ ሆነን" : "United in faith"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-amber-light mb-5 text-sm uppercase tracking-wider">
              {isAm ? "ፈጣን አገናኞች" : "Quick Links"}
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <a href="/" className="hover:text-amber-light transition inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber/40" />
                  {isAm ? "መነሻ ገጽ" : "Home"}
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-amber-light transition inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber/40" />
                  {isAm ? "ዝግጅቶች" : "Events & Calendar"}
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-amber-light transition inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber/40" />
                  {isAm ? "አባል ይሁኑ" : "Become a Member"}
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-amber-light transition inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber/40" />
                  {isAm ? "የአባላት መግቢያ" : "Member Login"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-amber-light mb-5 text-sm uppercase tracking-wider">
              {isAm ? "አድራሻ" : "Contact Us"}
            </h3>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-light mt-0.5 flex-shrink-0" />
                <span>
                  {isAm
                    ? "ሰበታ ዋታ፣ ኦሮሚያ ክልል፣ ኢትዮጵያ"
                    : "Sebeta Wata, Oromia Region, Ethiopia"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-light flex-shrink-0" />
                info@mahiberesilassie.org
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-light flex-shrink-0" />
                +251-11-123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <p>
              © {new Date().getFullYear()}{" "}
              {isAm ? "ማኅበረ ሥላሴ" : "Mahibere Silassie"} —{" "}
              {isAm ? "መብቱ በሕግ የተጠበቀ ነው" : "All rights reserved"}
            </p>
            <p>
              {isAm
                ? "የሰበታ ዋታ ቅድስት ሥላሴ ቤተ ክርስቲያን"
                : "Sebeta Wata Kidist Silassie Church"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
