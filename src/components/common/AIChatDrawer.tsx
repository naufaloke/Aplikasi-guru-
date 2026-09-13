import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  Copy,
  Check,
  FileDown,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { AIService } from "../../services/ai";
import { ExportService } from "../../services/pdf";

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent?: (text: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AIChatDrawer = ({ isOpen, onClose }: AIChatDrawerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: `Halo Bapak/Ibu Guru Hebat! 🌟\n\nSaya **Guru AI Indonesia**, asisten digital spesialis Kurikulum Merdeka dan Pembelajaran Mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan).\n\nAda yang bisa saya bantu buatkan hari ini? Silakan klik tombol pintas di bawah atau ketik langsung permintaan Anda!`,
      timestamp: "07:30",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickPrompts = [
    "Buatkan Modul Ajar IPAS Kelas 4 Bagian Tubuh Tumbuhan",
    "Buatkan 5 Soal HOTS Matematika Pecahan Kelas 4 SD",
    "Rancang Ice Breaking 5 menit untuk memulai kelas pagi yang ceria",
    "Buatkan Draft Surat Undangan Rapat Orang Tua Pembagian Rapor",
    "Tuliskan Rubrik Penilaian Proyek P5 Bertema Gaya Hidup Berkelanjutan",
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text,
      }));
      chatHistory.push({ role: "user", content: textToSend });

      const aiResponse = await AIService.chat(chatHistory);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadWord = (text: string) => {
    ExportService.exportToWord("Hasil_Guru_AI", text, "Dokumen_Guru_AI.doc");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl flex flex-col transition-all">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-emerald-50/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Asisten AI Guru SD</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Siap Menemani Administrasi Anda
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all shrink-0"
          >
            {q.length > 28 ? q.slice(0, 28) + "..." : q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 rounded-br-none"
                  : "bg-slate-100/90 text-slate-800 border border-slate-200/60 rounded-bl-none shadow-xs"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>

            {/* Message Action Footer */}
            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
              <span>{m.timestamp}</span>
              {m.sender === "ai" && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="hover:text-blue-600 flex items-center gap-1 transition-colors"
                    title="Salin teks"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === m.id ? "Tersalin!" : "Salin"}</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleDownloadWord(m.text)}
                    className="hover:text-blue-600 flex items-center gap-1 transition-colors"
                    title="Unduh sebagai file Word (.doc)"
                  >
                    <FileDown className="w-3 h-3" />
                    <span>Word</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-2xl w-fit text-xs text-slate-600">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Guru AI sedang menyusun dokumen terbaik untuk Anda...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan apa saja atau minta dibuatkan modul ajar..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-100 focus:bg-white text-slate-800 rounded-xl border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
