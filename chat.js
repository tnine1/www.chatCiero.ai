
  const chatToggle = document.getElementById("chatToggle");
  const chatbot = document.getElementById("chatbot");
  const closeChat = document.getElementById("closeChat");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");
  const sendBtn = document.getElementById("sendBtn");

  // Open / close chat
  chatToggle.onclick = () => chatbot.classList.remove("hidden");
  closeChat.onclick = () => chatbot.classList.add("hidden");

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

  // 🌍 Internet fallback (Wikipedia – free & legal)
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

  // 🤖 Main brain
  async function getBotReply(msg) {
    const text = msg.toLowerCase();

    // 1️⃣ Local answers (edit freely)
    if (text === "hi" || text === "hello") {
      return "Hello 👋 I’m Ciero AI. How can I help you today?";
    }

    if (text.includes("who are you")) {
      return "I’m Ciero AI, your virtual assistant 🤖";
    }

    if (text.includes("coffee")) {
      return "We serve espresso, cappuccino, latte, and more ☕";
    }

    // 2️⃣ Internet fallback
    const internetAnswer = await getInternetFallback(msg);
    if (internetAnswer) {
      return internetAnswer + " \n\n(Source: Wikipedia)";
    }

    // 3️⃣ Final fallback
    return "Sorry 😕 I couldn’t find an answer to that yet.";
  }

  // 🚀 Send message (used by Enter & Button)
  async function sendMessage() {
    if (!chatInput.value.trim()) return;

    const msg = chatInput.value.trim();
    addUserMessage(msg);
    chatInput.value = "";
    chatInput.blur(); // hide keyboard (mobile)

    // typing delay
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
