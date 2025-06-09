// Seleciona o botão de rolar os dados
const rollButton = document.getElementById("roll-button");

// Variáveis para controlar animações de shake dos dados HTML
let shakeInterval1, shakeInterval2;

// Variáveis globais para os dados Matter.js
let dice1Body, dice2Body;

// Variável para acessar Body do Matter.js fora do escopo do bloco
let Body;

// Controle de bloqueio
let isRolling = false;

// Evento principal: ao clicar no botão, executa a lógica do jogo
rollButton.addEventListener("click", function () {
  if (isRolling) return; // Impede clique duplo
  isRolling = true;
  rollButton.disabled = true; // Desabilita o botão visualmente

  // Seleciona os elementos dos dados HTML
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");

  // Limpa animações antigas de shake
  clearInterval(shakeInterval1);
  clearInterval(shakeInterval2);
  dice1.classList.remove("shake");
  dice2.classList.remove("shake");

  // Sorteia quantas vezes cada dado vai "girar" e o valor final de cada um
  const spins1 = Math.floor(Math.random() * 5) + 2;
  const spins2 = Math.floor(Math.random() * 5) + 2;

  // Números aleatórios finais
  const final1 = Math.floor(Math.random() * 6) + 1;
  const final2 = Math.floor(Math.random() * 6) + 1;

  // Gera arrays com os valores intermediários e o valor final para a animação
  const faces1 = Array.from(
    { length: spins1 - 1 },
    () => Math.floor(Math.random() * 6) + 1
  ).concat(final1);
  const faces2 = Array.from(
    { length: spins2 - 1 },
    () => Math.floor(Math.random() * 6) + 1
  ).concat(final2);

  // Duração total para cada dado
  const totalDuration = 800;
  const step1 = Math.floor(totalDuration / spins1);
  const step2 = Math.floor(totalDuration / spins2);

  // Anima os dados HTML mudando suas faces
  Array.from({ length: spins1 }).forEach((_, i) => {
    setTimeout(() => {
      dice1.classList.remove("rolling");
      void dice1.offsetWidth;
      dice1.className = "dice " + numberToWord(faces1[i]);
      dice1.innerHTML = getDotsHTML(faces1[i]);
      dice1.classList.add("rolling");
    }, i * step1);
  });

  Array.from({ length: spins2 }).forEach((_, i) => {
    setTimeout(() => {
      dice2.classList.remove("rolling");
      void dice2.offsetWidth;
      dice2.className = "dice " + numberToWord(faces2[i]);
      dice2.innerHTML = getDotsHTML(faces2[i]);
      dice2.classList.add("rolling");
    }, i * step2);
  });

  // Remove a classe de animação ao final
  setTimeout(() => {
    dice1.classList.remove("rolling");
  }, spins1 * step1 + 100);

  setTimeout(() => {
    dice2.classList.remove("rolling");
  }, spins2 * step2 + 100);

  // Mostra o vencedor e faz o dado vencedor "tremer" (shake)
  const winnerTimeout = Math.max(spins1 * step1, spins2 * step2) + 150;
  setTimeout(() => {
    const h1 = document.querySelector("h1");
    if (final1 > final2) {
      h1.textContent = "Player 1 Wins!";
      setTimeout(() => {
        dice1.classList.add("shake");
        shakeInterval1 = setInterval(() => {
          dice1.classList.remove("shake");
          void dice1.offsetWidth;
          dice1.classList.add("shake");
        }, 2000);
      }, 1000);
    } else if (final2 > final1) {
      h1.textContent = "Player 2 Wins!";
      setTimeout(() => {
        dice2.classList.add("shake");
        shakeInterval2 = setInterval(() => {
          dice2.classList.remove("shake");
          void dice2.offsetWidth;
          dice2.classList.add("shake");
        }, 2000);
      }, 1000);
    } else {
      h1.textContent = "Draw!";
      setTimeout(() => {
        dice1.classList.add("shake");
        dice2.classList.add("shake");
        shakeInterval1 = setInterval(() => {
          dice1.classList.remove("shake");
          void dice1.offsetWidth;
          dice1.classList.add("shake");
        }, 2000);
        shakeInterval2 = setInterval(() => {
          dice2.classList.remove("shake");
          void dice2.offsetWidth;
          dice2.classList.add("shake");
        }, 2000);
      }, 1000);
    }
  }, winnerTimeout);

  // Após a animação, faz os dados Matter.js pularem para cima e para os lados (força aleatória)
  setTimeout(() => {
    if (window.dice1Body && window.dice2Body) {
      console.log("Pulando os dados Matter.js agora!"); // <-- Mensagem de teste

      // Gera forças aleatórias para x (entre -0.3 e 0.3)
      const randX1 = (Math.random() - 0.5) * 0.6;
      const randX2 = (Math.random() - 0.5) * 0.6;

      // Aplica o pulo com força aleatória em x e força fixa em y
      Body.applyForce(window.dice1Body, window.dice1Body.position, {
        x: randX1,
        y: -0.4,
      });
      Body.applyForce(window.dice2Body, window.dice2Body.position, {
        x: randX2,
        y: -0.4,
      });

      // Depois de um pequeno tempo, atualiza o valor dos dots dos dados Matter.js para igualar ao HTML
      setTimeout(() => {
        window.dice1Body.customDots = getCurrentDiceValue("dice1");
        window.dice2Body.customDots = getCurrentDiceValue("dice2");
        console.log("Mudou os dots dos dados Matter.js!"); // <-- Mensagem de teste
      }, 350); // delay maior para dar tempo do pulo aparecer
    }
  }, winnerTimeout - 100); // um pouco antes do valor mudar no HTML

  // Calcule o tempo total da animação (já existe winnerTimeout + delays)
  const totalRollTime = Math.max(spins1 * step1, spins2 * step2) + 1000; // ajuste se necessário

  setTimeout(() => {
    isRolling = false;
    rollButton.disabled = false; // Habilita o botão novamente
  }, totalRollTime);
});

