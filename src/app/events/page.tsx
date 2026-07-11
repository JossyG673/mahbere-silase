"use client";

import ClientShell, { useApp } from "@/components/ClientShell";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Church, Clock, Filter, Star } from "lucide-react";

interface EventItem {
  id: string;
  titleEn: string;
  titleAm: string | null;
  descriptionEn: string | null;
  descriptionAm: string | null;
  eventDate: string;
  endDate: string | null;
  location: string | null;
  eventType: string | null;
  isLiturgical: boolean | null;
}

function EventsContent() {
  const { locale } = useApp();
  const isAm = locale === "am";
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(d => setEvents(d.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? events : filter === "liturgical" ? events.filter(e => e.isLiturgical) : events.filter(e => e.eventType === filter);

  const typeGradients: Record<string, string> = {
    liturgy: "gradient-wine",
    holiday: "gradient-amber",
    meeting: "gradient-teal",
    community: "bg-slate",
  };

  const typeLabels: Record<string, { en: string; am: string }> = {
    liturgy: { en: "LITURGY", am: "ቅዳሴ" },
    holiday: { en: "HOLIDAY", am: "በዓል" },
    meeting: { en: "MEETING", am: "ስብሰባ" },
    community: { en: "COMMUNITY", am: "ማህበረሰብ" },
  };

  return (
    <div className="min-h-[80vh] py-10 px-4 bg-linen relative">
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-[0.03]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-5 border-2 border-amber/30 shadow-lg">
            <Image src="/images/logo.png" alt="" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate mb-3">
            {isAm ? "ዝግጅቶች እና ቀን መቁጠሪያ" : "Events & Calendar"}
          </h1>
          <div className="eth-line w-24 mx-auto mb-4" />
          <p className="text-slate-light max-w-lg mx-auto">
            {isAm ? "የሰበታ ዋታ ቅድስት ሥላሴ ቤተ ክርስቲያን ዝግጅቶች" : "Events at Sebeta Wata Kidist Silassie Church"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
          <Filter className="w-4 h-4 text-slate-light" />
          {[
            { key: "all", labelEn: "All", labelAm: "ሁሉም" },
            { key: "liturgical", labelEn: "Liturgical", labelAm: "ሥርዓተ ቤ/ክ" },
            { key: "holiday", labelEn: "Holidays", labelAm: "በዓላት" },
            { key: "community", labelEn: "Community", labelAm: "ማህበረሰብ" },
            { key: "meeting", labelEn: "Meetings", labelAm: "ስብሰባ" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                filter === f.key
                  ? "bg-wine text-white border-wine shadow-md"
                  : "bg-white text-slate-light border-sand hover:border-wine/20 card-shadow"
              }`}>
              {isAm ? f.labelAm : f.labelEn}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 card-shadow border border-sand/30">
                <div className="skeleton h-4 w-32 rounded mb-3" />
                <div className="skeleton h-6 w-full rounded mb-2" />
                <div className="skeleton h-4 w-3/4 rounded mb-2" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-light bg-white rounded-2xl card-shadow border border-sand/30">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-15" />
            <p className="text-lg font-medium">{isAm ? "ምንም ዝግጅት አልተገኘም" : "No events found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group border border-sand/30">
                <div className={`p-4 ${typeGradients[event.eventType || "community"]} text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full" />
                  <div className="flex items-center justify-between mb-1 relative z-10">
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.eventDate).toLocaleDateString(isAm ? "am-ET" : "en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {typeLabels[event.eventType || "community"]?.[isAm ? "am" : "en"] || "EVENT"}
                    </span>
                  </div>
                  {event.isLiturgical && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber/20 text-amber-light px-2 py-0.5 rounded-full font-semibold mt-1">
                      <Star className="w-3 h-3" />{isAm ? "ሥርዓተ" : "Liturgical"}
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
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-light">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-wine" />
                      {new Date(event.eventDate).toLocaleTimeString(isAm ? "am-ET" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (<ClientShell><EventsContent /></ClientShell>);
}
