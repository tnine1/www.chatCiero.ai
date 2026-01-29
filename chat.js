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

  // 🌍 Internet fallback (Wikipedia)
  async function getInternetFallback(query) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return data.extract || null;
    } catch {
      return null;
    }
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
