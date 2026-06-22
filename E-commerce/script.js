// ===== MENU MOBILE =====
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('aberto');
});

document.querySelectorAll('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('aberto'));
});


// ===== HEADER: SOMBRA + ESCONDE AO ROLAR PARA BAIXO =====
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  if (current > 60) {
    header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
  } else {
    header.style.boxShadow = 'none';
  }

  // esconde header ao rolar pra baixo, mostra ao subir
  if (current > lastScroll && current > 120) {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.3s ease';
  } else {
    header.style.transform = 'translateY(0)';
  }

  lastScroll = current;
});


// ===== FADE-IN AO ROLAR (IntersectionObserver) =====
const fadeEls = document.querySelectorAll(
  '.product-card, .category-card, .testimonial-card, .hero__content, .about__content, .about__image, .promo-banner__content'
);

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.5s ease ${(i % 3) * 0.1}s, transform 0.5s ease ${(i % 3) * 0.1}s`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));


// ===== CARRINHO =====
const cartCount = document.querySelector('.cart__count');
const cartIcon = document.querySelector('.cart');
let total = 0;

function atualizarCarrinho() {
  cartCount.textContent = total;
  // pulsa o ícone
  cartIcon.style.transform = 'scale(1.35)';
  cartIcon.style.transition = 'transform 0.15s ease';
  setTimeout(() => {
    cartIcon.style.transform = 'scale(1)';
  }, 150);
}

document.querySelectorAll('.product-card__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    total++;
    atualizarCarrinho();

    const original = btn.textContent;
    btn.textContent = '✔ Adicionado!';
    btn.style.background = '#388e3c';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 1800);
  });
});


// ===== FAVORITAR =====
document.querySelectorAll('.product-card__wishlist').forEach(btn => {
  btn.addEventListener('click', () => {
    const fav = btn.dataset.fav === 'true';
    btn.innerHTML = fav ? '♡' : '♥';
    btn.style.color = fav ? '' : '#e53935';
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
    btn.style.transition = 'transform 0.2s';
    btn.dataset.fav = fav ? 'false' : 'true';
  });
});


// ===== FILTROS DE PRODUTO =====
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
  });
});


// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const alvo = document.querySelector(link.getAttribute('href'));
    if (alvo) {
      e.preventDefault();
      alvo.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ===== TOOLTIP NO BOTÃO DE BUSCA =====
const searchBtn = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input');

searchBtn.addEventListener('click', () => {
  const termo = searchInput.value.trim();
  if (!termo) {
    searchInput.style.border = '2px solid #e53935';
    searchInput.placeholder = 'Digite algo primeiro...';
    setTimeout(() => {
      searchInput.style.border = '';
      searchInput.placeholder = 'Buscar produtos...';
    }, 2000);
  } else {
    searchInput.style.border = '2px solid #2e7d32';
    setTimeout(() => searchInput.style.border = '', 1500);
  }
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchBtn.click();
});


// ===== CONTADORES ANIMADOS NA SEÇÃO SOBRE =====
function animarContador(el, fim, duracao = 1200) {
  let inicio = 0;
  const passo = duracao / fim;
  const timer = setInterval(() => {
    inicio++;
    el.textContent = inicio + (el.dataset.sufixo || '');
    if (inicio >= fim) clearInterval(timer);
  }, passo);
}

// Cria os contadores dinamicamente dentro da seção about
const aboutContent = document.querySelector('.about__content');
if (aboutContent) {
  const stats = document.createElement('div');
  stats.style.cssText = 'display:flex;gap:24px;margin-top:20px;flex-wrap:wrap;';
  stats.innerHTML = `
    <div style="text-align:center">
      <strong style="font-size:28px;color:#2e7d32" data-sufixo="+" id="stat-anos">0</strong>
      <p style="font-size:13px;color:#666">anos no mercado</p>
    </div>
    <div style="text-align:center">
      <strong style="font-size:28px;color:#2e7d32" data-sufixo="+" id="stat-clientes">0</strong>
      <p style="font-size:13px;color:#666">clientes satisfeitos</p>
    </div>
    <div style="text-align:center">
      <strong style="font-size:28px;color:#2e7d32" data-sufixo="+" id="stat-produtos">0</strong>
      <p style="font-size:13px;color:#666">produtos disponíveis</p>
    </div>
  `;
  aboutContent.appendChild(stats);

  // dispara os contadores quando a seção aparecer
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(document.getElementById('stat-anos'), 10, 1000);
        animarContador(document.getElementById('stat-clientes'), 80, 1200);
        animarContador(document.getElementById('stat-produtos'), 117, 1400);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(stats);
}


// ===== BOTÃO VOLTAR AO TOPO =====
const topBtn = document.createElement('button');
topBtn.textContent = '↑';
topBtn.title = 'Voltar ao topo';
topBtn.style.cssText = `
  position: fixed;
  bottom: 28px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2e7d32;
  color: #fff;
  font-size: 20px;
  border: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    topBtn.style.opacity = '1';
    topBtn.style.transform = 'translateY(0)';
  } else {
    topBtn.style.opacity = '0';
    topBtn.style.transform = 'translateY(20px)';
  }
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== NOTIFICAÇÃO FLUTUANTE DE COMPRA SIMULADA =====
const nomes = ['Ana de Pelotas', 'Carlos de Porto Alegre', 'Maria de Canguçu', 'João de Bagé', 'Lúcia de Pinheiro'];
const produtos = ['Desengordurante 500ml', 'Sabão em Pó 1kg', 'Detergente Neutro', 'Amaciante 2L', 'Limpador de Banheiro'];

