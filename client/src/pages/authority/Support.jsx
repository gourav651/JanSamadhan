import { useState } from "react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import axios from "../../lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { Search } from "lucide-react";
import { BookOpen, AlertCircle, ShieldCheck } from "lucide-react";
import { ArrowRight, Phone, Bot, Ticket } from "lucide-react";

const AuthoritySupport = () => {
  const [search, setSearch] = useState("");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [slaStatus] = useState("Healthy");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");

  const { getToken } = useAuth();

  const submitTicket = async () => {
    if (!ticketTitle || !ticketDesc) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = await getToken();
      await axios.post(
        "/api/support/tickets",
        { title: ticketTitle, description: ticketDesc, priority: "MEDIUM" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Support ticket submitted successfully");
      setShowTicketModal(false);
      setTicketTitle("");
      setTicketDesc("");
    } catch (err) {
      alert("Failed to submit ticket");
    }
  };

  const supportItems = [
    {
      id: 1,
      title: "Self-Service Documentation",
      icon: BookOpen, // Replaces "menu_book"
      keywords: ["manual", "docs", "faq", "documentation"],
    },
    {
      id: 2,
      title: "Technical Support & Reporting",
      icon: AlertCircle, // Replaces "report_problem"
      keywords: ["bug", "error", "ticket", "support"],
    },
    {
      id: 3,
      title: "Escalation & Administrative Help",
      icon: ShieldCheck, // Replaces "shield_person"
      keywords: ["admin", "escalation", "permission"],
    },
  ];

  const filteredItems = search
    ? supportItems.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.keywords.some((k) =>
            k.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : supportItems;

  return (
    <AuthorityLayout>
      <main className="flex-1 overflow-y-auto bg-[#0a0f1d] text-slate-300">
        {/* HEADER SECTION - Upgraded with backdrop blur and accent glow */}
        <header className="bg-[#111827]/80 backdrop-blur-xl border-b border-white/5 px-10 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-white text-3xl font-bold tracking-tight flex items-center gap-3">
                Support & Resource Center
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Official portal for technical assistance and administrative
                documentation.
              </p>
            </div>

            <div className="relative w-full max-w-sm">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors duration-300" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documentation or FAQs..."
                className="w-full bg-[#0d1424] border border-white/10 pl-10 pr-4 py-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-white"
              />
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-10 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Support Channels */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                Available Channels
              </h3>

              {filteredItems.map((item) => (
                <SupportCard
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  desc={
                    item.id === 1
                      ? "Access comprehensive user manuals, standard operating procedures, and video tutorials for platform features."
                      : item.id === 2
                        ? "Encountering system errors or login issues? Raise an official IT ticket or report platform bugs."
                        : "For cross-departmental coordination, account permission overrides, or urgent administrative policy inquiries."
                  }
                >
                  {item.id === 1 && (
                    <>
                      <LinkButton
                        text="User Manuals"
                        onClick={() =>
                          window.open(
                            "/docs/authority-user-manual.pdf",
                            "_blank",
                          )
                        }
                      />
                      <LinkButton
                        text="View FAQs"
                        onClick={() =>
                          window.open("/docs/authority-faqs.pdf", "_blank")
                        }
                      />
                    </>
                  )}
                  {item.id === 2 && (
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-5 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 uppercase tracking-wider cursor-pointer"
                    >
                      Raise IT Ticket
                    </button>
                  )}
                  {item.id === 3 && (
                    <LinkButton
                      text="Contact Administrator"
                      onClick={() =>
                        (window.location.href =
                          "mailto:gouravmanjhi9313@gmail.com?subject=Administrative Escalation&body=Authority ID:")
                      }
                    />
                  )}
                </SupportCard>
              ))}
            </div>

            {/* RIGHT COLUMN: Quick Contact & Stats */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                Quick Contact
              </h3>

              {/* AI CHAT & HOTLINE CARD */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Immediate Assistance
                  </h4>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Need instant answers? Our AI-powered assistant is trained on
                    government protocols.
                  </p>

                  <button
                    onClick={() => alert("AI Assistant will be enabled soon")}
                    className="w-full bg-[#1e293b] hover:bg-[#334155] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/5"
                  >
                    <Bot size={20} className="text-primary" />
                    Launch AI Chat
                  </button>

                  <div className="border-t border-white/5 mt-8 pt-6">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter mb-2">
                      Support Hotline
                    </p>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-500" />
                      </div>
                      <a
                        href="tel:18004567890"
                        className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                      >
                        1800-456-7890
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-3 italic">
                      Available 24/7 for Authorized Personnel Only
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/5">
                  <span className="text-[11px] text-slate-500 font-medium">
                    SLA Monitor
                  </span>
                  <span className="text-emerald-500 text-[11px] font-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    {slaStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* SERVICE HOURS CARD */}
              <div className="bg-[#111827]/50 border border-white/5 rounded-2xl p-6">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Operations Window
                </h5>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-xs text-slate-400">Tech Support</span>
                    <span className="text-xs font-bold text-white bg-blue-500/10 px-2 py-1 rounded">
                      24/7
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Admin Node</span>
                    <span className="text-xs font-bold text-white">
                      09:00 — 18:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER - Placed inside main, but at the bottom */}
        <footer className="mt-auto pt-12 pb-8 border-t border-white/5 px-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            {/* BRANDING */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-[11px] font-black text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                J
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                Jan<span className="text-blue-500">Samadhan</span>
              </span>
            </div>

            {/* COPYRIGHT */}
            <p className="text-[10px] font-bold tracking-[0.15em] text-slate-600 text-center md:text-left">
              © {new Date().getFullYear()} JanSamadhan Platform • Secure
              Authority Node
            </p>

            {/* LINKS */}
            <div className="flex gap-8">
              <button className="text-[10px] text-slate-500 hover:text-blue-400 transition-all uppercase font-black tracking-widest">
                Privacy Protocol
              </button>
              <button className="text-[10px] text-slate-500 hover:text-blue-400 transition-all uppercase font-black tracking-widest">
                System Support
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* MODAL - Enhanced with Backdrop Blur and Dark Accents */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket size={20} className="text-white" />
                Raise IT Ticket
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <input
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                className="w-full bg-[#0a0f1d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
              />
              <textarea
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder="Please describe the technical error in detail..."
                className="w-full bg-[#0a0f1d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none h-32 resize-none"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTicket}
                  disabled={!ticketTitle || !ticketDesc}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-30 hover:bg-blue-500 transition-all active:scale-95"
                >
                  Submit Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthorityLayout>
  );
};

/* ---------- UI COMPONENTS ---------- */

const SupportCard = ({ icon: Icon, title, desc, children }) => (
  <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex gap-6 hover:border-blue-500/30 transition-all shadow-lg group">
    <div className="w-14 h-14 flex items-center justify-center bg-[#0d1424] rounded-xl border border-white/5 shrink-0 group-hover:bg-blue-500/10 transition-colors">
      {/* Render the component directly */}
      <Icon className="text-blue-500 w-7 h-7 group-hover:scale-110 transition-transform" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
      <p className="text-sm text-slate-500 mb-5 leading-relaxed">{desc}</p>
      <div className="flex gap-5 items-center">{children}</div>
    </div>
  </div>
);

const LinkButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="text-[11px] font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-all uppercase tracking-wider group"
  >
    {text}
    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
  </button>
);

export default AuthoritySupport;
