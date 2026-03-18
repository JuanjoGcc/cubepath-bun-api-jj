const chatForm = document.getElementById("chatForm");
const healthBtn = document.getElementById("healthBtn");
const healthResult = document.getElementById("healthResult");
const responseBox = document.getElementById("responseBox");
const statusBadge = document.getElementById("statusBadge");
const sendBtn = document.getElementById("sendBtn");

function setStatus(text, isError = false) {
  statusBadge.textContent = text;
  statusBadge.classList.toggle("error", isError);
}

function pretty(data) {
  return JSON.stringify(data, null, 2);
}

healthBtn.addEventListener("click", async () => {
  healthResult.textContent = "Comprobando...";

  try {
    const res = await fetch("/health");
    const data = await res.json();
    healthResult.textContent = `OK: ${data.status}`;
  } catch {
    healthResult.textContent = "Error conectando con /health";
  }
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(chatForm);
  const message = String(formData.get("message") || "").trim();
  const model = String(formData.get("model") || "openrouter/free").trim();
  const stream = formData.get("stream") === "on";

  if (!message) {
    setStatus("Falta mensaje", true);
    responseBox.textContent = "Escribe un mensaje antes de enviar.";
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Enviando...";
  setStatus("Consultando", false);
  responseBox.textContent = "Esperando respuesta de la IA...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        model,
        stream,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(`Error ${res.status}`, true);
      responseBox.textContent = pretty(data);
      return;
    }

    setStatus("OK", false);
    responseBox.textContent = pretty(data);
  } catch (error) {
    setStatus("Error de red", true);
    responseBox.textContent =
      error instanceof Error ? error.message : "No se pudo completar la peticion.";
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Enviar a /chat";
  }
});