function criarNotificacao() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const produto = produtos[Math.floor(Math.random() * produtos.length)];

  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    bottom: 84px;
    right: 24px;
    background: #fff;
    border-left: 4px solid #2e7d32;
    border-radius: 6px;
    padding: 12px 16px;
    font-size: 13px;
    color: #333;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    z-index: 998;
    max-width: 240px;
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.4s, transform 0.4s;
  `;
  notif.innerHTML = `🛒 <strong>${nome}</strong> acabou de comprar <em>${produto}</em>`;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '1';
    notif.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(30px)';
    setTimeout(() => notif.remove(), 400);
  }, 4000);
}

// primeira notificação após 5s, depois a cada 12s
setTimeout(() => {
  criarNotificacao();
  setInterval(criarNotificacao, 12000);
}, 5000);



// ===== CARRINHO COMPLETO COM WHATSAPP =====
const WHATSAPP_NUMBER = '5553999992198';

// Estado do carrinho
let carrinho = [];

// Criar modal do carrinho
const modalCarrinho = document.createElement('div');
modalCarrinho.id = 'modal-carrinho';
modalCarrinho.style.cssText = `
  display: none;
  position: fixed;
  top: 0; right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

modalCarrinho.innerHTML = `
  <div id="modal-overlay" style="
    position: absolute; top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.45);
  "></div>

  <div id="modal-box" style="
    position: absolute;
    top: 0; right: 0;
    width: 360px;
    max-width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 20px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.35s ease;
  ">
    <div style="
      padding: 18px 20px;
      background: #2e7d32;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <strong style="font-size:17px">🛒 Seu Carrinho</strong>
      <button id="fechar-carrinho" style="
        background: none; border: none;
        color: #fff; font-size: 22px;
        cursor: pointer; line-height: 1;
      ">&times;</button>
    </div>

    <div id="carrinho-itens" style="
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    ">
      <p id="carrinho-vazio" style="color:#999;text-align:center;margin-top:40px">
        Seu carrinho está vazio 😕
      </p>
    </div>

    <div style="padding: 16px 20px; border-top: 1px solid #e0e0e0;">
      <div style="display:flex;justify-content:space-between;margin-bottom:14px">
        <strong>Total:</strong>
        <strong id="carrinho-total" style="color:#2e7d32;font-size:18px">R$ 0,00</strong>
      </div>
      <button id="btn-whatsapp" style="
        width: 100%;
        padding: 13px;
        background: #25d366;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-weight: bold;
      ">
        💬 Finalizar pelo WhatsApp
      </button>
      <button id="btn-limpar" style="
        width: 100%;
        padding: 9px;
        margin-top: 8px;
        background: none;
        color: #e53935;
        border: 1px solid #e53935;
        border-radius: 8px;
        font-size: 13px;
        cursor: pointer;
      ">🗑 Limpar carrinho</button>
    </div>
  </div>
`;

document.body.appendChild(modalCarrinho);

// Abrir/fechar modal
function abrirCarrinho() {
  modalCarrinho.style.display = 'block';
  setTimeout(() => {
    document.getElementById('modal-box').style.transform = 'translateX(0)';
  }, 10);
  renderCarrinho();
}

function fecharCarrinho() {
  document.getElementById('modal-box').style.transform = 'translateX(100%)';
  setTimeout(() => {
    modalCarrinho.style.display = 'none';
  }, 350);
}

