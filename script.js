let saldo = 1000;
const opciones = [1, 2, 3, 4, 5];
let musicaActiva = false;

window.addEventListener('load', () => {
  // Array con los enlaces de las canciones
  const canciones = [
    "https://raw.githubusercontent.com/EndikaNF/horseRace/main/mp4/Antonio%20Aguilar%20y%20Vicente%20Fern%C3%A1ndez%20Exitos%20-%20Corridos%20De%20Caballos%20Famosos%20-%20Rancheras%20y%20Corridos%20.mp3",
  ];

  // Selecciona una canción aleatoria del array
  const randomIndex = Math.floor(Math.random() * canciones.length);
  const selectedSong = canciones[randomIndex];

  // Obtiene el elemento de audio y lo configura para la canción aleatoria
  const audioElement = document.getElementsByClassName("bgMusic")[0];
  audioElement.src = selectedSong;

  const botonSonido = document.getElementById("toggleMusic");
  let musicaActiva = false;

  // Preguntar si el usuario quiere activar la música
  Swal.fire({
    title: '🎵 ¿Quieres activar la música?',
    text: 'Disfruta de una experiencia más inmersiva con música de fondo.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, activar',
    cancelButtonText: 'No, gracias',
  }).then((result) => {
    if (result.isConfirmed && audioElement) {
      audioElement.play().then(() => {
        musicaActiva = true;
        if (botonSonido) botonSonido.textContent = "🔈";
      }).catch((e) => {
        console.log("Error al reproducir la música:", e);
        Swal.fire("⚠️ No se pudo reproducir la música automáticamente.", "Actívala manualmente si lo deseas.", "warning");
      });
    }
  });

  // Control manual desde el botón
  if (botonSonido) {
    botonSonido.addEventListener("click", () => {
      if (!audioElement) return;

      if (musicaActiva) {
        audioElement.pause();
        botonSonido.textContent = "🔇";
        musicaActiva = false;
      } else {
        audioElement.play().then(() => {
          botonSonido.textContent = "🔈";
          musicaActiva = true;
        }).catch(err => {
          console.error("Error al reproducir música:", err);
          Swal.fire("⚠️ No se pudo reproducir la música.", "Actívala manualmente si lo deseas.", "warning");
        });
      }
    });
  }
});

function actualizarSaldo() {
  document.getElementById('saldo').textContent = `💰 Saldo: €${saldo.toFixed(2)}`;
}

function actualizarInputs() {
  const cont = document.getElementById('extraInputs');
  cont.innerHTML = '';
  const tipo = document.getElementById('tipoApuesta').value;

  function crearSelect(id, labelText, exclude = null) {
    const span = document.createElement('span');
    let opts = opciones.filter(n => n !== exclude)
      .map(n => `<option value="${n}">${n}</option>`).join('');
    span.innerHTML = `<label for="${id}">${labelText}</label><select id="${id}">${opts}</select>`;
    return span;
  }

  if (['ganador', 'colocado', 'show'].includes(tipo)) {
    cont.appendChild(crearSelect('sel1', 'Caballo:'));
  } else {
    cont.appendChild(crearSelect('sel1', tipo === 'exacta' ? '1º lugar:' : 'Caballo A:'));
    cont.appendChild(crearSelect('sel2', tipo === 'exacta' ? '2º lugar:' : 'Caballo B:'));
    setTimeout(() => {
      const sel1 = document.getElementById('sel1');
      const sel2 = document.getElementById('sel2');
      function actualizarSegundo() {
        const v1 = parseInt(sel1.value);
        sel2.innerHTML = opciones.filter(n => n !== v1)
          .map(n => `<option value="${n}">${n}</option>`).join('');
      }
      sel1.addEventListener('change', actualizarSegundo);
      actualizarSegundo();
    }, 0);
  }
}

function resetearCaballos() {
  for (let i = 1; i <= 5; i++) {
    const wrapper = document.getElementById(`caballo${i}`);
    const img = wrapper.querySelector('.caballo-img');
    const vid = wrapper.querySelector('.caballo-video');

    wrapper.style.transform = 'translateX(0px)';
    img.style.display = 'block';
    vid.style.display = 'none';
    vid.pause();
    vid.currentTime = 0;
  }
}

function generarAvance() {
  return Math.random() * 10;
}

function calcularPuntoDeDetencion() {
  const meta = document.querySelector('.meta');
  const anchoCaballo = document.getElementById('caballo1').offsetWidth;
  return meta.offsetLeft - anchoCaballo;
}

function leerApuestasDesdeTabla() {
  const apuestas = [];
  for (let i = 1; i <= 5; i++) {
    ['win', 'place', 'show'].forEach(tipo => {
      const input = document.getElementById(`${tipo}${i}`);
      const valor = parseFloat(input.value) || 0;
      if (valor > 0) apuestas.push({ caballo: i - 1, tipo, cantidad: valor });
    });
  }
  return apuestas;
}

