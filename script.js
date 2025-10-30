// === MENU ===
function iniciarJogo(tipo) {
  esconderTodasTelas();

  if(tipo === 'galinha') {
    document.getElementById("jogoGalinha").style.display = "block";
    reiniciar();
  } else {
    document.getElementById("jogoDados").style.display = "block";
    reiniciarDados();
  }
}

function mostrarComoJogar() {
  esconderTodasTelas();
  document.getElementById("comoJogar").style.display = "block";
}

function mostrarConfig() {
  esconderTodasTelas();
  document.getElementById("config").style.display = "block";
}

function salvarConfig() {
  const nomes = [
    document.getElementById("nome1").value || "Jogador 1",
    document.getElementById("nome2").value || "Jogador 2",
    document.getElementById("nome3").value || "Jogador 3",
    document.getElementById("nome4").value || "Jogador 4"
  ];
  document.getElementById("player1").textContent = nomes[0];
  document.getElementById("player2").textContent = nomes[1];
  document.getElementById("player1Dados").textContent = nomes[0];
  document.getElementById("player2Dados").textContent = nomes[1];
  document.getElementById("player3Dados").textContent = nomes[2];
  document.getElementById("player4Dados").textContent = nomes[3];
  voltarMenu();
}

function voltarMenu() {
  esconderTodasTelas();
  document.getElementById("menu").style.display = "flex";
}

function esconderTodasTelas() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("comoJogar").style.display = "none";
  document.getElementById("config").style.display = "none";
  document.getElementById("jogoGalinha").style.display = "none";
  document.getElementById("jogoDados").style.display = "none";
}

// === JOGO GALINHA ===
let currentPlayer = 1, gameOver = false, ovosAtirados = 0;
const limiteOvos = 10;
let imunidade = {1:false, 2:false};
let imunidadeContador = {1:0, 2:0};
const limiteOvosDourados = 2;
let ovoPodreSorteado = Math.floor(Math.random()*limiteOvos)+1;

function atirar() {
  if(gameOver) return;

  const botao = document.querySelector("#jogoGalinha button[onclick='atirar()']");
  botao.disabled = true; // bloqueia botão até animação

  ovosAtirados++;
  const log = document.getElementById("log");
  const egg = document.getElementById("egg");
  const shooter = currentPlayer;
  const target = shooter===1?2:1;
  const targetDiv = document.getElementById("player"+target);

  egg.style.display = "block";
  egg.style.transition = "none";
  egg.style.left = shooter===1 ? "20%" : "75%";
  egg.style.top = "50%";

  setTimeout(() => {
    egg.style.transition = "1s linear";
    egg.style.left = shooter===1 ? "75%" : "20%";
  }, 50);

  setTimeout(() => {
    let resultado = "";

    if(ovosAtirados === ovoPodreSorteado){
      if(imunidade[target]){
        resultado = `🛡️ ${targetDiv.textContent} tinha imunidade e sobreviveu ao ovo podre!`;
        imunidade[target] = false;
        targetDiv.classList.remove("imune");
        passarTurno();
        botao.disabled = false;
      } else {
        resultado = `💀 ${targetDiv.textContent} levou um ovo PODRE e perdeu!`;
        targetDiv.classList.add("derrotado");
        document.getElementById("deathSound").currentTime = 0;
        document.getElementById("deathSound").play();
        gameOver = true;
        document.getElementById("restartBtn").style.display = "inline-block";
      }
    } else {
      const chance = Math.random();
      if(chance < 0.8){
        resultado = `🥚 Ovo normal! ${targetDiv.textContent} está seguro.`;
      } else {
        if(imunidadeContador[target] < limiteOvosDourados){
          resultado = `🌟 Ovo dourado! ${targetDiv.textContent} ganhou imunidade!`;
          imunidade[target] = true;
          imunidadeContador[target]++;
          targetDiv.classList.add("imune");
        } else {
          resultado = `🥚 Ovo normal! ${targetDiv.textContent} está seguro. (limite de imunidade atingido)`;
        }
      }

      if(ovosAtirados >= limiteOvos && !gameOver){
        resultado += "<br>🎉 Limite de ovos atingido! Ninguém perdeu.";
        gameOver = true;
        document.getElementById("restartBtn").style.display="inline-block";
      } else {
        passarTurno();
        botao.disabled = false;
      }
    }

    log.innerHTML = resultado + "<br>" + log.innerHTML;
    egg.classList.add("ovobreak");
    setTimeout(() => {
      egg.style.display = "none";
      egg.classList.remove("ovobreak");
    },600);

  }, 1100);
}

function passarTurno(){
  document.getElementById("player"+currentPlayer).classList.remove("active");
  currentPlayer = currentPlayer===1?2:1;
  document.getElementById("player"+currentPlayer).classList.add("active");
}

function reiniciar(){
  currentPlayer=1;
  gameOver=false;
  ovosAtirados=0;
  imunidade={1:false,2:false};
  imunidadeContador={1:0,2:0};
  ovoPodreSorteado=Math.floor(Math.random()*limiteOvos)+1;
  document.getElementById("player1").className="player active";
  document.getElementById("player2").className="player";
  document.getElementById("log").innerHTML="";
  document.getElementById("restartBtn").style.display="none";
  document.querySelector("#jogoGalinha button[onclick='atirar()']").disabled=false;
}

// === JOGO DADOS ===
let posicao = [0,0,0,0];
const linhaChegada = 20;
let vezAtual = 1;

function rolarDadoJogador(){
  const log = document.getElementById("logDados");
  const jogadorSpan = document.getElementById(`player${vezAtual}Dados`);
  const barra = document.getElementById(`barra${vezAtual}`);
  const botao = document.getElementById("botaoDado");

  let dado = Math.floor(Math.random()*6)+1;
  posicao[vezAtual-1] += dado;
  let perc = Math.min((posicao[vezAtual-1]/linhaChegada)*100,100);
  barra.style.width = perc + "%";

  log.innerHTML = `🎲 Jogador ${vezAtual} (${jogadorSpan.textContent}) rolou: ${dado}<br>` + log.innerHTML;

  if(posicao[vezAtual-1]>=linhaChegada){
    barra.classList.add("vencedor");
    log.innerHTML = `🎉 Jogador ${vezAtual} (${jogadorSpan.textContent}) venceu a corrida!<br>` + log.innerHTML;
    botao.disabled = true;
    return;
  }

  document.getElementById(`player${vezAtual}Dados`).classList.remove("jogadorAtivo");
  vezAtual++;
  if(vezAtual > 4) vezAtual = 1;
  document.getElementById(`player${vezAtual}Dados`).classList.add("jogadorAtivo");

  document.getElementById("vezJogador").textContent = `➡️ Vez do ${document.getElementById(`player${vezAtual}Dados`).textContent}`;
}

function reiniciarDados(){
  posicao=[0,0,0,0];
  vezAtual = 1;
  document.getElementById("vezJogador").textContent = `➡️ Vez do ${document.getElementById(`player${vezAtual}Dados`).textContent}`;

  for(let i=1;i<=4;i++){
    document.getElementById(`barra${i}`).style.width="0%";
    document.getElementById(`barra${i}`).classList.remove("vencedor");
    document.getElementById(`player${i}Dados`).classList.remove("jogadorAtivo");
  }
  document.getElementById(`player${vezAtual}Dados`).classList.add("jogadorAtivo");
  document.getElementById("logDados").innerHTML = `➡️ Vez do jogador ${vezAtual} (${document.getElementById(`player${vezAtual}Dados`).textContent})`;
  document.getElementById("botaoDado").disabled=false;
}
