document.addEventListener("DOMContentLoaded", () => {
  // --- 1. CONTROLE DO MENU MOBILE ---
  const checkbox = document.getElementById("checkbox");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuItems = document.querySelectorAll(".menu-item");

  if (checkbox && menuOverlay) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        menuOverlay.style.opacity = "1";
        menuOverlay.style.visibility = "visible";
        document.body.style.overflow = "hidden";
      } else {
        menuOverlay.style.opacity = "0";
        menuOverlay.style.visibility = "hidden";
        document.body.style.overflow = "";
      }
    });

    menuItems.forEach(item => {
      item.addEventListener("click", () => {
        checkbox.checked = false;
        menuOverlay.style.opacity = "0";
        menuOverlay.style.visibility = "hidden";
        document.body.style.overflow = "";
      });
    });
  }

  // --- 2. BOTÃO WHATSAPP (SHOW ON SCROLL) ---
  const waButton = document.getElementById('whatsappButton');
  if (waButton) {
    const threshold = 200;
    const checkScroll = () => {
      if (window.scrollY > threshold) {
        waButton.classList.add('show');
      } else {
        waButton.classList.remove('show');
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // --- 3. TELA DE LOADING INICIAL ---
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
    }, 300);
  }
});

// --- 4. TROCA DE IMAGENS RESPONSIVAS ---
// Unifiquei as funções para não haver conflito de nomes
function gerenciarImagensResponsivas() {
  const largura = window.innerWidth;

  const imagens = [
    { id: 'faixada', cel: 'imagens/faixadaCEl.jpg', tab: 'imagens/faixadaCEl2.png', desk: 'imagens/faixadaCEl3.png' },
    { id: 'minhaImagem', cel: 'imagens/guga1.png', tab: 'imagens/guga2.png', desk: 'imagens/guga3.png' },
    { id: 'carrossel1', cel: 'imagens/cabelo1.png', tab: 'imagens/cabelo1M.png', desk: 'imagens/cabelo1G.png' },
    { id: 'carrossel2', cel: 'imagens/cabelo4.png', tab: 'imagens/cabelo4M.png', desk: 'imagens/cabelo4G.png' },
    { id: 'carrossel3', cel: 'imagens/cabelo2.png', tab: 'imagens/cabelo2M.png', desk: 'imagens/cabelo2G.png' },
    { id: 'carrossel4', cel: 'imagens/cabelo3.png', tab: 'imagens/cabelo3M.png', desk: 'imagens/cabelo3G.png' }
  ];

  imagens.forEach(imgData => {
    const el = document.getElementById(imgData.id);
    if (el) {
      if (largura < 768) el.src = imgData.cel;
      else if (largura < 1200) el.src = imgData.tab;
      else el.src = imgData.desk;
    }
  });
}

window.addEventListener('load', gerenciarImagensResponsivas);
window.addEventListener('resize', gerenciarImagensResponsivas);

// --- 5. CARROSSEL AUTOMÁTICO ---
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slides img');
if (slidesContainer && slides.length > 0) {
  let index = 0;
  setInterval(() => {
    index = (index + 1) % slides.length;
    const slideWidth = slides[0].clientWidth;
    slidesContainer.style.transform = `translateX(${-index * slideWidth}px)`;
  }, 5000);
}

// --- 6. LÓGICA DE AGENDAMENTO ---

async function enviarAgendamento(dados) {
 
  const MODO_TESTE = false;

  if (MODO_TESTE) {
    return new Promise((resolve) => setTimeout(() => resolve({ message: "sucesso" }), 2000));
  }

  const response = await fetch("https://sitegugabarber.onrender.com/agendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro no servidor");
  }

  return await response.json();
}

const btnSubmit = document.getElementById("submitBtn");
if (btnSubmit) {
  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    // Evita cliques duplos
    if (btnSubmit.classList.contains("loading") || btnSubmit.classList.contains("success")) return;

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !date || !time) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    const dados = { name, phone, service, date, time };

    // ATIVA LOADING
    btnSubmit.classList.add("loading");
    btnSubmit.disabled = true;

    try {
      const result = await enviarAgendamento(dados);

      // SÓ CHEGA AQUI SE O FETCH DER CERTO
      btnSubmit.classList.remove("loading");
      btnSubmit.classList.add("success");

      // Redireciona WhatsApp se houver sucesso
      if (result.message.toLowerCase().includes("sucesso")) {
        const msg = `Olá! Meu nome é ${name}, marquei um ${service} para o dia ${formattedDate} às ${time}.`;
        const url = `https://wa.me/5519996818430?text=${encodeURIComponent(msg)}`;

        setTimeout(() => {
          window.location.href = url;
        }, 1500);
      }

    } catch (error) {

      console.error(error);
      alert("Erro ao enviar agendamento. Tente novamente.");
      btnSubmit.classList.remove("loading");
      btnSubmit.disabled = false;
    }
  });
}