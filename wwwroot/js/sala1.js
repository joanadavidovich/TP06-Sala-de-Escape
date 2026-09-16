// ========== SALA 1: EL MAPA DESTRUIDO ==========

// Variables globales
let consignaActual = 1;
let respuestasConsignas = {
    1: false,
    2: false,
    3: false
};
let codigoFinal = "M7E4"; // Código de ejemplo

// Objetos de consignas con imágenes reales
let consigna1 = {
    imagenes: [
        { id: 1, letra: "M", imagen: "/images/sala1/golden-gate.jpeg", nombre: "1", orden: 0 },
        { id: 2, letra: "A", imagen: "/images/sala1/cristo.jpg", nombre: "2", orden: 1 },
        { id: 3, letra: "P", imagen: "/images/sala1/piramides.jpg", nombre: "3", orden: 2 },
        { id: 4, letra: "A", imagen: "/images/sala1/taj-mahal.jpg", nombre: "4", orden: 3 },
        { id: 5, letra: "M", imagen: "/images/sala1/coliseo.jpg", nombre: "5", orden: 4 },
        { id: 6, letra: "U", imagen: "/images/sala1/muralla.jpg", nombre: "6", orden: 5 },
        { id: 7, letra: "N", imagen: "/images/sala1/opera.jpg", nombre: "7", orden: 6 },
        { id: 8, letra: "D", imagen: "/images/sala1/eiffel.jpg", nombre: "8", orden: 7 },
        { id: 9, letra: "I", imagen: "/images/sala1/machu.jpg", nombre: "9", orden: 8 }
    ]
};

let consigna3 = {
    monumentos: [
        { id: 1, nombre: "Torre Eiffel", continente: "EUROPA", imagen: "/images/sala1/eiffel.jpg", letra: "E" },
        { id: 2, nombre: "Estatua de la Libertad", continente: "AMÉRICA DEL NORTE", imagen: "/images/sala1/liberty.jpg", letra: "U" },
        { id: 3, nombre: "Pirámides", continente: "ÁFRICA", imagen: "/images/sala1/piramides.jpg", letra: "R" },
        { id: 4, nombre: "Taj Mahal", continente: "ASIA", imagen: "/images/sala1/taj-mahal.jpg", letra: "O" },
        { id: 5, nombre: "Cristo Redentor", continente: "AMÉRICA DEL SUR", imagen: "/images/sala1/cristo.jpg", letra: "P" },
        { id: 6, nombre: "Ópera Sydney", continente: "OCEANÍA", imagen: "/images/sala1/opera.jpg", letra: "A" }
    ]
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarSala1();
});

function inicializarSala1() {
    inicializarConsigna1();
    inicializarEventosBotones();
    inicializarNavigacionConsignas();
    mostrarConsigna(1);
}

// ===== CONSIGNA 1: LAS 9 IMÁGENES (SIN PISTAS) =====
function inicializarConsigna1() {
    const desordenadas = document.getElementById('imagenesDesordenadas');
    desordenadas.innerHTML = '';
    
    // Mezclar imágenes aleatororiamente
    const imagenesShuffled = [...consigna1.imagenes].sort(() => Math.random() - 0.5);
    
    imagenesShuffled.forEach(img => {
        const card = document.createElement('div');
        card.className = 'imagen-card';
        card.draggable = true;
        card.innerHTML = `
            <img src="${img.imagen}" alt="Imagen ${img.nombre}" onerror="this.src='/images/sala1/placeholder.jpg'">
            <div class="imagen-letra">${img.letra}</div>
        `;
        
        card.addEventListener('dragstart', dragStartConsigna1);
        card.addEventListener('dragend', dragEndConsigna1);
        desordenadas.appendChild(card);
    });
    
    inicializarDropzonesConsigna1();
}

function inicializarDropzonesConsigna1() {
    const slots = document.querySelectorAll('.orden-slot');
    slots.forEach(slot => {
        slot.addEventListener('dragover', dragOverConsigna1);
        slot.addEventListener('drop', dropConsigna1);
        slot.addEventListener('dragleave', dragLeaveConsigna1);
    });
}

let draggedElement = null;
let draggedOrigen = null; // 'pool' o 'slot'

function dragStartConsigna1(e) {
    draggedElement = this;
    draggedOrigen = this.closest('.orden-slot') ? 'slot' : 'pool';
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // necesario para Firefox
}

function dragEndConsigna1(e) {
    this.classList.remove('dragging');
}