const audioElement = document.getElementsByClassName("bgMusic2")[0];
if (audioElement && audioElement.paused) {
  audioElement.play().catch(err => {
    console.log("No se pudo reproducir la música al iniciar la carrera:", err);
  });
}


function mostrarContadorConDesenfoque() {
  deshabilitarControles()
    // Detener la música de fondo al iniciar la carrera
    const audioElement = document.getElementsByClassName("bgMusic")[0];
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
      audioElement.currentTime = 0; // Opcional: reiniciar
    }
  const contadorElement = document.getElementById('contador');

  // Mostrar el contador en la pista y aplicar el desenfoque a la pista
  let tiempoRestante = 3;
  contadorElement.textContent = tiempoRestante;
  contadorElement.style.display = 'block'; // Mostrar el contador dentro de la pista
  pista.classList.add('desenfoque'); // Aplicar el desenfoque a la pista

  // Configuramos el contador
  const intervaloContador = setInterval(() => {
    tiempoRestante--;
    contadorElement.textContent = tiempoRestante;

    // Cuando el contador llega a 0, eliminar el desenfoque y ocultar el contador
    if (tiempoRestante <= 0) {
      clearInterval(intervaloContador);
      contadorElement.style.display = 'none'; // Ocultar el contador
      iniciarCarrera(); // Llamar a la función para iniciar la carrera (puedes personalizarla)
      // Reproducir la música cuando comience la carrera
      reproducirMusica();
    }
  }, 1000);
}

function reproducirMusica() {
  const audioElement = document.getElementsByClassName("bgMusic2")[0];
  
  // Verificar si el elemento de audio existe
  if (audioElement) {
    audioElement.play().then(() => {
      console.log("La música comenzó a reproducirse.");
    }).catch((e) => {
      console.log("Error al reproducir la música:", e);
      Swal.fire("⚠️ No se pudo reproducir la música automáticamente.", "Actívala manualmente si lo deseas.", "warning");
    });
  }
}


function iniciarCarrera() {
  const apuestas = leerApuestasDesdeTabla();
  const totalApostado = apuestas.reduce((sum, a) => sum + a.cantidad, 0);

  if (apuestas.length === 0) {
    mostrarAlertaPersonalizada(
      '😮 ¡Ups! No has hecho ninguna apuesta...',
      '¡Elige un caballo y pon a prueba tu suerte antes de empezar la carrera!'
    );
    return;
  }

  if (totalApostado > saldo) {
    alert('⚠️ Saldo insuficiente.');
    return;
  }

  saldo -= totalApostado;
  actualizarSaldo();

  const avances = [0, 0, 0, 0, 0];
  const rawOrder = [];
  const finalOrder = [];
  let mostrado = false;
  const wrappers = opciones.map(i => document.getElementById(`caballo${i}`));
  const puntoFinal = calcularPuntoDeDetencion();
  const metaX = document.querySelector('.meta').offsetLeft;

  const intervalo = setInterval(() => {
    wrappers.forEach((w, i) => {
      if (!finalOrder.includes(i)) {
        avances[i] += generarAvance();
        const despl = Math.min(avances[i], puntoFinal);
        w.style.transform = `translateX(${despl}px)`;

        const img = w.querySelector('.caballo-img');
        const vid = w.querySelector('.caballo-video');
        if (avances[i] > 0 && vid.paused) {
          img.style.display = 'none';
          vid.style.display = 'block';
          vid.currentTime = 0;
          vid.play();
        }

        if (w.offsetLeft + w.offsetWidth >= metaX && !rawOrder.includes(i)) {
          rawOrder.push(i);
        }
        if (despl >= puntoFinal) {
          finalOrder.push(i);
        }
      }
    });

    if (!mostrado && finalOrder.length === 5) {
      mostrado = true;
      finalOrder.forEach(i => {
        if (!rawOrder.includes(i)) rawOrder.push(i);
      });
    
      // 💥 Detener la música antes de mostrar el resultado
      const audioElement3 = document.getElementsByClassName("bgMusic")[0];
      if (audioElement3 && !audioElement.paused) {
        audioElement3.pause();
        audioElement.currentTime = 0; // Opcional: volver al inicio
      }
    
      let ganancia = 0;
      apuestas.forEach(ap => {
        const pos = rawOrder.indexOf(ap.caballo);
        if (ap.tipo === 'win' && pos === 0) ganancia += ap.cantidad * 2;
        if (ap.tipo === 'place' && pos <= 1) ganancia += ap.cantidad * 1.5;
        if (ap.tipo === 'show' && pos <= 2) ganancia += ap.cantidad * 1.2;
      });
    
      saldo += ganancia;
      actualizarSaldo();
      const audioElement2 = document.getElementsByClassName("bgMusic2")[0];
      if (audioElement2 && !audioElement2.paused) {
        audioElement2.pause();
        audioElement2.currentTime = 0; // Opcional: reiniciar
      }
      habilitarControles()
      mostrarModal(
        ganancia > 0 ? `🎉 ¡Ganaste €${ganancia.toFixed(2)}!` : '💸 Perdiste tus apuestas.',
        ganancia > 0
          ? 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif'
          : 'https://media.giphy.com/media/3o6ZsXGkfWk2H2DF3i/giphy.gif',
        rawOrder
      );
    
      clearInterval(intervalo);
    }
    
  }, 50);
}