// Funções auxiliares
function numberToWord(num) {
  const words = ["one", "two", "three", "four", "five", "six"];
  return words[num - 1];
}

function getDotsHTML(num) {
  return '<div class="dot"></div>'.repeat(num);
}

function getCurrentDiceValue(divId) {
  return document.querySelectorAll(`#${divId} .dot`).length || 1;
}

// --- Dado com física usando Matter.js ---
if (window.Matter) {
  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Mouse,
    MouseConstraint,
    Body: MatterBody, // Renomeia para evitar conflito
  } = Matter;

  Body = MatterBody; // <-- Faz Body ficar global para o arquivo

  // Tamanho da tela
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Cria o motor e o mundo
  const engine = Engine.create();
  const world = engine.world;

  // Cria o renderizador
  const render = Render.create({
    element: document.getElementById("physics-dice-container"),
    engine: engine,
    options: {
      width,
      height,
      wireframes: false,
      background: "#222",
    },
  });

  // Função para gerar posição aleatória dentro da tela (com margem)
  function randomPosition(size, max) {
    return Math.random() * (max - size * 2) + size;
  }

  // Inicializa os dados Matter.js com o valor atual das divs HTML
  window.dice1Body = Bodies.rectangle(
    randomPosition(60, width),
    randomPosition(60, height / 2),
    60,
    60,
    {
      restitution: 0.6,
      chamfer: { radius: 12 },
      render: {
        fillStyle: "#e53935",
        strokeStyle: "#222",
        lineWidth: 4,
        shadowColor: "#000",
        shadowBlur: 15,
      },
      customDots: getCurrentDiceValue("dice1"),
    }
  );

  window.dice2Body = Bodies.rectangle(
    randomPosition(60, width),
    randomPosition(60, height / 2) + height / 2,
    60,
    60,
    {
      restitution: 0.6,
      chamfer: { radius: 12 },
      render: {
        fillStyle: "#e53935",
        strokeStyle: "#222",
        lineWidth: 4,
        shadowColor: "#000",
        shadowBlur: 15,
      },
      customDots: getCurrentDiceValue("dice2"),
    }
  );

  // Paredes (topo, baixo, esquerda, direita)
  const thickness = 40;
  const ground = Bodies.rectangle(
    width / 2,
    height + thickness / 2,
    width,
    thickness,
    { isStatic: true }
  );
  const ceiling = Bodies.rectangle(
    width / 2,
    -thickness / 2,
    width,
    thickness,
    { isStatic: true }
  );
  const leftWall = Bodies.rectangle(
    -thickness / 2,
    height / 2,
    thickness,
    height,
    { isStatic: true }
  );
  const rightWall = Bodies.rectangle(
    width + thickness / 2,
    height / 2,
    thickness,
    height,
    { isStatic: true }
  );

  Composite.add(world, [
    window.dice1Body,
    window.dice2Body,
    ground,
    ceiling,
    leftWall,
    rightWall,
  ]);

  // Mouse para empurrar o dado
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  Composite.add(world, mouseConstraint);

  let lastMouse = { x: null, y: null };

  // Empurra o dado ao passar o mouse por cima (sem clicar)
  render.canvas.addEventListener("mousemove", function (e) {
    const rect = render.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    [window.dice1Body, window.dice2Body].forEach((dice) => {
      if (
        mx > dice.position.x - 30 &&
        mx < dice.position.x + 30 &&
        my > dice.position.y - 30 &&
        my < dice.position.y + 30
      ) {
        if (lastMouse.x !== null && lastMouse.y !== null) {
          const dx = mx - lastMouse.x;
          const dy = my - lastMouse.y;
          Body.applyForce(dice, dice.position, {
            x: dx * 0.002,
            y: dy * 0.002,
          });
        }
      }
    });
    lastMouse.x = mx;
    lastMouse.y = my;
  });

  Render.run(render);
  Runner.run(engine);

  // Atualiza o tamanho do canvas e das paredes ao redimensionar a janela
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    render.canvas.width = width;
    render.canvas.height = height;

    Body.setPosition(ground, { x: width / 2, y: height + thickness / 2 });
    Body.setPosition(ceiling, { x: width / 2, y: -thickness / 2 });
    Body.setPosition(leftWall, { x: -thickness / 2, y: height / 2 });
    Body.setPosition(rightWall, { x: width + thickness / 2, y: height / 2 });

    Body.setVertices(ground, [
      { x: 0, y: height },
      { x: width, y: height },
      { x: width, y: height + thickness },
      { x: 0, y: height + thickness },
    ]);
    Body.setVertices(ceiling, [
      { x: 0, y: 0 - thickness },
      { x: width, y: 0 - thickness },
      { x: width, y: 0 },
      { x: 0, y: 0 },
    ]);
    Body.setVertices(leftWall, [
      { x: 0 - thickness, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: height },
      { x: 0 - thickness, y: height },
    ]);
    Body.setVertices(rightWall, [
      { x: width, y: 0 },
      { x: width + thickness, y: 0 },
      { x: width + thickness, y: height },
      { x: width, y: height },
    ]);
  });

  // Desenha os dots após o render
  Matter.Events.on(render, "afterRender", function () {
    [window.dice1Body, window.dice2Body].forEach((dice) => {
      const ctx = render.context;
      const { position, angle } = dice;
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);

      ctx.fillStyle = "#fff";
      const r = 8;
      const dotPositions = [
        [[0, 0]], // 1
        [
          [-18, -18],
          [18, 18],
        ], // 2
        [
          [-18, -18],
          [0, 0],
          [18, 18],
        ], // 3
        [
          [-18, -18],
          [18, -18],
          [-18, 18],
          [18, 18],
        ], // 4
        [
          [-18, -18],
          [18, -18],
          [0, 0],
          [-18, 18],
          [18, 18],
        ], // 5
        [
          [-18, -18],
          [18, -18],
          [-18, 0],
          [18, 0],
          [-18, 18],
          [18, 18],
        ], // 6
      ];
      const dots = dotPositions[(dice.customDots || 1) - 1];
      dots.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.restore();
    });
  });

  // Adiciona paredes físicas para os dados HTML e o botão
  function addWallForElement(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const wall = Bodies.rectangle(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      rect.width,
      rect.height,
      { isStatic: true, render: { visible: false } }
    );
    Composite.add(world, wall);
  }

  addWallForElement(document.getElementById("dice1"));
  addWallForElement(document.getElementById("dice2"));
  addWallForElement(document.getElementById("roll-button"));

  // Função para respawnar um dado dentro da tela se ele sair dos limites
  function respawnIfOutOfBounds(dice) {
    const margin = 40;
    if (
      dice.position.x < -margin ||
      dice.position.x > width + margin ||
      dice.position.y < -margin ||
      dice.position.y > height + margin
    ) {
      Body.setPosition(dice, {
        x: randomPosition(60, width),
        y: randomPosition(60, height),
      });
      Body.setVelocity(dice, { x: 0, y: 0 });
      Body.setAngularVelocity(dice, 0);
    }
  }

  // Verifica a cada frame se algum dado saiu da tela
  Matter.Events.on(engine, "beforeUpdate", function () {
    respawnIfOutOfBounds(window.dice1Body);
    respawnIfOutOfBounds(window.dice2Body);
  });
}