function inicializarDropzonesConsigna1() {
    const slots = document.querySelectorAll('.orden-slot');
    slots.forEach(slot => {
        slot.addEventListener('dragover', dragOverConsigna1);
        slot.addEventListener('drop', dropConsigna1);
        slot.addEventListener('dragleave', dragLeaveConsigna1);
    });

    // NUEVO: el panel de fotos desordenadas también recibe drops
    // (para poder devolver una foto desde un slot al pool)
    const pool = document.getElementById('imagenesDesordenadas');
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', function (e) {
        e.preventDefault();
        if (draggedOrigen === 'slot' && draggedElement) {
            pool.appendChild(draggedElement);
            actualizarPalabraResultado();
        }
    });
}

function dragOverConsigna1(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function dragLeaveConsigna1(e) {
    this.classList.remove('drag-over');
}

function dropConsigna1(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (!draggedElement) return;

    if (this.children.length === 0) {
        // Slot vacío: mover la foto acá
        this.appendChild(draggedElement);
    } else if (this.children[0] !== draggedElement) {
        const otroItem = this.children[0];
        const pool = document.getElementById('imagenesDesordenadas');

        if (draggedOrigen === 'slot') {
            // Intercambiar posiciones entre dos slots ocupados
            const slotOrigen = draggedElement.parentElement;
            this.appendChild(draggedElement);
            slotOrigen.appendChild(otroItem);
        } else {
            // Viene del pool: el item que estaba en el slot vuelve al pool
            pool.appendChild(otroItem);
            this.appendChild(draggedElement);
        }
    }

    actualizarPalabraResultado();
}
function actualizarPalabraResultado() {
    const slots = document.querySelectorAll('.orden-slot');
    const palabra = Array.from(slots)
        .map(slot => {
            const img = slot.querySelector('.imagen-letra');
            return img ? img.textContent : '_';
        })
        .join('');
    
    const resultado = document.getElementById('palabraResultado');
    resultado.textContent = palabra;
}

// ===== EVENTO: VERIFICAR CONSIGNA 1 =====
document.addEventListener('DOMContentLoaded', function() {
    const btnVerificar1 = document.getElementById('verificarConsigna1');
    if (btnVerificar1) {
        btnVerificar1.addEventListener('click', verificarConsigna1);
    }
});

function verificarConsigna1() {
    const slots = document.querySelectorAll('.orden-slot');
    const palabra = Array.from(slots)
        .map(slot => {
            const img = slot.querySelector('.imagen-letra');
            return img ? img.textContent : '';
        })
        .join('');
    
    if (palabra === 'MAPAMUNDI') {
        alert('✅ ¡EXCELENTE! Descubriste la palabra: MAPAMUNDI\n\nAhora descubrirás en qué continente aterrizó el vuelo 742.');
        respuestasConsignas[1] = true;
        avanzarConsigna();
    } else {
        alert('❌ Esa no es la palabra correcta. Intenta otra combinación.\n\nPista: Piensa en cómo podrías ordenar estos lugares del mundo...');
    }
}

// ===== CONSIGNA 2: MAPA ROTO =====
let consigna2Config = {
    filas: 2,
    columnas: 3,
    anchoPieza: 80,
    altoPieza: 80,
    imagen: "/images/sala1/mapamundi.png" // <-- poné tu imagen acá
};

function inicializarConsigna2() {
    const piezasContainer = document.getElementById('piezasDisponibles');
    const tableroContainer = document.getElementById('tableroPuzzle');
    if (!piezasContainer || !tableroContainer) return;

    piezasContainer.innerHTML = '';
    tableroContainer.innerHTML = '';

    const totalPiezas = consigna2Config.filas * consigna2Config.columnas;
    let piezas = [];
    for (let i = 0; i < totalPiezas; i++) {
        piezas.push({
            id: i,
            fila: Math.floor(i / consigna2Config.columnas),
            columna: i % consigna2Config.columnas
        });
    }

    // Slots del tablero, en orden fijo
    piezas.forEach(p => {
        const slot = document.createElement('div');
        slot.className = 'slot-puzzle';
        slot.dataset.posicion = p.id;
        slot.addEventListener('dragover', dragOverPuzzle);
        slot.addEventListener('drop', dropPuzzle);
        slot.addEventListener('dragleave', dragLeavePuzzle);
        tableroContainer.appendChild(slot);
    });

    // Piezas mezcladas en el panel izquierdo
    const piezasMezcladas = [...piezas].sort(() => Math.random() - 0.5);
    piezasMezcladas.forEach(p => {
        const pieza = document.createElement('div');
        pieza.className = 'pieza-puzzle';
        pieza.draggable = true;
        pieza.dataset.posicion = p.id;
        pieza.style.backgroundImage = `url('${consigna2Config.imagen}')`;
        pieza.style.backgroundSize =
            `${consigna2Config.columnas * consigna2Config.anchoPieza}px ${consigna2Config.filas * consigna2Config.altoPieza}px`;
        pieza.style.backgroundPosition =
            `-${p.columna * consigna2Config.anchoPieza}px -${p.fila * consigna2Config.altoPieza}px`;
        pieza.addEventListener('dragstart', dragStartPuzzle);
        pieza.addEventListener('dragend', dragEndPuzzle);
        piezasContainer.appendChild(pieza);
    });
}

function dragStartPuzzle(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.posicion);
}

