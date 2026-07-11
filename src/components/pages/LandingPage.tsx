"use client";

import { useApp } from "@/components/ClientShell";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Heart,
  BookOpen,
  GraduationCap,
  Calendar,
  Bell,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  HandHeart,
  Church,
  Star,
  ArrowRight,
} from "lucide-react";

interface EventItem {
  id: string;
  titleEn: string;
  titleAm: string | null;
  descriptionEn: string | null;
  descriptionAm: string | null;
  eventDate: string;
  location: string | null;
  eventType: string | null;
  isLiturgical: boolean | null;
}

interface AnnouncementItem {
  id: string;
  titleEn: string;
  titleAm: string | null;
  contentEn: string | null;
  contentAm: string | null;
}

export default function LandingPage() {
  const { locale } = useApp();
  const isAm = locale === "am";

  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    fetch("/api/seed", { method: "POST" })
      .then(() => setSeeded(true))
      .catch(() => setSeeded(true));
  }, []);

  useEffect(() => {
    if (!seeded) return;
    fetch("/api/events").then((r) => r.json()).then((d) => setEvents(d.events || [])).catch(() => {});
    fetch("/api/announcements").then((r) => r.json()).then((d) => setAnnouncements(d.announcements || [])).catch(() => {});
  }, [seeded]);

  const features = [
    {
      icon: Church,
      titleEn: "Church Support",
      titleAm: "ቤተ ክርስቲያን ድጋፍ",
      descEn: "Directly supporting the construction, maintenance, and spiritual programs of Sebeta Wata Kidist Silassie Church.",
      descAm: "የሰበታ ዋታ ቅድስት ሥላሴ ቤተ ክርስቲያንን ግንባታ፣ ጥገና እና መንፈሳዊ ፕሮግራሞችን በቀጥታ መደገፍ።",
      color: "from-wine to-wine-light",
    },
    {
      icon: HandHeart,
      titleEn: "Community Service",
      titleAm: "የማህበረሰብ አገልግሎት",
      descEn: "Serving together through charitable works and supporting those in need within our community and beyond.",
      descAm: "በበጎ አድራጎት ሥራዎች አብረን እናገለግላለን፣ በማህበረሰባችን ውስጥ ለሚፈልጉ ድጋፍ እናደርጋለን።",
      color: "from-teal to-teal-light",
    },
    {
      icon: BookOpen,
      titleEn: "Spiritual Heritage",
      titleAm: "መንፈሳዊ ቅርስ",
      descEn: "Preserving the ancient traditions of the Ethiopian Orthodox Tewahedo Church through education and practice.",
      descAm: "በትምህርትና በተግባር የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ጥንታዊ ወጎች መጠበቅ።",
      color: "from-amber-dark to-amber",
    },
    {
      icon: GraduationCap,
      titleEn: "Youth & Education",
      titleAm: "ወጣቶች እና ትምህርት",
      descEn: "Nurturing the next generation through Sunday School, Bible study, and spiritual mentorship programs.",
      descAm: "በሰንበት ትምህርት ቤት፣ በመጽሐፍ ቅዱስ ጥናት እና በመንፈሳዊ አማካሪነት ቀጣዩን ትውልድ ማሳደግ።",
      color: "from-teal-dark to-teal",
    },
  ];

  return (
    <div>
      {/* Announcement Banner */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-dark via-amber to-amber-dark text-wine-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10" />
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold relative">
            <Bell className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>
              {isAm
                ? announcements[0].titleAm || announcements[0].titleEn
                : announcements[0].titleEn}
            </span>
          </div>
        </div>
      )}

      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-wine-dark/95 via-wine/85 to-teal-dark/90" />
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-[0.03]" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-amber/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-teal/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-teal-light animate-pulse" />
                <span className="text-xs font-medium text-white/70">
                  {isAm ? "መንፈሳዊ ማኅበር" : "Spiritual Association"}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight leading-[1.1]">
                <span className="text-amber-light">ማኅበረ ሥላሴ</span>
              </h1>
              <h2 className="text-lg sm:text-xl font-medium text-white/70 mb-6 leading-relaxed">
                {isAm ? "Mahibere Silassie" : "Mahibere Silassie"}
              </h2>

              {/* Church name */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-8">
                <p className="text-sm text-amber-light/80 mb-1 font-medium">
                  {isAm ? "ቤተ ክርስቲያናችን" : "Our Church"}
                </p>
                <p className="text-base sm:text-lg text-white/90 font-semibold leading-relaxed">
                  {isAm
                    ? "የሰበታ ዋታ ምዕራፈ ቅዱሳን ቅድስት ሥላሴ ወአቡነ አረጋዊ በዐታ ለማርያም ቤተ ክርስቲያን"
                    : "Sebeta Wata Mi'irafe Kidusan Kidist Silassie We'Abune Aregawi Be'ata LeMariam Church"}
                </p>
              </div>

              <p className="text-base text-white/50 mb-10 max-w-lg leading-relaxed">
                {isAm
                  ? "ቤተ ክርስቲያናችንን ለማገልገል፣ ቅርሷን ለመጠበቅ፣ ማህበረሰቡን ለመደገፍ የተቋቋመ የፍቅር ማኅበር ነው። ይቀላቀሉን!"
                  : "An association of love established to serve our church, preserve its heritage, and support our community. Join us!"}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="group gradient-amber text-wine-dark px-7 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isAm ? "አባል ይሁኑ" : "Join Now"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="glass border border-white/15 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/15 transition-all flex items-center gap-2"
                >
                  {isAm ? "ግባ" : "Member Login"}
                </Link>
              </div>
            </div>

            {/* Right — Logo & Church visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 rounded-full border-2 border-amber/20 flex items-center justify-center relative">
                  <div className="w-60 h-60 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-amber/30 shadow-2xl">
                      <Image
                        src="/images/logo.png"
                        alt="ማኅበረ ሥላሴ"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Orbiting elements */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber/90 text-wine-dark w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 bg-teal text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-wine-light text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <Church className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 80L48 72C96 64 192 48 288 42.7C384 37.3 480 42.7 576 48C672 53.3 768 58.7 864 56C960 53.3 1056 42.7 1152 37.3C1248 32 1344 32 1392 32L1440 32V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
              fill="#faf9f6"
            />
          </svg>
        </div>
      </section>

      {/* ═══ Mission Section ═══ */}
      <section className="py-20 bg-ivory relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-wine-50 text-wine rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
              <Heart className="w-3.5 h-3.5" />
              {isAm ? "ተልዕኮአችን" : "OUR MISSION"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate mb-4">
              {isAm ? "ለቤተ ክርስቲያናችን ድጋፍ" : "Supporting Our Church"}
            </h2>
            <div className="eth-line w-32 mx-auto mb-5" />
            <p className="text-lg text-slate-light max-w-2xl mx-auto leading-relaxed">
              {isAm
                ? "ማኅበረ ሥላሴ በእምነት፣ በፍቅርና በአንድነት ቤተ ክርስቲያናችንን እንደግፋለን"
                : "Mahibere Silassie — united in faith, love, and service to support our church"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 border border-sand/50 hover:border-amber/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-linen to-transparent rounded-bl-full opacity-50" />
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate mb-2">
                  {isAm ? f.titleAm : f.titleEn}
                </h3>
                <p className="text-sm text-slate-light leading-relaxed">
                  {isAm ? f.descAm : f.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Stats Section ═══ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "500+", labelEn: "Members", labelAm: "አባላት", icon: Users },
              { value: "50+", labelEn: "Years of Service", labelAm: "ዓመታት", icon: Calendar },
              { value: "12", labelEn: "Parish Groups", labelAm: "ቡድኖች", icon: BookOpen },
              { value: "100+", labelEn: "Events Yearly", labelAm: "ዓመታዊ ዝግጅቶች", icon: Heart },
            ].map((s, i) => (
              <div key={i} className="text-center text-white p-6 glass rounded-2xl border border-white/5">
                <s.icon className="w-7 h-7 text-amber-light mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold text-amber-light mb-1">{s.value}</div>
                <div className="text-sm text-white/50">{isAm ? s.labelAm : s.labelEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Church Details Section ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
                <Church className="w-3.5 h-3.5" />
                {isAm ? "ቤተ ክርስቲያናችን" : "OUR CHURCH"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate mb-4 leading-tight">
                {isAm
                  ? "የሰበታ ዋታ ምዕራፈ ቅዱሳን ቅድስት ሥላሴ ወአቡነ አረጋዊ በዐታ ለማርያም ቤተ ክርስቲያን"
                  : "Sebeta Wata Mi'irafe Kidusan Kidist Silassie We'Abune Aregawi Be'ata LeMariam Church"}
              </h2>
              <div className="eth-line w-24 mb-6" />
              <p className="text-slate-light leading-relaxed mb-6">
                {isAm
                  ? "ቤተ ክርስቲያናችን በሰበታ ዋታ አካባቢ የምትገኝ ጥንታዊ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ናት። ማኅበረ ሥላሴ ይህንን ቅዱስ ስፍራ ለመጠበቅና ለማገልገል የተቋቋመ ነው።"
                  : "Our church is an ancient Ethiopian Orthodox Tewahedo Church located in the Sebeta Wata area. Mahibere Silassie was established to preserve and serve this holy place."}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { en: "Church construction & renovation support", am: "የቤተ ክርስቲያን ግንባታና ጥገና ድጋፍ" },
                  { en: "Liturgical services & spiritual programs", am: "የአምልኮ አገልግሎቶች እና መንፈሳዊ ፕሮግራሞች" },
                  { en: "Community welfare & charitable works", am: "የማህበረሰብ ደህንነት እና የበጎ አድራጎት ሥራዎች" },
                  { en: "Youth education & Sunday School", am: "የወጣቶች ትምህርት እና ሰንበት ትምህርት ቤት" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Star className="w-3 h-3 text-teal" />
                    </div>
                    <span className="text-slate-light">{isAm ? item.am : item.en}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 gradient-wine text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                {isAm ? "ማኅበሩን ይቀላቀሉ" : "Join the Association"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative flex justify-center">
              <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Church"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 card-shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image src="/images/logo.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate">ሰበታ ዋታ</div>
                    <div className="text-[10px] text-slate-light">Sebeta Wata</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Events Section ═══ */}
      <section className="py-20 bg-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-wine-50 text-wine rounded-full px-4 py-1.5 text-xs font-semibold mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {isAm ? "ዝግጅቶች" : "EVENTS"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate">
                {isAm ? "መጪ ዝግጅቶች" : "Upcoming Events"}
              </h2>
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-1 text-wine font-semibold text-sm hover:text-amber-dark transition"
            >
              {isAm ? "ሁሉንም ይመልከቱ" : "View All"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16 text-slate-light bg-white rounded-2xl card-shadow">
              <Calendar className="w-14 h-14 mx-auto mb-3 opacity-20" />
              <p className="text-lg">{isAm ? "መጪ ዝግጅቶች የሉም" : "No upcoming events"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => {
                const typeColors: Record<string, string> = {
                  liturgy: "gradient-wine",
                  holiday: "gradient-amber",
                  community: "gradient-teal",
                  meeting: "bg-slate",
                };
                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group border border-sand/30"
                  >
                    <div className={`p-4 ${typeColors[event.eventType || "community"] || "gradient-teal"} text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
                      <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.eventDate).toLocaleDateString(
                          isAm ? "am-ET" : "en-US",
                          { weekday: "long", month: "long", day: "numeric" }
                        )}
                      </div>
                      {event.isLiturgical && (
                        <span className="inline-block text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-semibold mt-1">
                          ✦ {isAm ? "ሥርዓተ ቤ/ክ" : "Liturgical"}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate mb-2 group-hover:text-wine transition">
                        {isAm ? event.titleAm || event.titleEn : event.titleEn}
                      </h3>
                      <p className="text-sm text-slate-light mb-3 line-clamp-2 leading-relaxed">
                        {isAm ? event.descriptionAm || event.descriptionEn : event.descriptionEn}
                      </p>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-light">
                          <MapPin className="w-3.5 h-3.5 text-teal" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="sm:hidden text-center mt-6">
            <Link href="/events" className="text-wine font-semibold text-sm inline-flex items-center gap-1">
              {isAm ? "ሁሉንም ይመልከቱ" : "View All Events"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA Section ═══ */}
      <section className="py-20 bg-ivory">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative bg-white rounded-3xl p-10 sm:p-14 card-shadow-lg border border-sand/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 eth-line" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-wine-50 rounded-full opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-50 rounded-full opacity-50" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-6 border-3 border-amber/30 shadow-lg">
                <Image src="/images/logo.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate mb-3">
                {isAm ? "ወደ ማኅበራችን ይቀላቀሉ" : "Join Our Association"}
              </h2>
              <p className="text-slate-light mb-8 max-w-md mx-auto leading-relaxed">
                {isAm
                  ? "በእምነት እና በፍቅር አብረን ቤተ ክርስቲያናችንን እንደግፍ። ዛሬ ይመዝገቡ!"
                  : "Let us support our church together in faith and love. Register today!"}
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 gradient-amber text-wine-dark px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <Users className="w-5 h-5" />
                {isAm ? "አሁን ይመዝገቡ" : "Register Now"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
