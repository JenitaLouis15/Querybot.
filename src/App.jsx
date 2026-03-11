import { useState, useRef, useEffect } from "react";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
];

const SESSION_ID = `session_${Date.now()}`;
const BOT_WELCOME = "Hello! I'm FABAEU, your AI Learning Assistant. Ask me anything — I'm here to help you learn and grow. ✨";

// ✅ No more localhost — works on Vercel automatically
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

    const userMsg = { id: Date.now(), sender: "user", text: text.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setMsgCount((c) => c + 1);
    setInput("");
    setTyping(true);
    inputRef.current?.focus();

    try {
      // ✅ Now calls /api/chat — works both locally and on Vercel
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
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --gold: #c9a84c;
          --gold-dim: rgba(201,168,76,0.15);
          --gold-glow: rgba(201,168,76,0.35);
          --white: #f5f0e8;
          --white-dim: rgba(245,240,232,0.12);
          --white-faint: rgba(245,240,232,0.05);
          --red: #e05252;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Mono', monospace;
          background: #000;
          cursor: crosshair;
        }

        .root {
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          color: var(--white);
        }

        .bg {
          position: fixed; inset: 0; z-index: 0;
          background-size: cover; background-position: center;
          transition: opacity 1s ease;
          filter: brightness(0.38) saturate(0.7);
        }

        .bg-vignette {
          position: fixed; inset: 0; z-index: 1;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.85) 100%);
        }

        .scanlines {
          position: fixed; inset: 0; z-index: 2;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
        }

        .header {
          position: relative; z-index: 20;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 18px 32px;
          border-bottom: 1px solid rgba(201,168,76,0.2);
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(24px);
          flex-shrink: 0;
        }

        .header-left { display: flex; align-items: center; gap: 16px; }

        .logo-mark {
          width: 38px; height: 38px;
          border: 1px solid var(--gold);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--gold);
          position: relative;
          box-shadow: 0 0 12px var(--gold-glow), inset 0 0 12px var(--gold-dim);
          animation: logo-breathe 3s ease-in-out infinite;
        }

        @keyframes logo-breathe {
          0%, 100% { box-shadow: 0 0 12px var(--gold-glow), inset 0 0 12px var(--gold-dim); }
          50% { box-shadow: 0 0 24px var(--gold-glow), inset 0 0 20px var(--gold-dim); }
        }

        .logo-mark::before, .logo-mark::after {
          content: ''; position: absolute;
          width: 6px; height: 6px;
          border: 1px solid var(--gold); border-radius: 50%;
        }
        .logo-mark::before { top: -4px; left: -4px; }
        .logo-mark::after  { bottom: -4px; right: -4px; }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          letter-spacing: 6px; text-transform: uppercase;
          color: var(--white); line-height: 1;
        }
        .brand-tagline {
          font-size: 9px; letter-spacing: 3px;
          color: var(--gold); text-transform: uppercase;
          margin-top: 3px; opacity: 0.8;
        }

        .header-center { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .live-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: #4ade80; opacity: 0.85;
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #4ade80;
          animation: live-pulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 6px #4ade80;
        }
        @keyframes live-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .session-id { font-size: 8px; color: rgba(245,240,232,0.2); letter-spacing: 1px; }

        .header-right { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }

        .msg-counter {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--gold); opacity: 0.6;
          border: 1px solid rgba(201,168,76,0.2);
          padding: 4px 10px; border-radius: 2px;
        }

        .bg-switcher { display: flex; gap: 6px; }
        .bg-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.4);
          cursor: pointer; transition: all 0.2s;
          background: rgba(201,168,76,0.1);
        }
        .bg-dot:hover { border-color: var(--gold); background: rgba(201,168,76,0.3); }
        .bg-dot.active { background: var(--gold); border-color: var(--gold); box-shadow: 0 0 8px var(--gold-glow); }

        .clear-btn {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(245,240,232,0.35);
          background: transparent;
          border: 1px solid rgba(245,240,232,0.1);
          padding: 6px 14px; border-radius: 2px;
          cursor: pointer; transition: all 0.25s;
        }
        .clear-btn:hover { border-color: var(--red); color: var(--red); box-shadow: 0 0 10px rgba(224,82,82,0.2); }

        .body { flex: 1; min-height: 0; display: flex; position: relative; z-index: 10; }

        .sidebar {
          width: 220px; flex-shrink: 0;
          border-right: 1px solid rgba(201,168,76,0.12);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(20px);
          display: flex; flex-direction: column;
          padding: 24px 0;
        }

        .sidebar-section { padding: 0 20px 20px; }
        .sidebar-label {
          font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--gold); opacity: 0.5; margin-bottom: 12px;
        }
        .stat-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid rgba(245,240,232,0.04);
        }
        .stat-label { font-size: 10px; color: rgba(245,240,232,0.3); letter-spacing: 0.5px; }
        .stat-val { font-size: 11px; color: var(--gold); }

        .sidebar-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent);
          margin: 4px 20px 20px;
        }

        .suggestion-label {
          font-size: 8px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(245,240,232,0.25); margin-bottom: 10px; padding: 0 20px;
        }

        .suggestion-item {
          font-family: 'DM Mono', monospace;
          font-size: 10px; line-height: 1.5;
          color: rgba(245,240,232,0.35);
          padding: 8px 20px; cursor: pointer;
          border-left: 2px solid transparent;
          transition: all 0.2s; letter-spacing: 0.3px;
        }
        .suggestion-item:hover {
          color: var(--white); border-left-color: var(--gold);
          background: rgba(201,168,76,0.05);
        }

        .sidebar-footer {
          margin-top: auto; padding: 20px;
          border-top: 1px solid rgba(201,168,76,0.08);
        }
        .sidebar-footer-text {
          font-size: 8px; letter-spacing: 1.5px;
          color: rgba(245,240,232,0.15); text-transform: uppercase; line-height: 1.8;
        }

        .chat-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; }

        .chat-scroll {
          flex: 1; min-height: 0; overflow-y: auto;
          padding: 28px 48px 20px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 3px; }

        .date-divider {
          display: flex; align-items: center; gap: 16px;
          font-size: 8px; letter-spacing: 3px;
          color: rgba(245,240,232,0.18); text-transform: uppercase;
        }
        .date-divider::before, .date-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,240,232,0.08), transparent);
        }

        .msg-row {
          display: flex; flex-direction: column; gap: 6px;
          animation: msgIn 0.4s cubic-bezier(.22,1,.36,1) both;
          width: 100%;
        }
        .msg-row.user { align-items: flex-end; }
        .msg-row.bot  { align-items: flex-start; }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .bot-row { display: flex; align-items: flex-start; gap: 12px; width: 100%; }

        .avatar {
          width: 34px; height: 34px; flex-shrink: 0;
          border: 1px solid rgba(201,168,76,0.4); border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--gold);
          background: rgba(201,168,76,0.06);
          box-shadow: 0 0 10px rgba(201,168,76,0.15); margin-top: 2px;
        }

        .msg-meta {
          font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(245,240,232,0.22); margin-bottom: 4px;
        }
        .msg-meta span { color: var(--gold); opacity: 0.6; margin-right: 8px; }

        .bubble {
          max-width: min(700px, 82%);
          padding: 14px 20px;
          font-size: 14px; line-height: 1.8;
          font-weight: 300; letter-spacing: 0.3px;
          white-space: pre-wrap; word-break: break-word;
          position: relative;
        }

        .bot-bubble {
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 0 8px 8px 8px;
          color: rgba(245,240,232,0.85);
          backdrop-filter: blur(12px);
        }
        .bot-bubble::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to right, var(--gold), transparent);
          opacity: 0.4; border-radius: 0 8px 0 0;
        }

        .user-bubble {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 8px 0 8px 8px;
          color: var(--white);
          backdrop-filter: blur(12px);
        }
        .user-bubble::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to left, var(--gold), transparent); opacity: 0.3;
        }

        .error-bubble {
          border-color: rgba(224,82,82,0.3) !important;
          background: rgba(224,82,82,0.06) !important;
          color: rgba(255,180,180,0.8) !important;
        }

        .typing-row { display: flex; align-items: flex-start; gap: 12px; animation: msgIn 0.3s ease; }
        .typing-bubble {
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(201,168,76,0.12);
          border-radius: 0 8px 8px 8px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 6px;
        }
        .tdot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold); opacity: 0.5;
          animation: tdot 1.4s infinite ease-in-out;
        }
        .tdot:nth-child(2) { animation-delay: 0.2s; }
        .tdot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes tdot {
          0%, 80%, 100% { transform: scale(1); opacity: 0.3; }
          40% { transform: scale(1.5); opacity: 1; }
        }

        .chips-row {
          flex-shrink: 0;
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 0 48px 16px;
        }
        .chip {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.5px;
          color: rgba(245,240,232,0.35);
          border: 1px solid rgba(201,168,76,0.15);
          padding: 7px 16px; border-radius: 2px;
          cursor: pointer; transition: all 0.2s;
          background: rgba(201,168,76,0.03);
          animation: chipIn 0.5s ease both;
        }
        .chip:nth-child(2) { animation-delay: 0.05s; }
        .chip:nth-child(3) { animation-delay: 0.1s; }
        .chip:nth-child(4) { animation-delay: 0.15s; }
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chip:hover {
          color: var(--gold); border-color: rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.07);
          box-shadow: 0 0 12px rgba(201,168,76,0.1);
        }

        .input-bar {
          flex-shrink: 0;
          padding: 14px 48px 22px;
          border-top: 1px solid rgba(201,168,76,0.1);
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(20px);
        }

        .input-row {
          display: flex; align-items: center;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 3px; padding: 0 0 0 18px;
          background: rgba(201,168,76,0.03);
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .input-row::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .input-row:focus-within { border-color: rgba(201,168,76,0.45); box-shadow: 0 0 20px rgba(201,168,76,0.08); }
        .input-row:focus-within::before { opacity: 1; }

        .input-prompt { font-size: 11px; color: var(--gold); opacity: 0.5; letter-spacing: 1px; flex-shrink: 0; }

        .chat-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'DM Mono', monospace;
          font-size: 14px; font-weight: 300; letter-spacing: 0.3px;
          color: var(--white); caret-color: var(--gold);
          padding: 16px 12px;
        }
        .chat-input::placeholder { color: rgba(245,240,232,0.2); }

        .send-btn {
          height: 100%; min-height: 52px; padding: 0 22px;
          background: transparent;
          border: none; border-left: 1px solid rgba(201,168,76,0.15);
          cursor: pointer; color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .send-btn:hover { background: rgba(201,168,76,0.08); }
        .send-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .input-hint-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 8px; padding: 0 2px;
        }
        .input-hint { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(245,240,232,0.15); }
        .char-count { font-size: 9px; color: rgba(201,168,76,0.3); letter-spacing: 1px; }
      `}</style>

      <div className="bg" style={{ backgroundImage: `url('${BG_IMAGES[bgIndex]}')` }} />
      <div className="bg-vignette" />
      <div className="scanlines" />

      <div className="root">
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
            <button className="clear-btn" onClick={clearChat}>Purge</button>
          </div>
        </div>

        <div className="body">
          <div className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-label">Session Stats</div>
              <div className="stat-row"><span className="stat-label">Messages</span><span className="stat-val">{msgCount}</span></div>
              <div className="stat-row"><span className="stat-label">Model</span><span className="stat-val">Llama 3.3</span></div>
              <div className="stat-row"><span className="stat-label">Status</span><span className="stat-val" style={{color:"#4ade80"}}>Active</span></div>
              <div className="stat-row"><span className="stat-label">Engine</span><span className="stat-val">Groq</span></div>
            </div>

            <div className="sidebar-divider" />

            <div className="suggestion-label">Quick Prompts</div>
            {SUGGESTIONS.map((s, i) => (
              <div key={i} className="suggestion-item" onClick={() => sendMessage(s)}>→ {s}</div>
            ))}

            <div className="sidebar-footer">
              <div className="sidebar-footer-text">
                FABAEU AI v2.0<br />Powered by Groq<br />End-to-end encrypted
              </div>
            </div>
          </div>

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
                      <div style={{flex:1, minWidth:0}}>
                        <div className="msg-meta"><span>FABAEU</span>{formatTime(msg.time)}</div>
                        <div className={`bubble bot-bubble ${msg.isError ? "error-bubble" : ""}`}>{msg.text}</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="msg-meta"><span>YOU</span>{formatTime(msg.time)}</div>
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
              <div className="chips-row">
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
              <div className="input-hint-row">
                <span className="input-hint">↵ Enter to send · Shift+Enter for newline</span>
                <span className="char-count">{input.length} / 2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}