// === Lista de serviços ===
const SERVICES = [
  { name: "Pintura Residencial", icon: "🎨", desc: "Interna, externa e fachadas" },
  { name: "Pintura de Prédios", icon: "🏢", desc: "Altura e acabamento profissional" },
  { name: "Pedreiros", icon: "🧱", desc: "Alvenaria e estrutura" },
  { name: "Mestre de Obras", icon: "⛑️", desc: "Coordenação completa" },
  { name: "Empreiteira de Casas", icon: "🏠", desc: "Sua casa do zero ao final" },
  { name: "Reboco", icon: "🪨", desc: "Massa única e fina" },
  { name: "Pisos", icon: "🔲", desc: "Assentamento e nivelamento" },
  { name: "Porcelanato", icon: "◼️", desc: "Acabamento de alto padrão" },
  { name: "Muros", icon: "🧱", desc: "Construção e reparo" },
  { name: "Carpintaria", icon: "🪓", desc: "Madeira sob medida" },
  { name: "Encanador", icon: "💧", desc: "Hidráulica geral" },
  { name: "Eletricista", icon: "⚡", desc: "Instalações e reparos" },
  { name: "Jardinagem", icon: "🌱", desc: "Projetos e manutenção" },
  { name: "Cortes de Grama", icon: "✂️", desc: "Manutenção periódica" },
  { name: "Limpeza de Terrenos", icon: "🌳", desc: "Roçada e remoção" },
  { name: "Lava Telhado", icon: "🌧️", desc: "Limpeza e impermeabilização" },
  { name: "Faxineira / Diarista", icon: "✨", desc: "Pós-obra e residencial" },
];

const WA_LINK_DEFAULT = "https://wa.me/5553999992198?text=" +
  encodeURIComponent("Olá! Vi o site da Prestadora de Serviços Pai & Filho e gostaria de solicitar um orçamento.");

// === Render dos serviços ===
const grid = document.getElementById("servicesGrid");
SERVICES.forEach((s, i) => {
  const el = document.createElement("div");
  el.className = "service";
  el.innerHTML = `
    <div class="service-top">
      <div class="service-icon">${s.icon}</div>
      <div class="service-num">${String(i + 1).padStart(2, "0")}</div>
    </div>
    <div>
      <div class="service-name">${s.name}</div>
      <div class="service-desc">${s.desc}</div>
    </div>`;
  grid.appendChild(el);
});
// CTA tile
const cta = document.createElement("div");
cta.className = "service service-cta";
cta.innerHTML = `
  <div class="service-top">
    <div class="service-icon" style="color:#fff">✨</div>
    <div class="service-num" style="color:rgba(255,255,255,0.4)">CTA</div>
  </div>
  <div>
    <div class="service-name">Não achou seu serviço?</div>
    <a href="https://wa.me/5553999992198?text=${encodeURIComponent('Olá! Gostaria de saber se vocês atendem um serviço específico.')}" target="_blank" rel="noopener">Fale com a gente →</a>
  </div>`;
grid.appendChild(cta);

// === Header scroll effect ===
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
});

// === Mobile menu ===
const menuBtn = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// === Footer year ===
document.getElementById("footerYear").textContent = new Date().getFullYear();

// === Form -> WhatsApp ===
const form = document.getElementById("contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").trim();
  const phone = (data.get("phone") || "").trim();
  const email = (data.get("email") || "").trim();
  const service = (data.get("service") || "").trim();
  const message = (data.get("message") || "").trim();

  if (!name || !message) {
    alert("Por favor preencha seu nome e a mensagem.");
    return;
  }

  let txt = `Olá! Meu nome é ${name}.`;
  if (service) txt += `\nServiço de interesse: ${service}.`;
  txt += `\n\n${message}`;
  if (phone) txt += `\n\nTelefone: ${phone}`;
  if (email) txt += `\nE-mail: ${email}`;

  const url = `https://wa.me/5553999992198?text=${encodeURIComponent(txt)}`;
  window.open(url, "_blank");
});
