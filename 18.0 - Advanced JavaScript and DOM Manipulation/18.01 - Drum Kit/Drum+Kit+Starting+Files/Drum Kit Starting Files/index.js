// Função para tocar o som correspondente
function playSound(key) {
  let audio;
  switch (key) {
    case "a": 
      audio = new Audio("sounds/tom-1.mp3");
      break;
    case "s": 
      audio = new Audio("sounds/tom-2.mp3");
      break;
    case "d": 
      audio = new Audio("sounds/tom-3.mp3");
      break;
    case "f": 
      audio = new Audio("sounds/tom-4.mp3");
      break;
    case "j":
      audio = new Audio("sounds/snare.mp3");
      break;
    case "k":
      audio = new Audio("sounds/crash.mp3");
      break;
    case "l":
      audio = new Audio("sounds/kick-bass.mp3");
      break;
    default:
      return;
  }
  // Força o áudio a começar do início, caso seja pressionado rapidamente
  audio.currentTime = 0;
  audio.play();
}

function animateButton(key) {
  // Mapeia as teclas para as classes corretas
  let classMap = { a: "w", s: "a", d: "s", f: "d", j: "j", k: "k", l: "l" };
  let btnClass = classMap[key];
  if (!btnClass) return;
  let button = document.querySelector("." + btnClass);
  if (button) {
    button.classList.add("pressed");
    setTimeout(function () {
      button.classList.remove("pressed");
    }, 250);
  }
}

// Evento de clique nos botões
document.querySelectorAll(".drum").forEach(function (btn) {
  btn.addEventListener("click", function () {
    playSound(this.innerHTML.toLowerCase());
    // Adiciona animação ao clicar
    animateButton(this.innerHTML.toLowerCase());
  });
});

// Evento de pressionar tecla
document.addEventListener("keydown", function (event) {
  playSound(event.key.toLowerCase());
  animateButton(event.key.toLowerCase());
});
