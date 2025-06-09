function calculateLovePercentage(name1, name2) {
  // Simple algorithm for love percentage
  const loveScore = Math.random() * 100;
  return Math.round(loveScore);
}

function generateResultMiniText(loveScore) {
  if (loveScore === 100) {
    return "Vocês são almas gêmeas!";
  }

  if (loveScore > 75) {
    return "Vocês são feitos um para o outro!";
  }
  if (loveScore > 50) {
    return "Há uma boa chance de amor entre vocês!";
  }
  if (loveScore > 25) {
    return "Pode ser que haja algo especial entre vocês.";
  }
  if (loveScore > 0) {
    return "Talvez seja melhor vocês serem apenas amigos.";
  }
  if (loveScore === 0) {
    return "Melhor deixarem isso pra lá.";
  }
}

document
  .getElementById("love-calculator-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name1 = document.getElementById("name1").value.trim();
    const name2 = document.getElementById("name2").value.trim();

    if (name1 && name2) {
      const lovePercentage = calculateLovePercentage(name1, name2);
      document.getElementById(
        "result"
      ).innerText = `${name1} e ${name2} têm ${lovePercentage}% de chance de amor!`;
      document.getElementById("result-minitext").innerText =
        generateResultMiniText(lovePercentage);
      document.querySelector(".result-container").style.display = "block";
    } else {
      document.getElementById("result").innerText =
        "Por favor, preencha os dois nomes.";
      document.getElementById("result-minitext").innerText = "";
      document.querySelector(".result-container").style.display = "block";
    }
  });
