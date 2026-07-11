"use client";

import ClientShell, { useApp } from "@/components/ClientShell";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Users, UserCheck, DollarSign, Clock, Search, Filter, ChevronDown, Trash2, Eye,
  ChevronLeft, ChevronRight, X, CreditCard, Calendar, Bell, Shield, LayoutDashboard,
} from "lucide-react";
import { CardSkeleton, TableSkeleton } from "@/components/ui/SkeletonLoader";

interface DashboardStats { totalMembers: number; activeMembers: number; pendingApprovals: number; monthlyContributions: string; }
interface MemberRow { id: string; memberId: string; legalFirstName: string; legalLastName: string; baptismalName: string | null; amharicName: string | null; email: string | null; phone: string | null; parish: string | null; status: "active" | "inactive" | "pending"; registrationDate: string; }
interface ContributionRow { contribution: { id: string; amount: string; type: string; paymentStatus: string; receiptNumber: string | null; createdAt: string; paymentDate: string | null; }; memberName: string; memberMemberId: string; }

function AdminDashboard() {
  const { locale, user } = useApp();
  const isAm = locale === "am";

  const [activeTab, setActiveTab] = useState<"members" | "contributions" | "events" | "announcements">("members");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [contributions, setContributions] = useState<ContributionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingMember, setEditingMember] = useState<MemberRow | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${user?.token || ""}`, "Content-Type": "application/json" }), [user?.token]);
  const fetchStats = useCallback(async () => { try { const res = await fetch("/api/dashboard", { headers: authHeaders() }); if (res.ok) setStats(await res.json()); } catch {} }, [authHeaders]);
  const fetchMembers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "10", ...(search && { search }), ...(statusFilter && { status: statusFilter }) });
      const res = await fetch(`/api/members?${params}`, { headers: authHeaders() });
      if (res.ok) { const data = await res.json(); setMembers(data.members); setTotalPages(data.totalPages); }
    } catch {}
  }, [page, search, statusFilter, authHeaders]);
  const fetchContributions = useCallback(async () => { try { const res = await fetch("/api/contributions", { headers: authHeaders() }); if (res.ok) { const data = await res.json(); setContributions(data.contributions); } } catch {} }, [authHeaders]);

  useEffect(() => { if (!user?.token) return; setLoading(true); Promise.all([fetchStats(), fetchMembers(), fetchContributions()]).finally(() => setLoading(false)); }, [user?.token, fetchStats, fetchMembers, fetchContributions]);
  useEffect(() => { if (user?.token) fetchMembers(); }, [page, search, statusFilter, user?.token, fetchMembers]);

  const updateMemberStatus = async (id: string, status: "active" | "inactive" | "pending") => { try { await fetch(`/api/members/${id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }) }); fetchMembers(); fetchStats(); } catch {} };
  const deleteMember = async (id: string) => { if (!confirm(isAm ? "እርግጠኛ ነዎት?" : "Are you sure?")) return; try { await fetch(`/api/members/${id}`, { method: "DELETE", headers: authHeaders() }); fetchMembers(); fetchStats(); } catch {} };

  if (!user) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-12 h-12 text-slate-light mx-auto mb-3 opacity-30" />
        <p className="text-slate-light">{isAm ? "እባክዎ ይግቡ" : "Please log in to access the admin dashboard."}</p>
        <a href="/login" className="inline-flex mt-4 gradient-wine text-white px-6 py-2.5 rounded-xl font-semibold">{isAm ? "ግባ" : "Login"}</a>
      </div>
    </div>
  );

  const statusColors = { active: "bg-emerald-100 text-emerald-700 border-emerald-200", inactive: "bg-gray-100 text-gray-600 border-gray-200", pending: "bg-amber-100 text-amber-700 border-amber-200" };
  const paymentColors: Record<string, string> = { paid: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", overdue: "bg-red-100 text-red-700" };

  return (
    <div className="min-h-[80vh] py-6 px-4 bg-linen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber/30 shadow-md hidden sm:block">
              <Image src="/images/logo.png" alt="" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-wine" />
                {isAm ? "አስተዳዳሪ ዳሽቦርድ" : "Admin Dashboard"}
              </h1>
              <p className="text-slate-light text-xs mt-0.5">{isAm ? "ማኅበረ ሥላሴ — የአባላት አስተዳደር" : "Mahibere Silassie — Member Management"}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label={isAm ? "ጠቅላላ አባላት" : "Total Members"} value={stats?.totalMembers || 0} gradient="from-wine to-wine-light" />
            <StatCard icon={UserCheck} label={isAm ? "ንቁ አባላት" : "Active Members"} value={stats?.activeMembers || 0} gradient="from-teal to-teal-light" />
            <StatCard icon={DollarSign} label={isAm ? "ወርሃዊ መዋጮ" : "Monthly Contributions"} value={`ETB ${Number(stats?.monthlyContributions || 0).toLocaleString()}`} gradient="from-amber-dark to-amber" />
            <StatCard icon={Clock} label={isAm ? "በመጠባበቅ ላይ" : "Pending"} value={stats?.pendingApprovals || 0} gradient="from-slate to-slate-light" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0.5 mb-6 bg-white rounded-xl p-1 card-shadow border border-sand/50 overflow-x-auto">
          {[
            { key: "members" as const, labelEn: "Members", labelAm: "አባላት", icon: Users },
            { key: "contributions" as const, labelEn: "Ledger", labelAm: "መዋጮ", icon: CreditCard },
            { key: "events" as const, labelEn: "Events", labelAm: "ዝግጅቶች", icon: Calendar },
            { key: "announcements" as const, labelEn: "Notices", labelAm: "ማስታወቂያ", icon: Bell },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap flex-1 justify-center ${
                activeTab === tab.key ? "bg-wine text-white shadow-md" : "text-slate-light hover:bg-linen"
              }`}>
              <tab.icon className="w-4 h-4" />
              {isAm ? tab.labelAm : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 overflow-hidden">
            <div className="p-4 border-b border-sand/30">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-light/40" />
                  <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder={isAm ? "በስም፣ ስልክ ወይም መታወቂያ ይፈልጉ..." : "Search by name, phone, or member ID..."}
                    className="w-full pl-10 pr-4 py-2.5 border border-sand rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition text-sm bg-ivory/30" />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 border border-sand rounded-xl text-sm font-medium hover:bg-linen transition">
                  <Filter className="w-4 h-4 text-wine" /> {isAm ? "ማጣሪያ" : "Filters"} <ChevronDown className={`w-4 h-4 transition ${showFilters ? "rotate-180" : ""}`} />
                </button>
              </div>
              {showFilters && (
                <div className="mt-3 flex flex-wrap gap-3 animate-slide-down">
                  <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 border border-sand rounded-lg text-sm bg-white">
                    <option value="">{isAm ? "ሁሉም ሁኔታዎች" : "All Statuses"}</option>
                    <option value="active">{isAm ? "ንቁ" : "Active"}</option>
                    <option value="inactive">{isAm ? "ንቁ ያልሆነ" : "Inactive"}</option>
                    <option value="pending">{isAm ? "በመጠባበቅ" : "Pending"}</option>
                  </select>
                  {(search || statusFilter) && (
                    <button onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }} className="text-xs text-danger flex items-center gap-1 hover:underline">
                      <X className="w-3 h-3" /> {isAm ? "ማጥራት" : "Clear"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading ? <div className="p-6"><TableSkeleton /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-linen/50 text-left">
                      <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider">{isAm ? "ስም" : "Name"}</th>
                      <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider hidden md:table-cell">{isAm ? "መታወቂያ" : "ID"}</th>
                      <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider hidden lg:table-cell">{isAm ? "ስልክ" : "Phone"}</th>
                      <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider hidden lg:table-cell">{isAm ? "ፓሪሽ" : "Parish"}</th>
                      <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider">{isAm ? "ሁኔታ" : "Status"}</th>
                      <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider text-right">{isAm ? "ድርጊት" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/30">
                    {members.map(m => (
                      <tr key={m.id} className="hover:bg-ivory/50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full gradient-wine flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {m.legalFirstName[0]}{m.legalLastName[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-slate">{m.legalFirstName} {m.legalLastName}</div>
                              {m.baptismalName && <div className="text-xs text-slate-light">{m.baptismalName}{m.amharicName && ` • ${m.amharicName}`}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-light font-mono text-xs hidden md:table-cell">{m.memberId}</td>
                        <td className="px-4 py-3 text-slate-light hidden lg:table-cell">{m.phone || "—"}</td>
                        <td className="px-4 py-3 text-slate-light text-xs hidden lg:table-cell">{m.parish || "—"}</td>
                        <td className="px-4 py-3">
                          <select value={m.status} onChange={(e) => updateMemberStatus(m.id, e.target.value as "active" | "inactive" | "pending")}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${statusColors[m.status]}`}>
                            <option value="active">{isAm ? "ንቁ" : "Active"}</option>
                            <option value="inactive">{isAm ? "ንቁ ያልሆነ" : "Inactive"}</option>
                            <option value="pending">{isAm ? "በመጠባበቅ" : "Pending"}</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setEditingMember(m)} className="p-2 rounded-lg hover:bg-wine/5 text-wine transition" title="View"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => deleteMember(m.id)} className="p-2 rounded-lg hover:bg-red-50 text-danger transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {members.length === 0 && (
                  <div className="text-center py-16 text-slate-light">
                    <Users className="w-14 h-14 mx-auto mb-3 opacity-20" />
                    <p>{isAm ? "ምንም አባል አልተገኘም" : "No members found"}</p>
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="p-4 border-t border-sand/30 flex items-center justify-between">
                <p className="text-xs text-slate-light">{isAm ? `ገጽ ${page} ከ ${totalPages}` : `Page ${page} of ${totalPages}`}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-sand hover:bg-linen disabled:opacity-30 transition"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-sand hover:bg-linen disabled:opacity-30 transition"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contributions Tab */}
        {activeTab === "contributions" && (
          <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 overflow-hidden">
            <div className="p-4 border-b border-sand/30">
              <h2 className="font-bold text-slate flex items-center gap-2"><CreditCard className="w-5 h-5 text-amber-dark" /> {isAm ? "የመዋጮ መዝገብ" : "Financial Ledger"}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-linen/50 text-left">
                    <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider">{isAm ? "አባል" : "Member"}</th>
                    <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider">{isAm ? "ዓይነት" : "Type"}</th>
                    <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider">{isAm ? "መጠን" : "Amount"}</th>
                    <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider hidden md:table-cell">{isAm ? "ደረሰኝ" : "Receipt"}</th>
                    <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider">{isAm ? "ሁኔታ" : "Status"}</th>
                    <th className="px-4 py-3 font-semibold text-slate text-xs uppercase tracking-wider hidden md:table-cell">{isAm ? "ቀን" : "Date"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/30">
                  {contributions.map(c => (
                    <tr key={c.contribution.id} className="hover:bg-ivory/50">
                      <td className="px-4 py-3"><div className="font-medium text-slate">{c.memberName}</div><div className="text-xs text-slate-light font-mono">{c.memberMemberId}</div></td>
                      <td className="px-4 py-3 capitalize text-slate-light text-xs">{c.contribution.type}</td>
                      <td className="px-4 py-3 font-bold text-slate">ETB {Number(c.contribution.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-light hidden md:table-cell">{c.contribution.receiptNumber || "—"}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentColors[c.contribution.paymentStatus] || ""}`}>{c.contribution.paymentStatus}</span></td>
                      <td className="px-4 py-3 text-slate-light text-xs hidden md:table-cell">{c.contribution.paymentDate ? new Date(c.contribution.paymentDate).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {contributions.length === 0 && <div className="text-center py-16 text-slate-light"><CreditCard className="w-14 h-14 mx-auto mb-3 opacity-20" /><p>{isAm ? "ምንም መዋጮ አልተገኘም" : "No contributions"}</p></div>}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 p-8 text-center">
            <Calendar className="w-14 h-14 mx-auto mb-4 text-teal opacity-30" />
            <h2 className="font-bold text-slate mb-2">{isAm ? "ዝግጅቶች" : "Events"}</h2>
            <p className="text-slate-light text-sm">{isAm ? "ዝግጅቶች ከመነሻ ገጹ ይታያሉ" : "Events are displayed on the landing page"}</p>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="bg-white rounded-2xl card-shadow-lg border border-sand/30 p-8 text-center">
            <Bell className="w-14 h-14 mx-auto mb-4 text-amber opacity-30" />
            <h2 className="font-bold text-slate mb-2">{isAm ? "ማስታወቂያዎች" : "Announcements"}</h2>
            <p className="text-slate-light text-sm">{isAm ? "ማስታወቂያዎች በመነሻ ገጹ ላይ ይታያሉ" : "Announcements are shown on the landing page"}</p>
          </div>
        )}

        {/* Member Detail Modal */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto card-shadow-lg animate-scale-in border border-sand/30">
              <div className="gradient-hero-warm p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">{isAm ? "የአባል ዝርዝር" : "Member Details"}</h2>
                  <button onClick={() => setEditingMember(null)} className="p-1.5 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{editingMember.legalFirstName[0]}{editingMember.legalLastName[0]}</div>
                  <div>
                    <div className="text-lg font-bold">{editingMember.legalFirstName} {editingMember.legalLastName}</div>
                    {editingMember.amharicName && <div className="text-amber-light text-sm">{editingMember.amharicName}</div>}
                    <div className="text-xs text-white/50 font-mono">{editingMember.memberId}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <DetailRow label={isAm ? "የክርስትና ስም" : "Baptismal Name"} value={editingMember.baptismalName || "—"} />
                <DetailRow label={isAm ? "ኢሜይል" : "Email"} value={editingMember.email || "—"} />
                <DetailRow label={isAm ? "ስልክ" : "Phone"} value={editingMember.phone || "—"} />
                <DetailRow label={isAm ? "ፓሪሽ" : "Parish"} value={editingMember.parish || "—"} />
                <DetailRow label={isAm ? "ሁኔታ" : "Status"} value={editingMember.status} />
                <DetailRow label={isAm ? "የተመዘገቡበት" : "Registered"} value={new Date(editingMember.registrationDate).toLocaleDateString()} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; gradient: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow hover:card-shadow-hover transition border border-sand/30 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-linen rounded-bl-full opacity-60 group-hover:opacity-100 transition" />
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-slate relative">{value}</div>
      <div className="text-xs text-slate-light mt-1 relative">{label}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-sand/30">
      <span className="text-sm text-slate-light">{label}</span>
      <span className="text-sm font-medium text-slate">{value}</span>
    </div>
  );
}

export default function AdminPage() {
  return (<ClientShell><AdminDashboard /></ClientShell>);
}
