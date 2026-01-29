import { useState } from "react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import axios from "../../lib/axios";
import { useAuth } from "@clerk/clerk-react";

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
        {
          title: ticketTitle,
          description: ticketDesc,
          priority: "MEDIUM",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      keywords: ["manual", "docs", "faq", "documentation"],
    },
    {
      id: 2,
      title: "Technical Support & Reporting",
      keywords: ["bug", "error", "ticket", "support"],
    },
    {
      id: 3,
      title: "Escalation & Administrative Help",
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
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-10 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-slate-900 text-2xl font-extrabold tracking-tight">
                Support & Resource Center
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Official portal for technical assistance and administrative
                documentation.
              </p>
            </div>

            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documentation or FAQs..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200"
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-10 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Support Channels
              </h3>

              {filteredItems.map((item) => {
                if (item.id === 1)
                  return (
                    <SupportCard
                      key={item.id}
                      icon="menu_book"
                      title="Self-Service Documentation"
                      desc="Access comprehensive user manuals, standard operating procedures, and video tutorials for platform features."
                    >
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
                    </SupportCard>
                  );

                if (item.id === 2)
                  return (
                    <SupportCard
                      key={item.id}
                      icon="report_problem"
                      title="Technical Support & Reporting"
                      desc="Encountering system errors or login issues? Raise an official IT ticket or report platform bugs."
                    >
                      <button
                        onClick={() => setShowTicketModal(true)}
                        className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
                      >
                        Raise IT Ticket
                      </button>
                    </SupportCard>
                  );

                if (item.id === 3)
                  return (
                    <SupportCard
                      key={item.id}
                      icon="shield_person"
                      title="Escalation & Administrative Help"
                      desc="For cross-departmental coordination, account permission overrides, or urgent administrative policy inquiries."
                    >
                      <LinkButton
                        text="Contact Administrator"
                        onClick={() =>
                          (window.location.href =
                            "mailto:gouravmanjhi9313@gmail.com?subject=Administrative Escalation - JanSamadhan&body=Authority ID:%0D%0AName:%0D%0ADepartment:%0D%0ARequest Details:")
                        }
                      />
                    </SupportCard>
                  );
              })}
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Quick Contact
              </h3>

              {/* QUICK CONTACT */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 mb-2">
                    Immediate Assistance
                  </h4>
                  <p className="text-xs text-slate-500 mb-6">
                    Need instant answers? Our AI-powered assistant is trained on
                    government protocols.
                  </p>

                  <button
                    onClick={() => alert("AI Assistant will be enabled soon")}
                    className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">smart_toy</span>
                    Launch AI Chat
                  </button>

                  <div className="border-t border-slate-100 mt-6 pt-5">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Support Hotline
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-blue-700">
                        call
                      </span>
                      <a
                        href="tel:18004567890"
                        className="text-xl font-bold hover:underline"
                      >
                        1800-456-7890
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Available 24/7 for Authorized Personnel Only
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">SLA Status</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {slaStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* SERVICE HOURS */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-5">
                <h5 className="text-xs font-bold uppercase mb-3">
                  Service Hours
                </h5>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex justify-between">
                    <span>Tech Support</span>
                    <span className="font-bold">24/7</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Admin Help</span>
                    <span className="font-bold">09:00 - 18:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          {/* <div className="mt-16 text-center border-t border-slate-200 pt-10">
            <p className="text-slate-500 text-sm">
              Can't find what you're looking for?
            </p>
            <div className="mt-4 flex justify-center gap-4 text-sm font-bold text-blue-700">
              <button onClick={() => alert("Knowledge Base coming soon")}>
                Explore Knowledge Base
              </button>

              <button onClick={() => alert("System status page coming soon")}>
                View System Status
              </button>

              <button onClick={() => alert("Feedback form coming soon")}>
                Submit Feedback
              </button>
            </div>
          </div> */}
        </div>
      </main>

      {showTicketModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 space-y-4">
            <h3 className="text-lg font-bold">Raise IT Ticket</h3>

            <input
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              placeholder="Issue Title"
              className="w-full border rounded-lg px-3 py-2"
            />

            <textarea
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              placeholder="Describe the issue"
              className="w-full border rounded-lg px-3 py-2 h-24"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTicketModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitTicket}
                disabled={!ticketTitle || !ticketDesc}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthorityLayout>
  );
};

export default AuthoritySupport;

/* ---------- SMALL COMPONENTS ---------- */

const SupportCard = ({ icon, title, desc, children }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-6 flex gap-6 hover:shadow-md transition">
    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-lg border shrink-0">
      <span className="material-symbols-outlined text-blue-700">{icon}</span>
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-sm text-slate-500 mb-4">{desc}</p>
      <div className="flex gap-3 items-center">{children}</div>
    </div>
  </div>
);

const LinkButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="text-xs font-semibold text-blue-700 flex items-center gap-1 hover:underline"
  >
    {text}
    <span className="material-symbols-outlined text-xs">arrow_forward</span>
  </button>
);