function dragEndPuzzle() {
    this.classList.remove('dragging');
}

function dragOverPuzzle(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function dragLeavePuzzle() {
    this.classList.remove('drag-over');
}

function dropPuzzle(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (this.children.length > 0) return; // slot ya ocupado

    const posicionPieza = e.dataTransfer.getData('text/plain');
    if (posicionPieza === this.dataset.posicion) {
        const clone = draggedElement.cloneNode(true);
        clone.draggable = false;
        clone.style.cursor = 'default';
        this.appendChild(clone);
        this.classList.add('correcta');
        draggedElement.remove();
    } else {
        alert('❌ Esa pieza no va en ese lugar. Seguí intentando.');
    }
}

function verificarConsigna2Puzzle() {
    const slots = document.querySelectorAll('.slot-puzzle');
    const completas = document.querySelectorAll('.slot-puzzle.correcta').length;

    if (completas === slots.length) {
        document.querySelector('.rompecabezas-container').style.display = 'none';
        document.getElementById('verificarConsigna2').style.display = 'none';
        document.getElementById('mapaCompletoGrande').style.display = 'block';
    } else {
        alert(`❌ Aún falta armar el mapa. Llevás ${completas} de ${slots.length} piezas.`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const btnSiguiente = document.getElementById('btnSiguienteConsigna2');
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function () {
            respuestasConsignas[2] = true; // <-- acá SÍ
            mostrarConsigna(3);
        });
    }
});

// ===== CONSIGNA 3: UBICAR CONTINENTES =====
function inicializarConsigna3() {
    const monumentosPanel = document.getElementById('monumentosContainer');
    monumentosPanel.innerHTML = '';
    
    // Mezclar monumentos
    const monumentosMezclados = [...consigna3.monumentos].sort(() => Math.random() - 0.5);
    
    monumentosMezclados.forEach(monumento => {
        const card = document.createElement('div');
        card.className = 'monumento-card';
        card.draggable = true;
        card.dataset.monumento = JSON.stringify(monumento);
        card.innerHTML = `
            <img src="${monumento.imagen}" alt="${monumento.nombre}" onerror="this.src='/images/sala1/placeholder.jpg'">
            <div class="monumento-info">
                <h5>${monumento.nombre}</h5>
            </div>
        `;
        
        card.addEventListener('dragstart', dragStartConsigna3);
        card.addEventListener('dragend', dragEndConsigna3);
        monumentosPanel.appendChild(card);
    });
    
    inicializarDropzonesContinentes();
}

function dragStartConsigna3(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', this.dataset.monumento);
}

function dragEndConsigna3(e) {
    this.classList.remove('dragging');
}

function inicializarDropzonesContinentes() {
    const drops = document.querySelectorAll('.drop-zone');
    drops.forEach(zone => {
        zone.addEventListener('dragover', dragOverContinente);
        zone.addEventListener('drop', dropContinente);
        zone.addEventListener('dragleave', dragLeaveContinente);
    });
}

function dragOverContinente(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.classList.add('drag-over');
}

function dragLeaveContinente(e) {
    this.classList.remove('drag-over');
}

function dropContinente(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (this.children.length > 0) {
        return; // No permitir múltiples monumentos en una zona
    }
    
    try {
        const monumentoData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const continenteZona = this.closest('[data-continente]').getAttribute('data-continente');
        
        if (monumentoData.continente === continenteZona) {
            this.innerHTML = `<img class="monumento-img" src="${monumentoData.imagen}" alt="${monumentoData.nombre}" draggable="false" onerror="this.src='/images/sala1/placeholder.jpg'">`;
            this.style.background = '#c8e6c9';
            this.style.borderColor = '#27ae60';
            
            // Remover la tarjeta del panel de monumentos
            if (draggedElement) {
                draggedElement.remove();
            }
        } else {
            alert(`❌ No es correcto. Continúa intentando...`);
        }
    } catch (err) {
        console.error('Error al procesar el drop:', err);
    }
}

