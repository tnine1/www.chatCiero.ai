 const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");
  const sendBtn = document.getElementById("sendBtn");

  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "userMsg";
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addBotMessage(text) {
    const div = document.createElement("div");
    div.className = "botMsg";
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

const greetingsDB = [
  { greet: "hi", replies: ["Hello!", "Hi there!", "Hey!"] },
  { greet: "hello", replies: ["Hi!", "Hello!", "Hey there!"] },
  { greet: "hey", replies: ["Hey! How are you?", "Hi!"] },
  { greet: "good morning", replies: ["Good morning! ☀️", "Morning! How are you?"] },
  { greet: "good afternoon", replies: ["Good afternoon! 😊"] },
  { greet: "good evening", replies: ["Good evening! 🌙"] },
  { greet: "how are you", replies: ["I’m good, thank you! How about you?", "Doing well! And you?"] },
];

// ----------------------------
// 2️⃣ Check greetings
// ----------------------------
function checkGreetings(input) {
  const normalized = input.toLowerCase().trim();
  for (const entry of greetingsDB) {
    if (normalized.includes(entry.greet)) {
      const reply = entry.replies[Math.floor(Math.random() * entry.replies.length)];
      return reply;
    }
  }
  return null;
}

// INTERNET FALLBACK (FREE)
// ======================

// Wikipedia fallback
async function wikiFallback(query) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.extract) return data.extract;
  } catch (e) {
    console.warn("Wiki fallback failed", e);
  }
  return null;
}

async function duckDuckGoFallback(query) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.AbstractText) return data.AbstractText;
  } catch (e) {
    console.warn("DuckDuckGo fallback failed", e);
  }
  return null;
}

async function numbersFallback(query) {
  // optional: trivia, math facts, dates
  try {
    const res = await fetch(`http://numbersapi.com/${encodeURIComponent(query)}`);
    if (res.ok) return await res.text();
  } catch (e) {
    console.warn("Numbers API failed", e);
  }
  return null;
}

async function countriesFallback(query) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const country = data[0];
      return `Country: ${country.name.common}\nRegion: ${country.region}\nPopulation: ${country.population.toLocaleString()}`;
    }
  } catch (e) {
    console.warn("Countries API failed", e);
  }
  return null;
}


  // 🤖 Brain
  async function getBotReply(msg) {
    const text = msg.toLowerCase();

    // Local answers
    if (text === "hi" || text === "hello") {
      return "Hello 👋 I’m Ciero AI. How can I help you today?";
    }

    if (text.includes("who are you")) {
      return "I’m Ciero AI 🤖, your full-page virtual assistant.";
    }

    // Internet fallback
    let fallbackAnswer =
    (await wikiFallback(rawMsg)) ||
    (await duckDuckGoFallback(rawMsg)) ||
    (await numbersFallback(rawMsg)) ||
    (await countriesFallback(rawMsg));

  if (fallbackAnswer) return `Here’s what I found 🤍<br>${fallbackAnswer}`;

  // -------- Final fallback --------
  return "Sorry, I couldn’t find a clear answer 🤍<br>Try asking about our menu, prices, location, or opening hours ☕";
}
    const internet = await getInternetFallback(msg);
    if (internet) {
      return internet + "\n\n(Source: Wikipedia)";
    }

    return "Sorry 😕 I couldn’t find an answer to that.";
  }

  async function sendMessage() {
    if (!chatInput.value.trim()) return;

    const msg = chatInput.value.trim();
    addUserMessage(msg);
    chatInput.value = "";
    chatInput.blur(); // hide keyboard on mobile

    setTimeout(async () => {
      const reply = await getBotReply(msg);
      addBotMessage(reply);
    }, 400);
  }

  // Enter key
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Button click
  sendBtn.addEventListener("click", sendMessage);

  // Welcome message
  addBotMessage("Hello 👋 I’m Ciero AI. Ask me anything!");
