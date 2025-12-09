document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("checkbox");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuItems = document.querySelectorAll(".menu-item");

  // Abrir/fechar menu ao clicar no hambúrguer
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      menuOverlay.style.opacity = "1";
      menuOverlay.style.visibility = "visible";
      document.body.style.overflow = "hidden"; // trava scroll
    } else {
      menuOverlay.style.opacity = "0";
      menuOverlay.style.visibility = "hidden";
      document.body.style.overflow = ""; // libera scroll
    }
  });

  // Fecha o menu quando clicar em algum link
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      checkbox.checked = false;
      menuOverlay.style.opacity = "0";
      menuOverlay.style.visibility = "hidden";
      document.body.style.overflow = "";
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('whatsappButton');
  if (!button) return;

  const threshold = 200; 

  // função que verifica scroll e alterna a classe
  function checkScroll() {
    if (window.scrollY > threshold) {
      if (!button.classList.contains('show')) button.classList.add('show');
    } else {
      if (button.classList.contains('show')) button.classList.remove('show');
    }
  }

  // checa imediatamente (útil se o usuário abriu a página já rolada)
  checkScroll();

  // ouvinte de scroll (passive para performance)
  window.addEventListener('scroll', checkScroll, { passive: true });
});

function trocarImg() {
  const imagem = document.getElementById('faixada');
  const larguraTela = window.innerWidth;

  if (larguraTela < 768) {
    imagem.src = 'imagens/faixadaCEl.jpg'; // celular
  } else if (larguraTela < 1200) {
    imagem.src = 'imagens/faixadaCEl2.png'; // tablet
  } else {
    imagem.src = 'imagens/faixadaCEl3.png'; // desktop
  }
}

  function trocarImagem() {
    const imagem = document.getElementById('minhaImagem');
    const larguraTela = window.innerWidth;

    if (larguraTela < 768) {
      imagem.src = 'imagens/guga1.png'; // celular
    } else if (larguraTela < 1200) {
      imagem.src = 'imagens/guga2.png'; // tablet
    } else {
      imagem.src = 'imagens/guga3.png'; // desktop
    }
  }

  //redimensiona as imagens do carrossel
function trocarImagem() {
  const imagem = document.getElementById('carrossel1');
  const larguraTela = window.innerWidth;

  if (larguraTela < 768) {
    imagem.src = 'imagens/cabelo1.png'; // celular
  } else if (larguraTela < 1200) {
    imagem.src = 'imagens/cabelo1M.png'; // tablet
  } else {
    imagem.src = 'imagens/cabelo1G.png'; // desktop
  }
}

function trocarImagem() {
  const imagem = document.getElementById('carrossel2');
  const larguraTela = window.innerWidth;

  if (larguraTela < 768) {
    imagem.src = 'imagens/cabelo4.png'; // celular
  } else if (larguraTela < 1200) {
    imagem.src = 'imagens/cabelo4M.png'; // tablet
  } else {
    imagem.src = 'imagens/cabelo4G.png'; // desktop
  }
}

function trocarImagem() {
  const imagem = document.getElementById('carrossel3');
  const larguraTela = window.innerWidth;

  if (larguraTela < 768) {
    imagem.src = 'imagens/cabelo2.png'; // celular
  } else if (larguraTela < 1200) {
    imagem.src = 'imagens/cabelo2M.png'; // tablet
  } else {
    imagem.src = 'imagens/cabelo2G.png'; // desktop
  }
}

function trocarImagem() {
  const imagem = document.getElementById('carrossel4');
  const larguraTela = window.innerWidth;

  if (larguraTela < 768) {
    imagem.src = 'imagens/cabelo3.png'; // celular
  } else if (larguraTela < 1200) {
    imagem.src = 'imagens/cabelo3M.png'; // tablet
  } else {
    imagem.src = 'imagens/cabelo3G.png'; // desktop
  }
}

const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slides img');
const slideWidth = slides[0].clientWidth; 
let index = 0; 
const tempoTroca = 5000; 

function mostrarSlide() {
  const offset = -index * slideWidth;
  slidesContainer.style.transform = `translateX(${offset}px)`;
}

// 🔁 Função de Carrossel Automático
function proximoSlideAutomatico() {
  index = (index + 1) % slides.length;
  mostrarSlide();
}

// Inicia a troca automática
setInterval(proximoSlideAutomatico, tempoTroca);

  window.addEventListener('load', trocarImagem);
  window.addEventListener('resize', trocarImagem);

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const data = { name, phone, service, date, time };

  try {
    const response = await fetch("https://sitegugabarber.onrender.com/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    alert("Erro ao enviar agendamento");
    console.error(error);
  }
});

document.getElementById("submitBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // ✅ Formata a data (de "2025-12-11" para "11-12-2025")
  const [year, month, day] = date.split("-");
  const formattedDate = `${day}-${month}-${year}`;

  const data = { name, phone, service, date, time };

  try {
    const response = await fetch("https://sitegugabarber.onrender.com/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    alert(result.message);

    // ✅ Só redireciona pro WhatsApp se o backend retornar sucesso
    if (response.ok && result.message.includes("sucesso")) {
      const msg = `Olá! Meu nome é ${name}, marquei um ${service} para o dia ${formattedDate} às ${time}.`;
      const numeroBarbeiro = "5519996818430";
      const url = `https://wa.me/${numeroBarbeiro}?text=${encodeURIComponent(msg)}`;

      // Redireciona pro WhatsApp (1 segundo depois do alerta)
      setTimeout(() => {
        window.location.href = url;
      }, 1000);
    }

  } catch (error) {
    alert("Erro ao enviar agendamento 😢");
    console.error(error);
  }
});


function showLoading() {
  document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingScreen").style.display = "none";
}

document.addEventListener('DOMContentLoaded', (event) => {
  const loadingScreen = document.getElementById('loadingScreen');

  // Esconde a tela de carregamento após a página estar pronta
  if (loadingScreen) {
    // Usa um pequeno atraso para garantir que a animação seja vista
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      // Usa 'visibility: hidden' para que o elemento não seja clicável após o fade-out
      loadingScreen.style.visibility = 'hidden';
    }, 300); // 300ms de atraso
  }
});

async function handleAgendamento(event) {
  event.preventDefault();
  const loadingScreen = document.getElementById('loadingScreen');

  // 1. MOSTRAR O SPINNER ANTES DA CHAMADA API
  loadingScreen.style.visibility = 'visible';
  loadingScreen.style.opacity = '1';

  try {
    const response = await fetch('/api/agendar', {
      method: 'POST',
      // ... resto das configurações ...
    });

    const data = await response.json();
    // ... processar a resposta ...

  } catch (error) {
    console.error('Erro no agendamento:', error);
    // ... mostrar mensagem de erro ...

  } finally {
    // 2. ESCONDER O SPINNER APÓS A REQUISIÇÃO (SEJA SUCESSO OU FALHA)
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
  }
}