console.log('Imagen configurada:', consigna2Config.imagen);

// ===== EVENTO: VERIFICAR CONSIGNA 3 =====
document.addEventListener('DOMContentLoaded', function() {
    const btnVerificar3 = document.getElementById('verificarConsigna3');
    if (btnVerificar3) {
        btnVerificar3.addEventListener('click', verificarConsigna3);
    }
});

function verificarConsigna3() {
    const drops = document.querySelectorAll('.drop-zone');
    let completadas = 0;
    
    drops.forEach(zone => {
        if (zone.querySelector('img')) {
            completadas++;
        }
    });
    
    if (completadas === 6) {
        alert('✅ ¡PERFECTO! Ubicaste todos los continentes correctamente.\n\nHas descubierto que aterrizaron en: EUROPA\n\nAhora debes obtener el código de acceso para la Sala 2.');
        respuestasConsignas[3] = true;
        mostrarCodigoFinal();
    } else {
        alert(`❌ Aún no está completo. Has ubicado ${completadas} de 6 monumentos.`);
    }
}

// ===== NAVEGACIÓN CONSIGNAS =====
function inicializarNavigacionConsignas() {
    const tracker = document.querySelectorAll('.consigna-progress');
    tracker.forEach(el => {
        el.addEventListener('click', function() {
            const consigna = this.getAttribute('data-consigna');
            const numConsigna = parseInt(consigna);
            
            // No permitir ir a consignas futuras no completadas
            if (numConsigna > consignaActual && !respuestasConsignas[numConsigna - 1]) {
                alert('Debes completar las consignas en orden.');
                return;
            }
            
            mostrarConsigna(numConsigna);
        });
    });
}

function mostrarConsigna(num) {
    document.querySelectorAll('.consigna-container').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.consigna-progress').forEach(el => el.classList.remove('active'));
    
    const container = document.getElementById(`consigna${num}`);
    if (container) container.style.display = 'block';
    
    document.querySelector(`[data-consigna="${num}"]`).classList.add('active');
    consignaActual = num;
    
    if (num === 2) inicializarConsigna2();
    if (num === 3) inicializarConsigna3();
}

function avanzarConsigna() {
    if (consignaActual < 3) {
        setTimeout(() => {
            mostrarConsigna(consignaActual + 1);
        }, 1000);
    } else {
        // Ya completada, ir a código
        mostrarCodigoFinal();
    }
}

// ===== CÓDIGO FINAL =====
function mostrarCodigoFinal() {
    if (respuestasConsignas[1] && respuestasConsignas[2] && respuestasConsignas[3]) {
        document.getElementById('codigoFinal').style.display = 'flex';
        
        const btnEnviar = document.getElementById('enviarCodigo');
        if (btnEnviar) {
            btnEnviar.onclick = verificarCodigoFinal;
        }
    }
}

function verificarCodigoFinal() {
    const input = document.getElementById('codigoInput').value.toUpperCase();
    const mensaje = document.getElementById('mensajeCodigo');
    
    if (input === codigoFinal) {
        mensaje.textContent = '✅ ¡CORRECTO! El vuelo aterrizó en Europa. Acceso a Sala 2 disponible.';
        mensaje.style.color = '#27ae60';
        setTimeout(() => {
            window.location.href = '/Home/Sala2'; // Cambiar a la ruta de Sala 2 cuando exista
        }, 2500);
    } else {
        mensaje.textContent = '❌ Código incorrecto. Revisa las pistas de las consignas anteriores.';
        mensaje.style.color = '#e74c3c';
        document.getElementById('codigoInput').value = '';
    }
}

function inicializarEventosBotones() {
    const btnVerificar2 = document.getElementById('verificarConsigna2');
    if (btnVerificar2) {
        btnVerificar2.addEventListener('click', verificarMapaRoto);
    }
}

function verificarMapaRoto() {
    const slots = document.querySelectorAll('.slot-puzzle');
    const mapaCorrecto = slots.length > 0 && Array.from(slots).every(slot => {
        const pieza = slot.querySelector('.pieza-puzzle');
        return pieza && pieza.dataset.posicion === slot.dataset.posicion;
    });

    if (!mapaCorrecto) {
        const completas = document.querySelectorAll('.slot-puzzle.correcta').length;
        alert(`❌ Aún falta armar el mapa. Llevás ${completas} de ${slots.length} piezas.`);
        return;
    }

    alert('✅ ¡MAPA RESTAURADO! Ahora sabes que el mundo está dividido en continentes.\n\nPasamos a la siguiente consigna.');
    respuestasConsignas[2] = true;
    mostrarConsigna(3);
}