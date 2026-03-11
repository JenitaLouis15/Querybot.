import { useState, useRef, useEffect } from "react";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
];

const SESSION_ID = `session_${Date.now()}`;
const BOT_WELCOME = "Hello! I'm FABAEU, your AI Learning Assistant. Ask me anything — I'm here to help you learn and grow. ✨";
const API_BASE = "";

const SUGGESTIONS = [
  "Explain quantum computing",
  "How does the brain learn?",
  "What is machine learning?",
  "Teach me about black holes",
];

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: BOT_WELCOME, time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || typing) return;
    setShowSuggestions(false);
    setSidebarOpen(false);

    const userMsg = { id: Date.now(), sender: "user", text: text.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setMsgCount((c) => c + 1);
    setInput("");
    setTyping(true);
    inputRef.current?.focus();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, sessionId: SESSION_ID }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: res.ok ? data.reply : `⚠️ ${data.error || "Something went wrong."}`,
        time: new Date(),
        isError: !res.ok,
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: "⚠️ Something went wrong. Please try again.",
        time: new Date(),
        isError: true,
      }]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = async () => {
    setMessages([{ id: 1, sender: "bot", text: BOT_WELCOME, time: new Date() }]);
    setMsgCount(0);
    setShowSuggestions(true);
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --gold: #c9a84c;
          --gold-dim: rgba(201,168,76,0.15);
          --gold-glow: rgba(201,168,76,0.35);
          --white: #f5f0e8;
          --red: #e05252;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: 'DM Mono', monospace; background: #000; }

        .bg {
          position: fixed; inset: 0; z-index: 0;
          background-size: cover; background-position: center;
          filter: brightness(0.38) saturate(0.7);
          transition: background-image 1s ease;
        }
        .bg-vignette {
          position: fixed; inset: 0; z-index: 1;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.85) 100%);
          pointer-events: none;
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 2; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
        }

        .root {
          position: relative; z-index: 10;
          height: 100vh; height: 100dvh;
          display: flex; flex-direction: column;
          color: var(--white); overflow: hidden;
        }

        /* ── HEADER ── */
        .header {
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(201,168,76,0.2);
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(24px);
          gap: 12px;
        }

        .header-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .logo-mark {
          width: 36px; height: 36px;
          border: 1px solid var(--gold); border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: var(--gold);
          box-shadow: 0 0 12px var(--gold-glow), inset 0 0 10px var(--gold-dim);
          animation: breathe 3s ease-in-out infinite;
          flex-shrink: 0; position: relative;
        }
        .logo-mark::before, .logo-mark::after {
          content: ''; position: absolute;
          width: 5px; height: 5px;
          border: 1px solid var(--gold); border-radius: 50%;
        }
        .logo-mark::before { top: -3px; left: -3px; }
        .logo-mark::after  { bottom: -3px; right: -3px; }
        @keyframes breathe {
          0%,100% { box-shadow: 0 0 12px var(--gold-glow), inset 0 0 10px var(--gold-dim); }
          50%      { box-shadow: 0 0 24px var(--gold-glow), inset 0 0 18px var(--gold-dim); }
        }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600;
          letter-spacing: 5px; text-transform: uppercase;
          color: var(--white); line-height: 1;
        }
        .brand-tagline {
          font-size: 8px; letter-spacing: 2.5px;
          color: var(--gold); text-transform: uppercase;
          margin-top: 2px; opacity: 0.75;
        }

        .header-center {
          display: flex; flex-direction: column; align-items: center;
          gap: 2px; flex: 1;
        }
        @media (max-width: 480px) { .header-center { display: none; } }

        .live-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 8px; letter-spacing: 2px; text-transform: uppercase;
          color: #4ade80;
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 6px #4ade80;
          animation: livepulse 1.6s ease-in-out infinite;
        }
        @keyframes livepulse {
          0%,100% { transform: scale(1); opacity:1; }
          50% { transform: scale(1.5); opacity:0.5; }
        }
        .session-id { font-size: 8px; color: rgba(245,240,232,0.18); letter-spacing: 1px; }

        .header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        .msg-counter {
          font-size: 9px; letter-spacing: 1.5px;
          color: var(--gold); border: 1px solid rgba(201,168,76,0.2);
          padding: 3px 8px; border-radius: 2px; opacity: 0.7;
          white-space: nowrap;
        }
        @media (max-width: 380px) { .msg-counter { display: none; } }

        .bg-switcher { display: flex; gap: 5px; }
        .bg-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.35);
          cursor: pointer; transition: all 0.2s;
          background: rgba(201,168,76,0.08);
        }
        .bg-dot:hover { border-color: var(--gold); }
        .bg-dot.active { background: var(--gold); border-color: var(--gold); box-shadow: 0 0 8px var(--gold-glow); }

        .menu-btn {
          font-family: 'DM Mono', monospace;
          font-size: 16px; color: rgba(245,240,232,0.5);
          background: transparent;
          border: 1px solid rgba(245,240,232,0.1);
          width: 32px; height: 32px;
          border-radius: 2px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .menu-btn:hover { border-color: var(--gold); color: var(--gold); }

        /* ── BODY ── */
        .body { flex: 1; min-height: 0; display: flex; position: relative; overflow: hidden; }

        /* ── SIDEBAR — slides in as overlay on mobile ── */
        .sidebar-overlay {
          display: none;
          position: absolute; inset: 0; z-index: 30;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
        }
        .sidebar-overlay.open { display: block; }

        .sidebar {
          position: absolute; top: 0; left: 0; bottom: 0;
          width: 260px; z-index: 31;
          border-right: 1px solid rgba(201,168,76,0.15);
          background: rgba(5,5,15,0.97);
          backdrop-filter: blur(24px);
          display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(.22,1,.36,1);
        }
        .sidebar.open { transform: translateX(0); }

        /* On large screens sidebar is always visible inline */
        @media (min-width: 768px) {
          .sidebar-overlay { display: none !important; }
          .sidebar {
            position: relative;
            transform: translateX(0) !important;
            width: 220px; flex-shrink: 0;
          }
          .sidebar.closed-desktop { transform: translateX(-100%); width: 0; overflow: hidden; }
          .menu-btn { display: flex; }
        }

        .sidebar-inner {
          flex: 1; overflow-y: auto;
          display: flex; flex-direction: column;
          padding: 20px 0;
        }
        .sidebar-inner::-webkit-scrollbar { width: 0; }

        .sidebar-section { padding: 0 18px 18px; }
        .sidebar-label {
          font-size: 7px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--gold); opacity: 0.45; margin-bottom: 10px;
        }
        .stat-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.04);
        }
        .stat-key { font-size: 11px; color: rgba(245,240,232,0.3); }
        .stat-val { font-size: 11px; color: var(--gold); font-weight: 400; }

        .divider {
          height: 1px; margin: 2px 18px 18px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.12), transparent);
        }

        .prompt-label {
          font-size: 7px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(245,240,232,0.2); margin-bottom: 6px; padding: 0 18px;
        }
        .suggestion-item {
          font-size: 11px; color: rgba(245,240,232,0.35);
          padding: 10px 18px; cursor: pointer;
          border-left: 2px solid transparent;
          transition: all 0.18s; line-height: 1.4;
        }
        .suggestion-item:hover {
          color: var(--white); border-left-color: var(--gold);
          background: rgba(201,168,76,0.05);
        }

        .sidebar-footer {
          margin-top: auto; padding: 16px 18px;
          border-top: 1px solid rgba(201,168,76,0.07);
        }
        .sidebar-footer p {
          font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase;
          color: rgba(245,240,232,0.13); line-height: 2;
        }

        /* ── CHAT PANEL ── */
        .chat-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }

        .chat-scroll {
          flex: 1; min-height: 0;
          overflow-y: auto; overflow-x: hidden;
          padding: 24px 20px 16px;
          display: flex; flex-direction: column; gap: 22px;
        }
        @media (min-width: 768px) {
          .chat-scroll { padding: 32px 48px 20px; }
        }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }

        .date-divider {
          display: flex; align-items: center; gap: 12px;
          font-size: 8px; letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(245,240,232,0.15); flex-shrink: 0;
        }
        .date-divider::before, .date-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,240,232,0.07), transparent);
        }

        .msg-row {
          display: flex; flex-direction: column; gap: 5px;
          animation: msgIn 0.38s cubic-bezier(.22,1,.36,1) both;
          width: 100%;
        }
        .msg-row.user { align-items: flex-end; }
        .msg-row.bot  { align-items: flex-start; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .bot-row { display: flex; align-items: flex-start; gap: 10px; width: 100%; }

        .avatar {
          width: 32px; height: 32px; flex-shrink: 0;
          border: 1px solid rgba(201,168,76,0.35); border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: var(--gold);
          background: rgba(201,168,76,0.05);
          box-shadow: 0 0 10px rgba(201,168,76,0.12);
          margin-top: 2px;
        }

        .msg-content { flex: 1; min-width: 0; }

        .msg-meta {
          font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(245,240,232,0.2); margin-bottom: 5px;
          display: flex; align-items: center; gap: 8px;
        }
        .msg-meta .sender { color: var(--gold); opacity: 0.65; }

        .bubble {
          padding: 14px 18px;
          font-size: 14px; line-height: 1.78;
          font-weight: 300; letter-spacing: 0.2px;
          white-space: pre-wrap; word-break: break-word;
          position: relative;
          max-width: min(680px, 90%);
        }
        @media (max-width: 480px) {
          .bubble { font-size: 13.5px; padding: 12px 15px; max-width: 92%; }
        }

        .bot-bubble {
          background: rgba(4,6,20,0.6);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 0 10px 10px 10px;
          color: rgba(245,240,232,0.85);
          backdrop-filter: blur(14px);
        }
        .bot-bubble::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent 60%);
          opacity: 0.35; border-radius: 0 10px 0 0;
        }

        .user-bubble {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 10px 0 10px 10px;
          color: var(--white);
          backdrop-filter: blur(14px);
        }
        .user-bubble::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(270deg, var(--gold), transparent 60%);
          opacity: 0.25;
        }

        .error-bubble {
          border-color: rgba(224,82,82,0.28) !important;
          background: rgba(224,82,82,0.05) !important;
          color: rgba(255,180,180,0.8) !important;
        }

        .typing-row { display: flex; align-items: flex-start; gap: 10px; animation: msgIn 0.3s ease; }
        .typing-bubble {
          background: rgba(4,6,20,0.6);
          border: 1px solid rgba(201,168,76,0.12);
          border-radius: 0 10px 10px 10px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 6px;
          backdrop-filter: blur(14px);
        }
        .tdot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold); opacity: 0.4;
          animation: tdot 1.4s infinite ease-in-out;
        }
        .tdot:nth-child(2) { animation-delay: 0.2s; }
        .tdot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes tdot {
          0%,80%,100% { transform: scale(1); opacity: 0.3; }
          40% { transform: scale(1.6); opacity: 1; }
        }

        /* ── CHIPS ── */
        .chips-wrap {
          flex-shrink: 0;
          padding: 0 20px 12px;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        @media (min-width: 768px) { .chips-wrap { padding: 0 48px 14px; } }

        .chip {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: rgba(245,240,232,0.32);
          border: 1px solid rgba(201,168,76,0.14);
          padding: 7px 14px; border-radius: 2px;
          cursor: pointer; transition: all 0.2s;
          background: rgba(201,168,76,0.03);
          animation: chipIn 0.5s ease both;
        }
        .chip:nth-child(2) { animation-delay: 0.06s; }
        .chip:nth-child(3) { animation-delay: 0.12s; }
        .chip:nth-child(4) { animation-delay: 0.18s; }
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chip:hover { color: var(--gold); border-color: rgba(201,168,76,0.38); background: rgba(201,168,76,0.07); }

        /* ── INPUT BAR ── */
        .input-bar {
          flex-shrink: 0;
          padding: 10px 20px 16px;
          border-top: 1px solid rgba(201,168,76,0.1);
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(24px);
        }
        @media (min-width: 768px) { .input-bar { padding: 14px 48px 20px; } }

        .input-row {
          display: flex; align-items: center;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 3px;
          background: rgba(201,168,76,0.025);
          transition: border-color 0.25s, box-shadow 0.25s;
          position: relative; overflow: hidden;
        }
        .input-row::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .input-row:focus-within { border-color: rgba(201,168,76,0.42); box-shadow: 0 0 20px rgba(201,168,76,0.07); }
        .input-row:focus-within::before { opacity: 1; }

        .input-prompt {
          font-size: 15px; color: var(--gold); opacity: 0.45;
          padding: 0 12px 0 16px; flex-shrink: 0;
        }

        .chat-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'DM Mono', monospace;
          font-size: 14px; font-weight: 300; letter-spacing: 0.3px;
          color: var(--white); caret-color: var(--gold);
          padding: 15px 0;
          min-width: 0;
        }
        .chat-input::placeholder { color: rgba(245,240,232,0.18); }

        .send-btn {
          height: 100%; min-height: 50px; padding: 0 18px;
          background: transparent;
          border: none; border-left: 1px solid rgba(201,168,76,0.12);
          cursor: pointer; color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .send-btn:hover { background: rgba(201,168,76,0.07); }
        .send-btn:disabled { opacity: 0.18; cursor: not-allowed; }

        .input-meta {
          display: flex; justify-content: space-between;
          margin-top: 7px; padding: 0 2px;
        }
        .input-hint { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(245,240,232,0.12); }
        .char-count { font-size: 9px; color: rgba(201,168,76,0.25); }
      `}</style>

      <div className="bg" style={{ backgroundImage: `url('${BG_IMAGES[bgIndex]}')` }} />
      <div className="bg-vignette" />
      <div className="scanlines" />

      <div className="root">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <div className="logo-mark">✦</div>
            <div>
              <div className="brand-name">FABAEU</div>
              <div className="brand-tagline">Intelligence Platform</div>
            </div>
          </div>

          <div className="header-center">
            <div className="live-badge"><span className="live-dot" />System Online</div>
            <div className="session-id">SID · {SESSION_ID.slice(-8).toUpperCase()}</div>
          </div>

          <div className="header-right">
            <div className="msg-counter">{msgCount} msg{msgCount !== 1 ? "s" : ""}</div>
            <div className="bg-switcher">
              {BG_IMAGES.map((_, i) => (
                <div key={i} className={`bg-dot ${bgIndex === i ? "active" : ""}`} onClick={() => setBgIndex(i)} />
              ))}
            </div>
            <button className="menu-btn" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <button className="clear-btn" style={{fontSize:"9px",letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(245,240,232,0.35)",background:"transparent",border:"1px solid rgba(245,240,232,0.1)",padding:"5px 10px",borderRadius:"2px",cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all 0.2s"}} onClick={clearChat}>✕</button>
          </div>
        </div>

        {/* BODY */}
        <div className="body">
          {/* Mobile overlay */}
          <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* SIDEBAR */}
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="sidebar-inner">
              <div className="sidebar-section">
                <div className="sidebar-label">Session Stats</div>
                <div className="stat-row"><span className="stat-key">Messages</span><span className="stat-val">{msgCount}</span></div>
                <div className="stat-row"><span className="stat-key">Model</span><span className="stat-val">Llama 3.3</span></div>
                <div className="stat-row"><span className="stat-key">Engine</span><span className="stat-val">Groq</span></div>
                <div className="stat-row"><span className="stat-key">Status</span><span className="stat-val" style={{color:"#4ade80"}}>● Active</span></div>
              </div>

              <div className="divider" />

              <div className="prompt-label">Quick Prompts</div>
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="suggestion-item" onClick={() => sendMessage(s)}>→ {s}</div>
              ))}

              <div className="sidebar-footer">
                <p>FABAEU AI v2.0<br />Powered by Groq<br />© 2025 FABAEU</p>
              </div>
            </div>
          </div>

          {/* CHAT PANEL */}
          <div className="chat-panel">
            <div className="chat-scroll" ref={scrollRef}>
              <div className="date-divider">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`msg-row ${msg.sender}`}>
                  {msg.sender === "bot" ? (
                    <div className="bot-row">
                      <div className="avatar">✦</div>
                      <div className="msg-content">
                        <div className="msg-meta"><span className="sender">FABAEU</span>{formatTime(msg.time)}</div>
                        <div className={`bubble bot-bubble ${msg.isError ? "error-bubble" : ""}`}>{msg.text}</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="msg-meta"><span className="sender">YOU</span>{formatTime(msg.time)}</div>
                      <div className="bubble user-bubble">{msg.text}</div>
                    </>
                  )}
                </div>
              ))}

              {typing && (
                <div className="typing-row">
                  <div className="avatar">✦</div>
                  <div className="typing-bubble">
                    <div className="tdot"/><div className="tdot"/><div className="tdot"/>
                  </div>
                </div>
              )}
            </div>

            {showSuggestions && (
              <div className="chips-wrap">
                {SUGGESTIONS.map((s, i) => (
                  <div key={i} className="chip" onClick={() => sendMessage(s)}>{s}</div>
                ))}
              </div>
            )}

            <div className="input-bar">
              <div className="input-row">
                <span className="input-prompt">›</span>
                <input
                  ref={inputRef}
                  className="chat-input"
                  placeholder="Ask FABAEU anything…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                />
                <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || typing}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              <div className="input-meta">
                <span className="input-hint">↵ Enter to send</span>
                <span className="char-count">{input.length} / 2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
