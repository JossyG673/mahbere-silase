"use client";

import ClientShell, { useApp } from "@/components/ClientShell";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  User, CreditCard, History, Church, Calendar, MapPin, Phone, Mail,
  Shield, ChevronRight, Star, Heart,
} from "lucide-react";
import { ProfileSkeleton } from "@/components/ui/SkeletonLoader";

interface MemberData { id: string; memberId: string; legalFirstName: string; legalLastName: string; legalMiddleName: string | null; baptismalName: string | null; amharicName: string | null; dateOfBirth: string | null; gender: string | null; email: string | null; phone: string | null; city: string | null; subcity: string | null; region: string | null; parish: string | null; confessionFather: string | null; status: string; registrationDate: string; }
interface ContributionData { id: string; amount: string; type: string; paymentStatus: string; receiptNumber: string | null; createdAt: string; paymentDate: string | null; }
interface ServiceData { id: string; serviceName: string; serviceNameAm: string | null; serviceDate: string; officiant: string | null; notes: string | null; }

function MemberPortal() {
  const { locale, user } = useApp();
  const isAm = locale === "am";
  const [activeTab, setActiveTab] = useState<"profile" | "card" | "contributions" | "history">("profile");
  const [member, setMember] = useState<MemberData | null>(null);
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    fetch("/api/portal", { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json())
      .then(data => { setMember(data.member); setContributions(data.contributions || []); setServiceHistory(data.serviceHistory || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.token]);

  if (!user) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-12 h-12 text-slate-light mx-auto mb-3 opacity-30" />
        <p className="text-slate-light">{isAm ? "እባክዎ ይግቡ" : "Please log in to access your portal."}</p>
        <a href="/login" className="inline-flex items-center gap-2 mt-4 gradient-wine text-white px-6 py-2.5 rounded-xl font-semibold">{isAm ? "ግባ" : "Login"}<ChevronRight className="w-4 h-4" /></a>
      </div>
    </div>
  );

  const tabs = [
    { key: "profile" as const, labelEn: "Profile", labelAm: "መገለጫ", icon: User },
    { key: "card" as const, labelEn: "Membership Card", labelAm: "የአባልነት ካርድ", icon: CreditCard },
    { key: "contributions" as const, labelEn: "Contributions", labelAm: "መዋጮ", icon: CreditCard },
    { key: "history" as const, labelEn: "Service History", labelAm: "ታሪክ", icon: History },
  ];

  const paymentColors: Record<string, string> = { paid: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", overdue: "bg-red-100 text-red-700" };

  return (
    <div className="min-h-[80vh] py-6 px-4 bg-linen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber/30 shadow-md hidden sm:block">
            <Image src="/images/logo.png" alt="" width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate">{isAm ? "የአባላት መግቢያ" : "Member Portal"}</h1>
            <p className="text-slate-light text-xs mt-0.5">{isAm ? `እንኳን ደህና መጡ${member ? `, ${member.legalFirstName}` : ""}` : `Welcome${member ? `, ${member.legalFirstName}` : ""}`}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-6 bg-white rounded-xl p-1 card-shadow border border-sand/50 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap flex-1 justify-center ${
                activeTab === tab.key ? "bg-wine text-white shadow-md" : "text-slate-light hover:bg-linen"
              }`}>
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{isAm ? tab.labelAm : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 card-shadow"><ProfileSkeleton /></div>
        ) : !member ? (
          <div className="bg-white rounded-2xl p-10 card-shadow-lg text-center border border-sand/30">
            <User className="w-14 h-14 text-slate-light mx-auto mb-3 opacity-20" />
            <h3 className="text-lg font-bold text-slate mb-2">{isAm ? "መገለጫ አልተገኘም" : "No Profile Found"}</h3>
            <p className="text-slate-light text-sm mb-4">{isAm ? "የአባልነት ማመልከቻ ያስገቡ" : "Please submit your membership application."}</p>
            <a href="/register" className="inline-flex items-center gap-2 gradient-wine text-white px-6 py-2.5 rounded-xl font-semibold">{isAm ? "ይመዝገቡ" : "Register"}</a>
          </div>
        ) : (
          <>
            {/* Profile */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 overflow-hidden animate-fade-in">
                <div className="gradient-hero p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-amber/30">
                      {member.legalFirstName[0]}{member.legalLastName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{member.legalFirstName} {member.legalMiddleName || ""} {member.legalLastName}</h2>
                      {member.amharicName && <p className="text-amber-light">{member.amharicName}</p>}
                      <p className="text-xs text-white/50 font-mono mt-0.5">{member.memberId}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoItem icon={Church} label={isAm ? "የክርስትና ስም" : "Baptismal Name"} value={member.baptismalName || "—"} />
                  <InfoItem icon={Calendar} label={isAm ? "የልደት ቀን" : "Date of Birth"} value={member.dateOfBirth || "—"} />
                  <InfoItem icon={Mail} label={isAm ? "ኢሜይል" : "Email"} value={member.email || "—"} />
                  <InfoItem icon={Phone} label={isAm ? "ስልክ" : "Phone"} value={member.phone || "—"} />
                  <InfoItem icon={MapPin} label={isAm ? "ከተማ" : "Location"} value={[member.subcity, member.city, member.region].filter(Boolean).join(", ") || "—"} />
                  <InfoItem icon={Church} label={isAm ? "ፓሪሽ" : "Parish"} value={member.parish || "—"} />
                  <InfoItem icon={User} label={isAm ? "የንስሐ አባት" : "Confession Father"} value={member.confessionFather || "—"} />
                  <InfoItem icon={Shield} label={isAm ? "ሁኔታ" : "Status"} value={member.status} />
                </div>
              </div>
            )}

            {/* Digital Membership Card */}
            {activeTab === "card" && (
              <div className="max-w-md mx-auto animate-scale-in">
                <div className="rounded-2xl overflow-hidden card-shadow-lg">
                  <div className="gradient-hero p-6 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-5">
                      <Church className="w-28 h-28" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal/10 rounded-tl-full" />

                    <div className="flex items-center gap-3 mb-8 relative z-10">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber/40">
                        <Image src="/images/logo.png" alt="" width={44} height={44} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-amber-light">ማኅበረ ሥላሴ</div>
                        <div className="text-[9px] text-white/40 leading-tight">Mahibere Silassie • Sebeta Wata</div>
                      </div>
                    </div>

                    <div className="mb-5 relative z-10">
                      <div className="text-xl font-bold">{member.legalFirstName} {member.legalLastName}</div>
                      {member.amharicName && <div className="text-sm text-amber-light/80 mt-0.5">{member.amharicName}</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">{isAm ? "መታወቂያ" : "Member ID"}</div>
                        <div className="font-mono font-bold text-amber-light text-sm">{member.memberId}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">{isAm ? "ሁኔታ" : "Status"}</div>
                        <div className={`font-bold text-sm ${member.status === "active" ? "text-emerald-400" : "text-amber-light"}`}>{member.status.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">{isAm ? "ፓሪሽ" : "Parish"}</div>
                        <div className="text-xs text-white/70">{member.parish || "—"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">{isAm ? "ከ" : "Since"}</div>
                        <div className="text-xs text-white/70">{new Date(member.registrationDate).getFullYear()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="eth-line" />
                  <div className="bg-white p-4">
                    <div className="flex items-center justify-between text-[10px] text-slate-light">
                      <span>{isAm ? "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ" : "Sebeta Wata Kidist Silassie Church"}</span>
                      <span className="font-mono">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contributions */}
            {activeTab === "contributions" && (
              <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-sand/30"><h2 className="font-bold text-slate flex items-center gap-2"><CreditCard className="w-5 h-5 text-amber-dark" />{isAm ? "የእኔ መዋጮዎች" : "My Contributions"}</h2></div>
                {contributions.length === 0 ? (
                  <div className="text-center py-16 text-slate-light"><CreditCard className="w-14 h-14 mx-auto mb-3 opacity-20" /><p>{isAm ? "ምንም መዋጮ አልተገኘም" : "No contributions recorded"}</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-linen/50 text-left">
                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">{isAm ? "ዓይነት" : "Type"}</th>
                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">{isAm ? "መጠን" : "Amount"}</th>
                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">{isAm ? "ሁኔታ" : "Status"}</th>
                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">{isAm ? "ደረሰኝ" : "Receipt"}</th>
                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">{isAm ? "ቀን" : "Date"}</th>
                      </tr></thead>
                      <tbody className="divide-y divide-sand/30">
                        {contributions.map(c => (
                          <tr key={c.id} className="hover:bg-ivory/50">
                            <td className="px-4 py-3 capitalize text-sm">{c.type}</td>
                            <td className="px-4 py-3 font-bold text-sm">ETB {Number(c.amount).toLocaleString()}</td>
                            <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentColors[c.paymentStatus] || ""}`}>{c.paymentStatus}</span></td>
                            <td className="px-4 py-3 text-xs font-mono text-slate-light hidden md:table-cell">{c.receiptNumber || "—"}</td>
                            <td className="px-4 py-3 text-slate-light text-xs hidden md:table-cell">{c.paymentDate ? new Date(c.paymentDate).toLocaleDateString() : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Service History */}
            {activeTab === "history" && (
              <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-sand/30"><h2 className="font-bold text-slate flex items-center gap-2"><History className="w-5 h-5 text-teal" />{isAm ? "የአገልግሎት ታሪክ" : "Service History"}</h2></div>
                {serviceHistory.length === 0 ? (
                  <div className="text-center py-16 text-slate-light"><History className="w-14 h-14 mx-auto mb-3 opacity-20" /><p>{isAm ? "ምንም ታሪክ አልተገኘም" : "No service history"}</p></div>
                ) : (
                  <div className="divide-y divide-sand/30">
                    {serviceHistory.map(s => (
                      <div key={s.id} className="p-4 hover:bg-ivory/50 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center"><Church className="w-5 h-5 text-teal" /></div>
                          <div className="flex-1">
                            <div className="font-medium text-slate">{isAm ? s.serviceNameAm || s.serviceName : s.serviceName}</div>
                            <div className="text-xs text-slate-light flex items-center gap-2 mt-0.5">
                              <Calendar className="w-3 h-3" />{new Date(s.serviceDate).toLocaleDateString()}
                              {s.officiant && <><span>•</span>{s.officiant}</>}
                            </div>
                            {s.notes && <div className="text-xs text-slate-light/70 mt-1">{s.notes}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-wine/5 flex items-center justify-center flex-shrink-0 mt-0.5"><Icon className="w-4 h-4 text-wine" /></div>
      <div><div className="text-[11px] text-slate-light uppercase tracking-wider">{label}</div><div className="text-sm font-medium text-slate">{value}</div></div>
    </div>
  );
}

export default function PortalPage() {
  return (<ClientShell><MemberPortal /></ClientShell>);
}