function mostrarAlertaPersonalizada(titulo, mensaje) {
  const modal = document.createElement('div');
  modal.style = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  `;
  modal.innerHTML = `
    <div style="
      background: white; padding: 2rem; border-radius: 15px;
      max-width: 400px; text-align: center; box-shadow: 0 0 15px #000;
    ">
      <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">${titulo}</h2>
      <p style="margin-bottom: 1rem;">${mensaje}</p>
      <button onclick="this.parentElement.parentElement.remove()" style="
        padding: 0.5rem 1rem; border: none; border-radius: 8px;
        background: #007bff; color: white; font-weight: bold; cursor: pointer;
      ">Aceptar</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function mostrarModal(titulo, gif, ordenCaballos) {
  const modal = document.getElementById('modalResultado');
  const mensajeResultado = document.getElementById('mensajeResultado');
  const tablaResultados = document.getElementById('tablaResultados');
  const tbody = tablaResultados.querySelector('tbody');

  mensajeResultado.textContent = titulo;
  tbody.innerHTML = '';

  ordenCaballos.forEach((i, index) => {
    const tr = document.createElement('tr');
    const nombre = document.getElementById(`caballo${i + 1}`).dataset.nombre || `Caballo ${i + 1}`;
    const imagen = document.getElementById(`caballo${i + 1}`).querySelector('img').src;
    
    // Crear la celda de posición
    const tdPosicion = document.createElement('td');
    tdPosicion.textContent = `${index + 1}º`;

    // Crear la celda con la imagen y el nombre
    const tdImagenNombre = document.createElement('td');
    tdImagenNombre.innerHTML = `<img src="${imagen}" alt="${nombre}" width="40">`;

    // Añadir la clase 'papalla' si contiene una imagen
    if (tdImagenNombre.querySelector('img')) {
      tdImagenNombre.classList.add('papalla');
    }

    // Añadir las celdas a la fila
    tr.appendChild(tdPosicion);
    tr.appendChild(tdImagenNombre);
    
    // Añadir la fila al cuerpo de la tabla
    tbody.appendChild(tr);
  });

  tablaResultados.style.display = 'block';
  modal.style.display = 'flex';
}


function cerrarModal() {
  document.getElementById('modalResultado').style.display = 'none';
  resetearCaballos(); // <- Esto reinicia los caballos a su posición inicial
}


function agregarListenerApuestas() {
  document.querySelectorAll('.apuesta[type="number"]').forEach(input => {
    input.addEventListener('input', (event) => {
      let value = event.target.value;
      if (value.startsWith('0') && value.length > 1) {
        event.target.value = value.replace(/^0+/, '');
      }
    });
  });
}

function centrarPista() {
  const header = document.querySelector('.header');
  const apuestas = document.querySelector('.apuestas');
  const pista = document.getElementById('pista');

  const alturaHeader = header.offsetHeight;
  const alturaApuestas = apuestas.offsetHeight;
  const alturaVentana = window.innerHeight;
  const alturaPista = pista.offsetHeight;

  const espacioDisponible = alturaVentana - alturaHeader - alturaApuestas;
  const margenSuperior = Math.max(20, (espacioDisponible - alturaPista) / 2 + alturaHeader);

  pista.style.marginTop = `${margenSuperior}px`;
}

// Inicialización
window.onload = () => {
  actualizarInputs();
  actualizarSaldo();
  resetearCaballos();
  agregarListenerApuestas();
  centrarPista();
};

document.getElementById('tipoApuesta').addEventListener('change', actualizarInputs);

function deshabilitarControles() {
  document.querySelectorAll('input, select, button').forEach(el => el.disabled = true);

  const toggleMusic = document.getElementById("toggleMusic");
  if (toggleMusic) {
    toggleMusic.style.pointerEvents = "none"; // Desactiva clics
    toggleMusic.style.opacity = "0.5";         // Opcional: estilo visual de deshabilitado
    toggleMusic.setAttribute("title", "Desactivado durante la carrera");
  }
}


function habilitarControles() {
  document.querySelectorAll('input, select, button').forEach(el => el.disabled = false);

  const toggleMusic = document.getElementById("toggleMusic");
  if (toggleMusic) {
    toggleMusic.style.pointerEvents = "auto"; // Reactiva clics
    toggleMusic.style.opacity = "1";           // Restaura opacidad
    toggleMusic.setAttribute("title", "Activar/Desactivar música");
  }
}
