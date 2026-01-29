
/* =========================
   ELEMENTS
========================= */
const chatInput = document.getElementById("chatInput");
const chatBody  = document.getElementById("chatBody");
const sendBtn   = document.getElementById("sendBtn");

/* =========================
   UI HELPERS
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
  div.innerHTML = html;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* =========================
   GREETINGS DATABASE
========================= */
const greetingsDB = [
  { greet: "hi", replies: ["Hello!", "Hi there!", "Hey!"] },
  { greet: "hello", replies: ["Hi!", "Hello!", "Hey there!"] },
  { greet: "hey", replies: ["Hey! 😊", "Hi!"] },
  { greet: "good morning", replies: ["Good morning ☀️"] },
  { greet: "good afternoon", replies: ["Good afternoon 😊"] },
  { greet: "good evening", replies: ["Good evening 🌙"] },
  { greet: "how are you", replies: ["I’m good 😊 How about you?"] },
];

function checkGreetings(input) {
  const normalized = input.toLowerCase();
  for (const item of greetingsDB) {
    if (normalized.includes(item.greet)) {
      return item.replies[Math.floor(Math.random() * item.replies.length)];
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
    if (Array.isArray(data) && data.length > 0) {
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
   BOT BRAIN
========================= */
async function getBotReply(msg) {
  const greeting = checkGreetings(msg);
  if (greeting) return greeting;

  const lower = msg.toLowerCase();

  if (lower.includes("who are you")) {
    return "I’m <b>Ciero AI</b> 🤖, your professional virtual assistant.";
  }

  // Internet fallback chain
  const answer =
    (await wikiFallback(msg)) ||
    (await duckDuckGoFallback(msg)) ||
    (await numbersFallback(msg)) ||
    (await countriesFallback(msg));

  if (answer) {
    return `Here’s what I found 🤍<br><br>${answer}`;
  }

  return "Sorry 😕 I couldn’t find a clear answer. Try rephrasing your question.";
}

/* =========================
   SEND MESSAGE
========================= */
async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

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
   WELCOME MESSAGE
========================= */
addBotMessage("Hello 👋 I’m <b>Ciero AI</b>. Ask me anything!");
