const chatInput = document.getElementById("chatInput");
const chatBody = document.getElementById("chatBody");
const sendBtn = document.getElementById("sendBtn");

/* =========================
   UI helpers
========================= */
function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "userMsg";
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(html) {
  const div = document.createElement("div");
  div.className = "botMsg";
  div.innerHTML = html; // allow <br>
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* =========================
   Greetings DB
========================= */
const greetingsDB = [
  { greet: "hi", replies: ["Hello!", "Hi there!", "Hey!"] },
  { greet: "hello", replies: ["Hi!", "Hello!", "Hey there!"] },
  { greet: "hey", replies: ["Hey! How are you?", "Hi!"] },
  { greet: "good morning", replies: ["Good morning! ☀️", "Morning! How are you?"] },
  { greet: "good afternoon", replies: ["Good afternoon! 😊"] },
  { greet: "good evening", replies: ["Good evening! 🌙"] },
  { greet: "how are you", replies: ["I’m good, thank you! How about you?", "Doing well! And you?"] },
];

function checkGreetings(input) {
  const normalized = input.toLowerCase().trim();
  for (const entry of greetingsDB) {
    if (normalized.includes(entry.greet)) {
      return entry.replies[Math.floor(Math.random() * entry.replies.length)];
    }
  }
  return null;
}

/* =========================
   INTERNET FALLBACKS (FREE)
========================= */
async function wikiFallback(query) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.extract || null;
  } catch {
    return null;
  }
}

async function duckDuckGoFallback(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
    );
    const data = await res.json();
    return data.AbstractText || null;
  } catch {
    return null;
  }
}

async function numbersFallback(query) {
  try {
    const res = await fetch(`https://numbersapi.com/${encodeURIComponent(query)}`);
    if (res.ok) return await res.text();
  } catch {}
  return null;
}

async function countriesFallback(query) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      const c = data[0];
      return `
        <b>${c.name.common}</b><br>
        Region: ${c.region}<br>
        Population: ${c.population.toLocaleString()}
      `;
    }
  } catch {}
  return null;
}

/* =========================
   🤖 BOT BRAIN
========================= */
async function getBotReply(msg) {
  const text = msg.toLowerCase();

  // 1️⃣ Greetings
  const greetReply = checkGreetings(text);
  if (greetReply) return greetReply;

  // 2️⃣ Local rules
  if (text.includes("who are you")) {
    return "I’m <b>Ciero AI</b> 🤖, your virtual assistant.";
  }

  // 3️⃣ Internet fallback chain
  const fallback =
    (await wikiFallback(msg)) ||
    (await duckDuckGoFallback(msg)) ||
    (await numbersFallback(msg)) ||
    (await countriesFallback(msg));

  if (fallback) {
    return `Here’s what I found 🤍<br>${fallback}`;
  }

  // 4️⃣ Final fallback
  return "Sorry 😕 I couldn’t find a clear answer.<br>Try asking something else ✨";
}

/* =========================
   SEND MESSAGE
========================= */
async function sendMessage() {
  if (!chatInput.value.trim()) return;

  const msg = chatInput.value.trim();
  addUserMessage(msg);
  chatInput.value = "";
  chatInput.blur();

  setTimeout(async () => {
    const reply = await getBotReply(msg);
    addBotMessage(reply);
  }, 400);
}

/* =========================
   EVENTS
========================= */
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

/* =========================
   WELCOME
========================= */
addBotMessage("Hello 👋 I’m <b>Ciero AI</b>. Ask me anything!");
