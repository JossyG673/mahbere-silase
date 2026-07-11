"use client";

import ClientShell, { useApp } from "@/components/ClientShell";
import { useState } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  Church,
  AlertTriangle,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

interface FormData {
  legalFirstName: string;
  legalLastName: string;
  legalMiddleName: string;
  baptismalName: string;
  amharicName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  alternatePhone: string;
  country: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  city: string;
  subcity: string;
  houseNumber: string;
  parish: string;
  confessionFather: string;
  sundaySchool: string;
  serviceArea: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  password: string;
}

function RegistrationForm() {
  const { locale, login } = useApp();
  const isAm = locale === "am";

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    legalFirstName: "",
    legalLastName: "",
    legalMiddleName: "",
    baptismalName: "",
    amharicName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    alternatePhone: "",
    country: "Ethiopia",
    region: "",
    zone: "",
    woreda: "",
    kebele: "",
    city: "",
    subcity: "",
    houseNumber: "",
    parish: "የሰበታ ዋታ ቅድስት ሥላሴ ቤ/ክ",
    confessionFather: "",
    sundaySchool: "",
    serviceArea: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    password: "",
  });

  const steps = [
    { titleEn: "Personal Information", titleAm: "የግል መረጃ", icon: User },
    { titleEn: "Contact & Account", titleAm: "ግንኙነት እና መለያ", icon: Phone },
    { titleEn: "Address", titleAm: "አድራሻ", icon: MapPin },
    { titleEn: "Parish & Church", titleAm: "ፓሪሽ", icon: Church },
    { titleEn: "Emergency Contact", titleAm: "ድንገተኛ ግንኙነት", icon: AlertTriangle },
  ];

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 0) return formData.legalFirstName && formData.legalLastName;
    if (step === 1) return formData.email && formData.phone && formData.password && formData.password.length >= 6;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const authRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const authData = await authRes.json();
      if (!authRes.ok) { setError(authData.error || "Registration failed"); setLoading(false); return; }

      const memberRes = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: authData.user.id }),
      });
      if (!memberRes.ok) { setError("Failed to create member profile"); setLoading(false); return; }

      login(authData.token);
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="text-center bg-white rounded-2xl p-10 card-shadow-lg max-w-md border border-sand/50 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-teal" />
          </div>
          <h2 className="text-2xl font-bold text-slate mb-3">
            {isAm ? "ምዝገባ ተሳክቷል!" : "Registration Successful!"}
          </h2>
          <p className="text-slate-light mb-6 text-sm leading-relaxed">
            {isAm
              ? "መለያዎ ተፈጥሯል። የአባልነት ማመልከቻዎ በመገምገም ላይ ነው።"
              : "Your account has been created. Your membership application is under review."}
          </p>
          <a
            href="/portal"
            className="inline-flex items-center gap-2 gradient-wine text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
          >
            {isAm ? "ወደ መግቢያ" : "Go to Portal"}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 relative">
      <div className="absolute inset-0 bg-linen" />
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-[0.03]" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-4 border-2 border-amber/30 shadow-lg">
            <Image src="/images/logo.png" alt="" width={56} height={56} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate">
            {isAm ? "የአባልነት ምዝገባ" : "Member Registration"}
          </h1>
          <p className="text-slate-light mt-2 text-sm">
            {isAm
              ? "ወደ ማኅበረ ሥላሴ ለመቀላቀል ይመዝገቡ"
              : "Register to join Mahibere Silassie — supporting Sebeta Wata Church"}
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 flex-wrap">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition border ${
                  i === step
                    ? "bg-wine text-white border-wine shadow-md"
                    : i < step
                    ? "bg-teal/10 text-teal border-teal/20"
                    : "bg-white text-slate-light/50 border-sand"
                }`}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isAm ? s.titleAm : s.titleEn}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-sand" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 card-shadow-lg border border-sand/50">
          {error && (
            <div className="bg-red-50 text-danger text-sm p-3 rounded-xl mb-5 border border-red-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <SectionTitle icon={User} text={isAm ? "የግል መረጃ" : "Personal Information"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={isAm ? "ሕጋዊ የመጀመሪያ ስም *" : "Legal First Name *"} value={formData.legalFirstName} onChange={(v) => update("legalFirstName", v)} required />
                <InputField label={isAm ? "ሕጋዊ የአባት ስም *" : "Legal Last Name *"} value={formData.legalLastName} onChange={(v) => update("legalLastName", v)} required />
                <InputField label={isAm ? "መካከለኛ ስም" : "Middle Name"} value={formData.legalMiddleName} onChange={(v) => update("legalMiddleName", v)} />
                <InputField label={isAm ? "የክርስትና ስም" : "Baptismal Name (የክርስትና ስም)"} value={formData.baptismalName} onChange={(v) => update("baptismalName", v)} />
                <InputField label={isAm ? "ሙሉ ስም በአማርኛ" : "Full Name in Amharic"} value={formData.amharicName} onChange={(v) => update("amharicName", v)} />
                <InputField label={isAm ? "የልደት ቀን" : "Date of Birth"} type="date" value={formData.dateOfBirth} onChange={(v) => update("dateOfBirth", v)} />
                <div>
                  <label className="block text-sm font-semibold text-slate mb-1.5">{isAm ? "ጾታ" : "Gender"}</label>
                  <select value={formData.gender} onChange={(e) => update("gender", e.target.value)} className="w-full px-4 py-3 border border-sand rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition text-sm bg-ivory/50">
                    <option value="">—</option>
                    <option value="Male">{isAm ? "ወንድ" : "Male"}</option>
                    <option value="Female">{isAm ? "ሴት" : "Female"}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <SectionTitle icon={Phone} text={isAm ? "ግንኙነት እና መለያ" : "Contact & Account"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={isAm ? "ኢሜይል *" : "Email *"} type="email" value={formData.email} onChange={(v) => update("email", v)} required />
                <InputField label={isAm ? "የይለፍ ቃል * (ቢያንስ 6)" : "Password * (min 6 chars)"} type="password" value={formData.password} onChange={(v) => update("password", v)} required />
                <InputField label={isAm ? "ስልክ ቁጥር *" : "Phone Number *"} value={formData.phone} onChange={(v) => update("phone", v)} placeholder="+251-9XX-XXXXXX" required />
                <InputField label={isAm ? "ተለዋጭ ስልክ" : "Alternate Phone"} value={formData.alternatePhone} onChange={(v) => update("alternatePhone", v)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <SectionTitle icon={MapPin} text={isAm ? "የአድራሻ መረጃ" : "Address Information"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={isAm ? "ሀገር" : "Country"} value={formData.country} onChange={(v) => update("country", v)} />
                <InputField label={isAm ? "ክልል" : "Region/State"} value={formData.region} onChange={(v) => update("region", v)} />
                <InputField label={isAm ? "ዞን" : "Zone"} value={formData.zone} onChange={(v) => update("zone", v)} />
                <InputField label={isAm ? "ወረዳ" : "Woreda"} value={formData.woreda} onChange={(v) => update("woreda", v)} />
                <InputField label={isAm ? "ቀበሌ" : "Kebele"} value={formData.kebele} onChange={(v) => update("kebele", v)} />
                <InputField label={isAm ? "ከተማ" : "City"} value={formData.city} onChange={(v) => update("city", v)} />
                <InputField label={isAm ? "ክፍለ ከተማ" : "Sub-city"} value={formData.subcity} onChange={(v) => update("subcity", v)} />
                <InputField label={isAm ? "የቤት ቁጥር" : "House Number"} value={formData.houseNumber} onChange={(v) => update("houseNumber", v)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <SectionTitle icon={Church} text={isAm ? "ፓሪሽ እና ቤተ ክርስቲያን" : "Parish & Church"} />
              <div className="bg-teal-50 rounded-xl p-4 border border-teal/10 mb-2">
                <p className="text-xs text-teal font-medium">
                  {isAm
                    ? "ማኅበረ ሥላሴ — የሰበታ ዋታ ቅድስት ሥላሴ ወአቡነ አረጋዊ ቤተ ክርስቲያን ደጋፊ"
                    : "Mahibere Silassie — Supporting Sebeta Wata Kidist Silassie We'Abune Aregawi Church"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={isAm ? "የፓሪሽ ስም" : "Parish Name"} value={formData.parish} onChange={(v) => update("parish", v)} />
                <InputField label={isAm ? "የንስሐ አባት" : "Confession Father (የንስሐ አባት)"} value={formData.confessionFather} onChange={(v) => update("confessionFather", v)} />
                <InputField label={isAm ? "ሰንበት ትምህርት ቤት" : "Sunday School"} value={formData.sundaySchool} onChange={(v) => update("sundaySchool", v)} />
                <InputField label={isAm ? "የአገልግሎት ክፍል" : "Service Area"} value={formData.serviceArea} onChange={(v) => update("serviceArea", v)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <SectionTitle icon={AlertTriangle} text={isAm ? "የድንገተኛ ጊዜ ግንኙነት" : "Emergency Contact"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label={isAm ? "የግንኙነት ስም" : "Contact Name"} value={formData.emergencyContactName} onChange={(v) => update("emergencyContactName", v)} />
                <InputField label={isAm ? "የግንኙነት ስልክ" : "Contact Phone"} value={formData.emergencyContactPhone} onChange={(v) => update("emergencyContactPhone", v)} />
                <InputField label={isAm ? "ዝምድና" : "Relationship"} value={formData.emergencyContactRelation} onChange={(v) => update("emergencyContactRelation", v)} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-sand/50">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-sand text-slate-light font-medium hover:bg-linen transition">
                <ChevronLeft className="w-4 h-4" />
                {isAm ? "ቀድሞ" : "Previous"}
              </button>
            ) : <div />}

            {step < steps.length - 1 ? (
              <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="flex items-center gap-2 gradient-wine text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40 shadow-md">
                {isAm ? "ቀጣይ" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 gradient-amber text-wine-dark px-8 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md">
                {loading ? <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isAm ? "ያስገቡ" : "Submit Registration"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <h2 className="text-lg font-bold text-slate flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg gradient-wine flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      {text}
    </h2>
  );
}

function InputField({ label, value, onChange, type = "text", required = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full px-4 py-3 border border-sand rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition text-sm bg-ivory/50" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <ClientShell>
      <RegistrationForm />
    </ClientShell>
  );
}