document.querySelector('.cart').addEventListener('click', (e) => {
  e.preventDefault();
  abrirCarrinho();
});

document.getElementById('fechar-carrinho').addEventListener('click', fecharCarrinho);
document.getElementById('modal-overlay').addEventListener('click', fecharCarrinho);

// Renderizar itens do carrinho
function renderCarrinho() {
  const container = document.getElementById('carrinho-itens');
  const vazio = document.getElementById('carrinho-vazio');
  const totalEl = document.getElementById('carrinho-total');

  // Limpar itens anteriores (menos o parágrafo de vazio)
  Array.from(container.children).forEach(el => {
    if (el.id !== 'carrinho-vazio') el.remove();
  });

  if (carrinho.length === 0) {
    vazio.style.display = 'block';
    totalEl.textContent = 'R$ 0,00';
    return;
  }

  vazio.style.display = 'none';

  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.qtd;

    const div = document.createElement('div');
    div.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    `;
    div.innerHTML = `
      <img src="${item.img}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;flex-shrink:0" />
      <div style="flex:1;min-width:0">
        <p style="font-size:13px;font-weight:bold;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.nome}</p>
        <p style="font-size:13px;color:#2e7d32;font-weight:bold">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
          <button onclick="alterarQtd(${index}, -1)" style="
            width:26px;height:26px;border-radius:50%;
            border:1px solid #ccc;background:#fff;
            cursor:pointer;font-size:16px;line-height:1
          ">−</button>
          <span style="font-size:14px;font-weight:bold">${item.qtd}</span>
          <button onclick="alterarQtd(${index}, 1)" style="
            width:26px;height:26px;border-radius:50%;
            border:1px solid #ccc;background:#fff;
            cursor:pointer;font-size:16px;line-height:1
          ">+</button>
        </div>
      </div>
      <button onclick="removerItem(${index})" style="
        background:none;border:none;
        color:#bbb;font-size:20px;
        cursor:pointer;flex-shrink:0
      ">&times;</button>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

// Alterar quantidade
window.alterarQtd = function(index, delta) {
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd <= 0) carrinho.splice(index, 1);
  cartCount.textContent = carrinho.reduce((s, i) => s + i.qtd, 0);
  renderCarrinho();
};

// Remover item
window.removerItem = function(index) {
  carrinho.splice(index, 1);
  cartCount.textContent = carrinho.reduce((s, i) => s + i.qtd, 0);
  renderCarrinho();
};

// Limpar tudo
document.getElementById('btn-limpar').addEventListener('click', () => {
  carrinho = [];
  cartCount.textContent = 0;
  renderCarrinho();
});

// Adicionar ao carrinho (substitui o handler antigo)
document.querySelectorAll('.product-card__btn').forEach(btn => {
  // remove listener antigo clonando o botão
  const novo = btn.cloneNode(true);
  btn.parentNode.replaceChild(novo, btn);
});

document.querySelectorAll('.product-card__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const nome = card.querySelector('.product-card__name').textContent;
    const img  = card.querySelector('.product-card__image img').src;
    const precoEl = card.querySelector('.product-card__price');
    const preco = parseFloat(
      precoEl.textContent.replace('R$', '').replace(',', '.').trim()
    );

    const existente = carrinho.find(i => i.nome === nome);
    if (existente) {
      existente.qtd++;
    } else {
      carrinho.push({ nome, img, preco, qtd: 1 });
    }

    const total = carrinho.reduce((s, i) => s + i.qtd, 0);
    cartCount.textContent = total;

    // pulsa ícone
    cartIcon.style.transform = 'scale(1.35)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 150);

    // feedback no botão
    const original = btn.textContent;
    btn.textContent = '✔ Adicionado!';
    btn.style.background = '#388e3c';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 1800);
  });
});

// Enviar para WhatsApp
document.getElementById('btn-whatsapp').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('Adicione pelo menos um produto antes de finalizar!');
    return;
  }

  let msg = '🧹 Olá, Vilmar! Gostaria de fazer um pedido:\n\n';

  carrinho.forEach(item => {
    const subtotal = (item.preco * item.qtd).toFixed(2).replace('.', ',');
    msg += `▪ ${item.nome}\n`;
    msg += `  Qtd: ${item.qtd} × R$ ${item.preco.toFixed(2).replace('.', ',')} = R$ ${subtotal}\n\n`;
  });

  const totalGeral = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  msg += `💰 *Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n`;
  msg += `\nAguardo confirmação do pedido, obrigado! 😊`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});