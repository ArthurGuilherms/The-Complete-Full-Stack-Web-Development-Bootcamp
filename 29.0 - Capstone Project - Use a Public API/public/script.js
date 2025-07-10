let mapa;
let marcadores = [];

document.getElementById("detalhes").innerHTML = `
    <h3 class="placeholder">Clique numa <span style="color: #d32f2f;">Tag</span> ao lado para mais informações</h3>`;

function initMap() {
  mapa = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 0, lng: 0 },
  });

  terremotos.forEach((t, i) => {
    const marcador = new google.maps.Marker({
      position: { lat: t.lat, lng: t.lng },
      map: mapa,
      title: `M${t.magnitude} - ${t.lugar}`,
    });

    marcador.addListener("click", () => {
      mostrarDetalhes(i);
      mapa.panTo({ lat: t.lat, lng: t.lng });
    });

    marcadores.push(marcador);
  });
}

function mostrarDetalhes(index) {
  const t = terremotos[index];
  const data = new Date(t.data).toLocaleString();

  //Mostra o mapa do terremoto selecionado
  mapa.panTo({ lat: t.lat, lng: t.lng });

  //Gera informações
  document.getElementById("detalhes").innerHTML = `
    <h3>Detalhes do Terremoto</h3>
    <div class= informações> 
    <p class="item"><strong>Local:</strong> ${t.lugar}</p>
    <p class="item"><strong>Magnitude:</strong> ${t.magnitude}</p>
    <p class="item"><strong>Data/Hora:</strong> ${data}</p>
    <p class="item"><strong>Descrição:</strong> ${t.detalhes}</p>
    </div>
  `;

  //Redireciona para o local onde é exibido os detalhes  
  document.getElementById("titulo-topo").scrollIntoView({
    behavior: "smooth",
  });
}
