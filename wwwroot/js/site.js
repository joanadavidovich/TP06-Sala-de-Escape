function initSalaEscapePage() {
        if (document.querySelector('.sala2-container')) {
            initSala2();
        }
        if (document.querySelector('.sala3-container')) {
            initSala3();
        }
        if (document.querySelector('.sala4-container')) {
            initSala4();
        }
    }

    function desbloquearSala(sala) {
        return fetch('/Home/DesbloquearSala', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sala })
        }).then((response) => response.ok ? response.json() : Promise.reject(new Error('Transición no válida')));
    }

    function guardarNivel(nivel) {
        return fetch('/Home/GuardarNivel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nivel })
        });
    }

    function initRoomTimer() {
    const timerEl = document.getElementById('roomTimer');
    if (!timerEl) return;

    const remainingAtLoad = Number(document.body.dataset.tiempoRestante || 1800);

    const endTime = Date.now() + (remainingAtLoad * 1000);

    let timerInterval = null;
    let pauseEnviado = false;

    const updateTimer = () => {
        const remainingMs = Math.max(0, endTime - Date.now());
        const remainingSeconds = Math.ceil(remainingMs / 1000);

        const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const seconds = String(remainingSeconds % 60).padStart(2, '0');

        timerEl.textContent = `${minutes}:${seconds}`;

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);

            timerEl.textContent = '00:00';
            timerEl.classList.add('timer-finished');

            alert('⏰ Se acabó el tiempo. ¡Perdiste!');
            window.location.href = '/Home/Index';
        }
    };

    const pausarPartida = () => {
        if (pauseEnviado) return;

        pauseEnviado = true;
        fetch('/Home/PausePartida', {
            method: 'POST',
            keepalive: true
        }).catch(() => {});
    };

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    // Cerrar pestaña, cerrar navegador o abandonar la página.
    window.addEventListener('pagehide', pausarPartida);

    // Botón "Cerrar sesión"
    document.querySelectorAll('form[action*="Logout"]').forEach(form => {
        form.addEventListener('submit', pausarPartida);
    });

    // Volver al inicio también pausa.
    document.querySelectorAll('a[href="/"], a[href*="/Home/Index"]').forEach(link => {
        link.addEventListener('click', pausarPartida);
    });
}

    function initSala1() {
        let consignaActual = 1;
        const respuestasConsignas = { 1: false, 2: false, 3: false };
        const codigoFinal = 'M7E4';

        const consigna1 = {
            imagenes: [
                { id: 1, letra: 'M', imagen: '/images/sala1/golden-gate.jpeg', nombre: '1', orden: 0 },
                { id: 2, letra: 'A', imagen: '/images/sala1/cristo.jpg', nombre: '2', orden: 1 },
                { id: 3, letra: 'P', imagen: '/images/sala1/piramides.jpg', nombre: '3', orden: 2 },
                { id: 4, letra: 'A', imagen: '/images/sala1/taj-mahal.jpg', nombre: '4', orden: 3 },
                { id: 5, letra: 'M', imagen: '/images/sala1/coliseo.jpg', nombre: '5', orden: 4 },
                { id: 6, letra: 'U', imagen: '/images/sala1/muralla.jpg', nombre: '6', orden: 5 },
                { id: 7, letra: 'N', imagen: '/images/sala1/opera.jpg', nombre: '7', orden: 6 },
                { id: 8, letra: 'D', imagen: '/images/sala1/eiffel.jpg', nombre: '8', orden: 7 },
                { id: 9, letra: 'I', imagen: '/images/sala1/machu.jpg', nombre: '9', orden: 8 }
            ]
        };

        const consigna3 = {
            monumentos: [
                { id: 1, nombre: 'Torre Eiffel', continente: 'EUROPA', imagen: '/images/sala1/eiffel.jpg', letra: 'E' },
                { id: 2, nombre: 'Estatua de la Libertad', continente: 'AMÉRICA DEL NORTE', imagen: '/images/sala1/liberty.jpg', letra: 'U' },
                { id: 3, nombre: 'Pirámides', continente: 'ÁFRICA', imagen: '/images/sala1/piramides.jpg', letra: 'R' },
                { id: 4, nombre: 'Taj Mahal', continente: 'ASIA', imagen: '/images/sala1/taj-mahal.jpg', letra: 'O' },
                { id: 5, nombre: 'Cristo Redentor', continente: 'AMÉRICA DEL SUR', imagen: '/images/sala1/cristo.jpg', letra: 'P' },
                { id: 6, nombre: 'Ópera Sydney', continente: 'OCEANÍA', imagen: '/images/sala1/opera.jpg', letra: 'A' }
            ]
        };

        let draggedElement = null;

        function mostrarConsigna(num) {
            document.querySelectorAll('.consigna-container').forEach((el) => {
                el.classList.toggle('active', Number(el.id.replace('consigna', '')) === num);
            });

            document.querySelectorAll('.consigna-progress').forEach((el) => {
                el.classList.toggle('active', Number(el.getAttribute('data-consigna')) === num);
            });

            consignaActual = num;

            if (num === 2) {
                inicializarConsigna2();
            }
            if (num === 3) {
                inicializarConsigna3();
            }
        }

        function inicializarConsigna1() {
            const desordenadas = document.getElementById('imagenesDesordenadas');
            if (!desordenadas) return;

            desordenadas.innerHTML = '';
            const imagenesShuffled = [...consigna1.imagenes].sort(() => Math.random() - 0.5);

            imagenesShuffled.forEach((img) => {
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
            const desordenadas = document.getElementById('imagenesDesordenadas');

            slots.forEach((slot) => {
                slot.addEventListener('dragover', function (e) {
                    e.preventDefault();
                    this.classList.add('drag-over');
                });
                slot.addEventListener('dragleave', function () {
                    this.classList.remove('drag-over');
                });
                slot.addEventListener('drop', dropConsigna1);
            });

            if (desordenadas) {
                desordenadas.addEventListener('dragover', function (e) {
                    e.preventDefault();
                    this.classList.add('drag-over');
                });
                desordenadas.addEventListener('dragleave', function () {
                    this.classList.remove('drag-over');
                });
                desordenadas.addEventListener('drop', function (e) {
                    e.preventDefault();
                    this.classList.remove('drag-over');
                    if (!draggedElement) return;

                    const slotOrigen = draggedElement.closest('.orden-slot');
                    if (slotOrigen) {
                        slotOrigen.innerHTML = '';
                    }

                    this.appendChild(draggedElement);
                    draggedElement.style.opacity = '1';
                    draggedElement.classList.remove('dragging');
                    draggedElement = null;
                    actualizarPalabraResultado();
                });
            }
        }

        function dragStartConsigna1(e) {
            const card = e.target.closest('.imagen-card');
            if (!card) return;

            draggedElement = card;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', 'imagen');
        }

        function dragEndConsigna1() {
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
            }
            document.querySelectorAll('.orden-slot').forEach((slot) => slot.classList.remove('drag-over'));
            const desordenadas = document.getElementById('imagenesDesordenadas');
            if (desordenadas) desordenadas.classList.remove('drag-over');
            draggedElement = null;
        }

        function dragOverConsigna1(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        }

        function dragLeaveConsigna1() {
            this.classList.remove('drag-over');
        }

        function dropConsigna1(e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            if (!draggedElement) return;

            const origen = draggedElement.closest('.orden-slot');
            const destino = this;

            if (draggedElement === destino.firstElementChild) return;

            if (destino.classList.contains('orden-slot')) {
                const elementoActual = destino.firstElementChild;

                if (origen && origen !== destino) {
                    origen.innerHTML = '';
                }

                if (elementoActual && origen && origen !== destino) {
                    destino.innerHTML = '';
                    destino.appendChild(draggedElement);
                    origen.appendChild(elementoActual);
                } else if (elementoActual && !origen) {
                    const contenedor = document.getElementById('imagenesDesordenadas');
                    if (contenedor) {
                        contenedor.appendChild(elementoActual);
                    }
                    destino.innerHTML = '';
                    destino.appendChild(draggedElement);
                } else {
                    destino.innerHTML = '';
                    destino.appendChild(draggedElement);
                }
            }

            draggedElement.style.opacity = '1';
            draggedElement.classList.remove('dragging');
            draggedElement = null;
            actualizarPalabraResultado();
        }

        function actualizarPalabraResultado() {
            const slots = document.querySelectorAll('.orden-slot');
            const palabra = Array.from(slots)
                .map((slot) => {
                    const letra = slot.querySelector('.imagen-letra');
                    return letra ? letra.textContent : '_';
                })
                .join('');

            const resultado = document.getElementById('palabraResultado');
            if (resultado) {
                resultado.textContent = palabra;
            }
        }

        function verificarConsigna1() {
            const slots = document.querySelectorAll('.orden-slot');
            const palabra = Array.from(slots)
                .map((slot) => {
                    const letra = slot.querySelector('.imagen-letra');
                    return letra ? letra.textContent : '';
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

        function inicializarConsigna2() {
            const canvas = document.getElementById('mapaCanvas');
            if (!canvas) return;

            const filas = 2;
            const columnas = 3;
            const totalPiezas = filas * columnas;
            // build puzzle board and a stage where pieces are scattered
            canvas.innerHTML = `
                <div class="mapa-puzzle-wrapper">
                    <div class="mapa-puzzle-area" id="mapaPuzzleArea">
                        <div class="mapa-puzzle-board" id="mapaPuzzleBoard"></div>
                        <div class="mapa-puzzle-stage" id="mapaPuzzleStage"></div>
                    </div>
                    <div class="mapa-puzzle-scatter" id="mapaPuzzleScatter" aria-label="Piezas dispersas"></div>
                </div>
            `;

            const area = document.getElementById('mapaPuzzleArea');
            const board = document.getElementById('mapaPuzzleBoard');
            const stage = document.getElementById('mapaPuzzleStage');
            const piezasOrdenadas = Array.from({ length: totalPiezas }, (_, i) => i);
            const piezasMezcladas = [...piezasOrdenadas].sort(() => Math.random() - 0.5);

            // create slots (targets)
            for (let i = 0; i < totalPiezas; i++) {
                const slot = document.createElement('div');
                slot.className = 'mapa-slot';
                slot.dataset.correct = String(i);
                slot.dataset.filled = 'false';
                board.appendChild(slot);
                // allow double-click to remove incorrect placed piece
                slot.addEventListener('dblclick', function () {
                    const pieza = this.querySelector('.mapa-piece');
                    if (!pieza) return;
                    // only allow removal if piece is incorrect
                    if (Number(pieza.dataset.index) !== Number(this.dataset.correct)) {
                        // move back to scatter area (outside the board)
                        if (scatter) {
                            scatter.appendChild(pieza);
                            pieza.style.position = '';
                            pieza.style.left = '';
                            pieza.style.top = '';
                            pieza.dataset.placed = 'false';
                            pieza.dataset.locked = 'false';
                            this.dataset.filled = 'false';
                            this.classList.remove('incorrect');
                        }
                    }
                });
            }

            // after DOM insertion, get slot size and create pieces positioned in the scatter area
            const scatter = document.getElementById('mapaPuzzleScatter');
            const firstSlot = board.querySelector('.mapa-slot');
            const firstSlotRect = firstSlot ? firstSlot.getBoundingClientRect() : null;

            const crearPieza = (index) => {
                const pieza = document.createElement('div');
                pieza.className = 'mapa-piece';
                pieza.dataset.index = String(index);
                pieza.dataset.correct = String(index);
                pieza.dataset.placed = 'false';
                pieza.style.backgroundImage = 'url("/images/sala1/mapamundi.png")';
                pieza.style.backgroundSize = `${columnas * 100}% ${filas * 100}%`;

                const fila = Math.floor(index / columnas);
                const columna = index % columnas;
                pieza.style.backgroundPosition = `${(columna / (columnas - 1)) * 100}% ${(fila / (filas - 1)) * 100}%`;

                // compute piece size from slot dimensions if available
                const areaRect = area.getBoundingClientRect();
                let pieceWidth = firstSlotRect ? Math.floor(firstSlotRect.width) : Math.max(60, Math.floor(areaRect.width / columnas) - 12);
                let pieceHeight = firstSlotRect ? Math.floor(firstSlotRect.height) : Math.max(50, Math.floor(areaRect.height / filas) - 12);
                pieza.dataset.fullWidth = String(pieceWidth);
                pieza.dataset.fullHeight = String(pieceHeight);

                // initial appearance in the scatter area (smaller thumbnails)
                pieza.classList.add('scatter-piece');
                pieza.style.width = Math.max(40, Math.floor(pieceWidth * 0.8)) + 'px';
                pieza.style.height = Math.max(40, Math.floor(pieceHeight * 0.6)) + 'px';
                pieza.dataset.origContainer = 'scatter';

                // pointer-based drag (better control for puzzle snapping)
                pieza.addEventListener('pointerdown', function (ev) {
                    if (this.dataset.placed === 'true' || this.dataset.locked === 'true') return;
                    ev.preventDefault();
                    const el = this;
                    // if piece is in scatter, move it to stage and position absolutely at the pointer
                    const stageRect = stage.getBoundingClientRect();
                    const startRect = el.getBoundingClientRect();
                    const offsetX = ev.clientX - startRect.left;
                    const offsetY = ev.clientY - startRect.top;
                    if (el.parentElement && el.parentElement.id === 'mapaPuzzleScatter') {
                        // append to stage so we can drag freely
                        stage.appendChild(el);
                        el.style.position = 'absolute';
                        // place centered where user clicked
                        const x = ev.clientX - stageRect.left - offsetX;
                        const y = ev.clientY - stageRect.top - offsetY;
                        el.style.left = x + 'px';
                        el.style.top = y + 'px';
                        // enlarge thumbnail to full piece size for easier placement
                        const fw = parseInt(el.dataset.fullWidth, 10) || startRect.width;
                        const fh = parseInt(el.dataset.fullHeight, 10) || startRect.height;
                        el.style.width = fw + 'px';
                        el.style.height = fh + 'px';
                    }
                    el.setPointerCapture(ev.pointerId);

                    function onMove(e) {
                        const stageRect2 = stage.getBoundingClientRect();
                        
                        // Calcular nueva posición X (horizontal)
                        const newX = e.clientX - stageRect2.left - offsetX;
                        el.style.left = newX + 'px';
                        
                        // Calcular nueva posición Y (vertical)
                        const newY = e.clientY - stageRect2.top - offsetY;
                        el.style.top = newY + 'px';
                    }

                    function onUp(e) {
                        el.releasePointerCapture(ev.pointerId);
                        document.removeEventListener('pointermove', onMove);
                        document.removeEventListener('pointerup', onUp);

                                // attempt snap to nearest slot (absolute positioning)
                                const slots = Array.from(document.querySelectorAll('.mapa-slot'));
                                const elRect = el.getBoundingClientRect();
                                let snapped = false;
                                for (const slot of slots) {
                                    const slotRect = slot.getBoundingClientRect();
                                    const dx = (elRect.left + elRect.width / 2) - (slotRect.left + slotRect.width / 2);
                                    const dy = (elRect.top + elRect.height / 2) - (slotRect.top + slotRect.height / 2);
                                    const dist = Math.sqrt(dx * dx + dy * dy);
                                    const threshold = Math.max(slotRect.width, slotRect.height) * 0.45;
                                    if (dist <= threshold && slot.dataset.filled === 'false') {
                                        // compute position relative to area and snap there
                                        const areaRect = area.getBoundingClientRect();
                                        const left = slotRect.left - areaRect.left;
                                        const top = slotRect.top - areaRect.top;
                                        // place piece inside the slot so it fits exactly
                                        slot.appendChild(el);
                                        el.style.position = 'absolute';
                                        // resize piece to exactly match slot and align to its top-left
                                        el.style.width = slotRect.width + 'px';
                                        el.style.height = slotRect.height + 'px';
                                        el.style.left = '0px';
                                        el.style.top = '0px';
                                        el.dataset.placed = 'true';
                                        slot.dataset.filled = 'true';
                                        // mark correctness visually
                                        if (Number(el.dataset.index) === Number(slot.dataset.correct)) {
                                            slot.classList.add('correct');
                                            // lock piece so it cannot be moved
                                            el.dataset.locked = 'true';
                                        } else {
                                            slot.classList.add('incorrect');
                                        }
                                        snapped = true;
                                        break;
                                    }
                                }

                        if (!snapped) {
                            // return to scatter area
                            scatter.appendChild(el);
                            el.style.position = '';
                            el.style.left = '';
                            el.style.top = '';
                        }

                        verificarMapaRoto();
                    }

                    document.addEventListener('pointermove', onMove);
                    document.addEventListener('pointerup', onUp);
                });

                return pieza;
            };

            // add pieces to stage after board is ready
            // ensure stage has a size (it inherits from CSS); if small, force a height
            if (stage.clientHeight < 400) stage.style.minHeight = '700px';
            if (stage.clientWidth < 400) stage.style.minWidth = '800px';

            piezasMezcladas.forEach((index) => {
                const pieza = crearPieza(index);
                // start pieces in the scatter area (outside the board)
                scatter.appendChild(pieza);
            });
        }

        function verificarMapaRotoButton() {
            const slots = document.querySelectorAll('.mapa-slot');
            const correcto = Array.from(slots).every((slot) => {
                const pieza = slot.querySelector('.mapa-piece');
                return pieza && Number(pieza.dataset.index) === Number(slot.dataset.correct);
            });

            if (correcto) {
                alert('✅ ¡MAPA RESTAURADO! El mapa quedó correcto.');
                respuestasConsignas[2] = true;
                mostrarConsigna(3);
            } else {
                alert('❌ El mapa todavía está roto. Ordená las piezas en el lugar correcto.');
            }
        }

        function verificarMapaRoto() {
            const slots = document.querySelectorAll('.mapa-slot');
            const correcto = Array.from(slots).every((slot) => {
                const pieza = slot.querySelector('.mapa-piece');
                return pieza && Number(pieza.dataset.index) === Number(slot.dataset.correct);
            });

            if (correcto) {
                const btn = document.getElementById('verificarConsigna2');
                if (btn) {
                    btn.textContent = 'Mapa correcto';
                    btn.disabled = false;
                }
            }
        }

        function inicializarConsigna3() {
            const monumentosPanel = document.getElementById('monumentosContainer');
            if (!monumentosPanel) return;

            monumentosPanel.innerHTML = '';
            const monumentosMezclados = [...consigna3.monumentos].sort(() => Math.random() - 0.5);

            monumentosMezclados.forEach((monumento) => {
                const card = document.createElement('div');
                card.className = 'monumento-card';
                card.draggable = true;
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
            const monument = consigna3.monumentos.find((m) => m.nombre === this.querySelector('h5').textContent);
            e.dataTransfer.setData('monument', JSON.stringify(monument));
        }

        function dragEndConsigna3() {
            this.classList.remove('dragging');
        }

        function inicializarDropzonesContinentes() {
            const drops = document.querySelectorAll('.drop-zone');
            drops.forEach((zone) => {
                zone.addEventListener('dragover', dragOverContinente);
                zone.addEventListener('drop', dropContinente);
                zone.addEventListener('dragleave', dragLeaveContinente);
            });
        }

        function dragOverContinente(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        }

        function dragLeaveContinente() {
            this.classList.remove('drag-over');
        }

        function dropContinente(e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            if (this.children.length > 0) {
                return;
            }

            const monumentoData = JSON.parse(e.dataTransfer.getData('monument'));
            const continenteZona = this.closest('[data-continente]').getAttribute('data-continente');

            if (monumentoData.continente === continenteZona) {
                this.innerHTML = `<img class="monumento-img" src="${monumentoData.imagen}" alt="${monumentoData.nombre}" draggable="false" onerror="this.src='/images/sala1/placeholder.jpg'">`;
                this.style.background = '#c8e6c9';
                this.style.borderColor = '#27ae60';
            } else {
                alert('❌ No es correcto. Continúa intentando...');
            }
        }

        function verificarConsigna3() {
            const drops = document.querySelectorAll('.drop-zone');
            let completadas = 0;

            drops.forEach((zone) => {
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

        function mostrarCodigoFinal() {
            if (respuestasConsignas[1] && respuestasConsignas[2] && respuestasConsignas[3]) {
                const modal = document.getElementById('codigoFinal');
                if (modal) {
                    modal.hidden = false;
                    modal.style.display = 'flex';
                    modal.classList.add('visible');
                }

                const btnEnviar = document.getElementById('enviarCodigo');
                if (btnEnviar) {
                    btnEnviar.addEventListener('click', function () {
                        const inputCodigo = document.getElementById('codigoInput');
                        const codigoIngresado = inputCodigo ? inputCodigo.value.trim() : '';

                        if (codigoIngresado === codigoFinal) {
                            alert('✅ Código correcto. Accediendo a la siguiente sala...');
                            window.location.href = '/Home/Sala2';
                        } else {
                            alert('❌ Código incorrecto. Intenta nuevamente.');
                        }
                    });
                }
            }
        }

        mostrarConsigna(1);

                function avanzarConsigna() {
            if (consignaActual < 3) {
                setTimeout(() => mostrarConsigna(consignaActual + 1), 800);
            }
        }

        function inicializarEventosBotones() {
            const btnVerificar1 = document.getElementById('verificarConsigna1');
            if (btnVerificar1) btnVerificar1.addEventListener('click', verificarConsigna1);

            const btnVerificar2 = document.getElementById('verificarConsigna2');
            if (btnVerificar2) btnVerificar2.addEventListener('click', verificarMapaRotoButton);

            const btnVerificar3 = document.getElementById('verificarConsigna3');
            if (btnVerificar3) btnVerificar3.addEventListener('click', verificarConsigna3);
        }

        function inicializarNavigacionConsignas() {
            document.querySelectorAll('.consigna-progress').forEach((el) => {
                el.addEventListener('click', function () {
                    const consigna = Number(this.getAttribute('data-consigna'));
                    if (consigna > consignaActual && !respuestasConsignas[consigna - 1]) {
                        alert('Debes completar las consignas en orden.');
                        return;
                    }
                    mostrarConsigna(consigna);
                });
            });
        }

        inicializarConsigna1();
        inicializarEventosBotones();
        inicializarNavigacionConsignas();
        mostrarConsigna(1);
    }

        function initSala2() {
        let consignaSala2Actual = 1;
        const nivelInicial = Number(document.body.dataset.nivelActual || 1);
        const respuestasSala2 = { 1: nivelInicial > 1, 2: nivelInicial > 2, 3: false };

        const verificarConsigna1Btn = document.getElementById('verificarConsigna1');
        const mejorImagenesBtn = document.getElementById('mejorarImagenes');
        const continuarFotosBtn = document.getElementById('continuarFotos');
        const codigoSecuenciaInput = document.getElementById('codigoSecuencia');
        const progressItems = document.querySelectorAll('.consigna-progress');

        function mostrarListaSala2() {
            document.querySelectorAll('.sala2-container .consigna-container').forEach((item) => { item.style.display = 'none'; });
            const lista = document.getElementById('sala2Juegos');
            if (lista) lista.hidden = false;
            document.querySelectorAll('#sala2Juegos [data-game-item]').forEach((item) => {
                const numero = Number(item.dataset.gameItem);
                const disponible = numero === 1 || respuestasSala2[numero - 1];
                const completo = respuestasSala2[numero];
                const boton = item.querySelector('.game-open');
                item.classList.toggle('is-locked', !disponible);
                item.classList.toggle('is-complete', completo);
                if (boton) {
                    boton.disabled = !disponible || completo;
                    boton.textContent = completo ? 'Completado' : disponible ? 'Abrir juego' : 'Bloqueado';
                }
            });
        }

        document.querySelectorAll('#sala2Juegos [data-open-game]').forEach((button) => {
            button.addEventListener('click', () => {
                const numero = Number(button.dataset.openGame);
                if (numero > 1 && !respuestasSala2[numero - 1]) return;
                document.getElementById('sala2Juegos').hidden = true;
                mostrarConsignaSala2(numero);
            });
        });

        const pistaSala2 = document.getElementById('pistaSala2');
        const pistaSala2Texto = document.getElementById('pistaSala2Texto');
        if (pistaSala2 && pistaSala2Texto) {
            pistaSala2.addEventListener('click', () => { pistaSala2Texto.hidden = !pistaSala2Texto.hidden; });
        }

        const pistaSala2Orden = document.getElementById('pistaSala2Orden');
        const pistaSala2OrdenTexto = document.getElementById('pistaSala2OrdenTexto');
        if (pistaSala2Orden && pistaSala2OrdenTexto) {
            pistaSala2Orden.addEventListener('click', () => { pistaSala2OrdenTexto.hidden = !pistaSala2OrdenTexto.hidden; });
        }

        inicializarDragDropFotos();
        inicializarConnections(() => {
            respuestasSala2[2] = true;
            guardarNivel(3);
            mostrarListaSala2();
        });

        if (verificarConsigna1Btn) {
            verificarConsigna1Btn.addEventListener('click', function () {
                const codigo = (codigoSecuenciaInput ? codigoSecuenciaInput.value : '').trim();
                const codigoEsperado = '4-1-5-2-3';

                if (codigo === codigoEsperado) {
                    alert('🟢 ¡BIEN! SISTEMA DE CÁMARAS RESTAURADO\n\nAhora puedes MEJORAR LAS IMÁGENES para analizarlas mejor.');
                    consignaSala2Actual = Math.max(consignaSala2Actual, 2);
                    if (mejorImagenesBtn) {
                        mejorImagenesBtn.disabled = false;
                        mejorImagenesBtn.textContent = '🔓 MEJORAR IMÁGENES';
                    }
                } else {
                    alert('❌ Código incorrecto.\n\nDebes colocar las fotos en el orden correcto. El código se generará automáticamente.\n\nRecuerda: Arrastra cada foto al número (1-5) en que crees que fue tomada.');
                    if (mejorImagenesBtn) mejorImagenesBtn.disabled = true;
                }
            });
        }

        if (mejorImagenesBtn) {
            mejorImagenesBtn.addEventListener('click', function () {
                const fotos = document.querySelectorAll('.foto-secuencia-item img');
                fotos.forEach((foto) => {
                    foto.style.filter = 'brightness(1.3) contrast(1.2)';
                });

                const panelMejoradas = document.getElementById('fotosMejoradas');
                if (panelMejoradas) {
                    panelMejoradas.hidden = false;
                }

                if (continuarFotosBtn) continuarFotosBtn.hidden = false;
                alert('🔓 ¡IMÁGENES MEJORADAS!\n\nAhora podés ver con más claridad. Revisá las cinco imágenes antes de continuar al análisis.');
            });
        }

        if (continuarFotosBtn) {
            continuarFotosBtn.addEventListener('click', () => {
                respuestasSala2[1] = true;
                guardarNivel(2);
                mostrarListaSala2();
            });
        }

        inicializarFotosMejoradas();

        const verificarConsigna3Btn = document.getElementById('verificarConsigna3');
        if (verificarConsigna3Btn) {
            verificarConsigna3Btn.addEventListener('click', function () {
                const respuesta = document.getElementById('paisRespuesta');
                const mensaje = document.getElementById('paisMensaje');
                const pais = respuesta ? respuesta.value.trim().toUpperCase() : '';

                if (pais === 'LUXEMBURGO') {
                    mensaje.textContent = '✅ ¡Correcto! El aeropuerto está en Luxemburgo. Ingresá el código para abrir la siguiente terminal.';
                    mensaje.className = 'respuesta-correcta';
                    respuestasSala2[3] = true;

                    const codePanel = document.getElementById('sala2CodePanel');
                    if (codePanel) {
                        codePanel.hidden = false;
                    }
                } else if (pais) {
                    mensaje.textContent = '❌ Esa no es la respuesta. Revisa las pistas y las fotos mejoradas.';
                    mensaje.className = 'respuesta-incorrecta';
                } else {
                    mensaje.textContent = 'Escribe un país antes de verificar.';
                    mensaje.className = 'respuesta-incorrecta';
                }
            });
        }

        const verificarCodigoSala2Btn = document.getElementById('verificarCodigoSala2');
        if (verificarCodigoSala2Btn) {
            verificarCodigoSala2Btn.addEventListener('click', function () {
                const input = document.getElementById('sala2CodeInput');
                const codigo = input ? input.value.trim() : '';

                if (codigo === '41523') {
                    desbloquearSala(2)
                        .then(() => {
                            alert('✅ Código correcto. Accediendo a la Sala 3...');
                            window.location.href = '/Home/Sala3';
                        })
                        .catch(() => alert('No se pudo registrar el avance. Recargá e intentá nuevamente.'));
                    return;
                }

                alert('❌ Código incorrecto. Debes ingresar 41523 para avanzar a la Sala 3.');
            });
        }

        mostrarListaSala2();
    }

    function inicializarFotosMejoradas() {
        document.querySelectorAll('.fotos-mejoradas img').forEach((img) => {
            if (img && img.getAttribute('src')) img.classList.add('visible');
        });
    }

    function inicializarConnections(onComplete) {
        const palabras = [
            'RÍO', 'PUERTA', 'ROJO', 'EURO', 'FRONTERA', 'PISTA', 'AZUL', 'AMARILLO',
            'VUELO', 'NORTE', 'MONEDA', 'BANCO', 'CAPITAL', 'ESCALA', 'VERDE', 'PAÍS'
        ];
        const grupos = [
            { categoria: 'Relacionadas con un aeropuerto', color: 'connections-aeropuerto', palabras: ['PUERTA', 'PISTA', 'VUELO', 'ESCALA'] },
            { categoria: 'Geografía', color: 'connections-geografia', palabras: ['RÍO', 'FRONTERA', 'NORTE', 'CAPITAL'] },
            { categoria: 'Dinero', color: 'connections-dinero', palabras: ['EURO', 'MONEDA', 'PAÍS', 'BANCO'] },
            { categoria: 'Colores', color: 'connections-colores', palabras: ['ROJO', 'AZUL', 'VERDE', 'AMARILLO'] }
        ];
        const grid = document.getElementById('connectionsGrid');
        const enviar = document.getElementById('verificarConsigna2');
        const seleccionTexto = document.getElementById('connectionsSeleccion');
        const mensaje = document.getElementById('connectionsMensaje');
        const gruposCompletados = document.getElementById('connectionsGrupos');
        const continuar = document.getElementById('continuarConnections');
        const seleccion = new Set();
        const resueltas = new Set();

        if (!grid || !enviar) return;

        const limpiarSeleccion = () => {
            seleccion.clear();
            grid.querySelectorAll('.connection-word.selected').forEach((boton) => {
                boton.classList.remove('selected');
            });
            seleccionTexto.textContent = '0 de 4 seleccionadas';
        };

        palabras.forEach((palabra) => {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'connection-word';
            boton.textContent = palabra;
            boton.dataset.palabra = palabra;
            boton.addEventListener('click', () => {
                if (resueltas.has(palabra)) return;
                if (seleccion.has(palabra)) {
                    seleccion.delete(palabra);
                    boton.classList.remove('selected');
                } else if (seleccion.size < 4) {
                    seleccion.add(palabra);
                    boton.classList.add('selected');
                }
                seleccionTexto.textContent = `${seleccion.size} de 4 seleccionadas`;
            });
            grid.appendChild(boton);
        });

        enviar.addEventListener('click', () => {
            if (seleccion.size !== 4) {
                mensaje.textContent = 'Selecciona exactamente cuatro palabras.';
                mensaje.className = 'respuesta-incorrecta';
                return;
            }

            const elegidas = Array.from(seleccion);
            const grupo = grupos.find((item) => elegidas.every((palabra) => item.palabras.includes(palabra)));
            if (grupo) {
                grupo.palabras.forEach((palabra) => {
                    resueltas.add(palabra);
                    const boton = grid.querySelector(`[data-palabra="${CSS.escape(palabra)}"]`);
                    if (boton) {
                        boton.classList.remove('selected');
                        boton.classList.add('resolved');
                    }
                });
                const categoria = document.createElement('div');
                categoria.className = 'connections-grupo';
                categoria.innerHTML = `<strong>${grupo.categoria}</strong><span>${grupo.palabras.join(' · ')}</span>`;
                gruposCompletados.appendChild(categoria);
                mensaje.textContent = `✅ Grupo correcto: ${grupo.categoria}.`;
                mensaje.className = 'respuesta-correcta';
            } else if (grupos.some((item) => elegidas.filter((palabra) => item.palabras.includes(palabra)).length === 3)) {
                mensaje.textContent = 'Falta una para formar un grupo correcto.';
                mensaje.className = 'respuesta-incorrecta';
            } else {
                mensaje.textContent = '❌ Grupo incorrecto. Prueba otra combinación.';
                mensaje.className = 'respuesta-incorrecta';
            }

            limpiarSeleccion();
            if (resueltas.size === palabras.length) {
                mensaje.textContent = '✅ Completaste todos los grupos. Ya puedes continuar.';
                mensaje.className = 'respuesta-correcta';
                if (enviar) enviar.disabled = true;
                if (continuar) continuar.hidden = false;
            }
        });

        if (continuar) {
            continuar.addEventListener('click', () => {
                continuar.hidden = true;
                if (typeof onComplete === 'function') onComplete();
            });
        }
    }

    function inicializarDragDropFotos() {
        const fotosPanel = document.getElementById('fotosAOrdenar');
        const slots = document.querySelectorAll('.orden-secuencia-slot');
        const codigoInput = document.getElementById('codigoSecuencia');
        let draggedElementSala2 = null;
        let selectedItem = null;

        if (fotosPanel) {
            fotosPanel.addEventListener('dragstart', (e) => {
                const card = e.target.closest('.foto-secuencia-item');
                if (!card) return;
                draggedElementSala2 = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                try { e.dataTransfer.setData('text/plain', card.dataset.secuencia || 'foto'); } catch (err) {}
            });

            fotosPanel.addEventListener('dragend', (e) => {
                const card = e.target.closest('.foto-secuencia-item');
                if (!card) return;
                card.classList.remove('dragging');
                if (draggedElementSala2 === card) draggedElementSala2 = null;
            });

            fotosPanel.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            fotosPanel.addEventListener('drop', (e) => {
                e.preventDefault();
                const sourceEl = draggedElementSala2;
                if (!sourceEl) return;

                const origenContenedor = sourceEl.closest('.slot-contenedor');
                if (origenContenedor) {
                    origenContenedor.dataset.fotoId = '';
                }
                fotosPanel.appendChild(sourceEl);
                sourceEl.classList.remove('dragging', 'selected');
                draggedElementSala2 = null;
                actualizarCodigo();
            });
        }

        document.querySelectorAll('.foto-secuencia-item').forEach((item) => {
            item.addEventListener('dragstart', (e) => {
                draggedElementSala2 = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                try { e.dataTransfer.setData('text/plain', item.dataset.secuencia || ''); } catch (err) {}
            });
            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                if (draggedElementSala2 === item) draggedElementSala2 = null;
            });
            item.addEventListener('click', (ev) => {
                if (selectedItem === item) {
                    item.classList.remove('selected');
                    selectedItem = null;
                } else {
                    document.querySelectorAll('.foto-secuencia-item.selected').forEach(s => s.classList.remove('selected'));
                    item.classList.add('selected');
                    selectedItem = item;
                }
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');

                let sourceEl = draggedElementSala2;
                if (!sourceEl) {
                    let seq = null;
                    try { seq = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text'); } catch (err) { seq = null; }
                    if (seq) {
                        seq = String(seq).trim();
                        const candidate = fotosPanel ? fotosPanel.querySelector(`[data-secuencia="${seq}"]`) : null;
                        if (candidate) sourceEl = candidate;
                    }
                }

                if (!sourceEl) return;

                const contenedor = slot.querySelector('.slot-contenedor');
                const existing = contenedor.querySelector('.foto-secuencia-item');
                const origenContenedor = sourceEl.closest('.slot-contenedor');

                if (existing) {
                    if (fotosPanel) {
                        fotosPanel.appendChild(existing);
                    } else if (origenContenedor) {
                        origenContenedor.appendChild(existing);
                    } else {
                        existing.remove();
                    }
                }

                contenedor.appendChild(sourceEl);
                contenedor.dataset.fotoId = sourceEl.dataset.secuencia;

                if (origenContenedor && origenContenedor !== contenedor) {
                    if (!origenContenedor.contains(sourceEl)) {
                        origenContenedor.innerHTML = '';
                    }
                }

                if (sourceEl.classList) sourceEl.classList.remove('dragging');
                if (draggedElementSala2 === sourceEl) draggedElementSala2 = null;
                selectedItem = null;

                actualizarCodigo();
            });

            slot.addEventListener('click', (e) => {
                if (!selectedItem) return;
                const contenedor = slot.querySelector('.slot-contenedor');
                const existing = contenedor.querySelector('.foto-secuencia-item');
                if (existing && fotosPanel) fotosPanel.appendChild(existing);
                contenedor.appendChild(selectedItem);
                contenedor.dataset.fotoId = selectedItem.dataset.secuencia;
                selectedItem.classList.remove('selected');
                selectedItem = null;
                actualizarCodigo();
            });
        });

        function actualizarCodigo() {
            const codigo = Array.from(slots)
                .map(slot => {
                    const fotoId = slot.querySelector('.slot-contenedor').dataset.fotoId;
                    return fotoId || '_';
                })
                .join('-');

            codigoInput.value = codigo;

            if (!codigo.includes('_')) {
                codigoInput.style.color = '#27ae60';
                codigoInput.style.fontWeight = 'bold';
            }
        }
    }

    function mostrarConsignaSala2(numero) {
        document.querySelectorAll('.consigna-container').forEach((consigna) => {
            const isActive = Number(consigna.id.replace('consigna', '')) === numero;
            consigna.classList.toggle('active', isActive);
            consigna.style.display = isActive ? 'block' : 'none';
        });

        document.querySelectorAll('.consigna-progress').forEach((item) => {
            const isActive = Number(item.getAttribute('data-consigna')) === numero;
            item.classList.toggle('active', isActive);
        });
    }

    function initSala3() {
        const markers = document.querySelectorAll('.object-marker');
    const listItems = document.querySelectorAll('#objetosRestantes li');
        const nivelInicial = Number(document.body.dataset.nivelActual || 1);
        const juegosSala3 = { 1: nivelInicial > 1, 2: nivelInicial > 2, 3: false };

        function mostrarListaSala3() {
            document.querySelectorAll('.sala3-stage > section').forEach((section) => { section.hidden = true; });
            const lista = document.getElementById('sala3Juegos');
            if (lista) lista.hidden = false;
            document.querySelectorAll('#sala3Juegos [data-game-item]').forEach((item) => {
                const numero = Number(item.dataset.gameItem);
                const disponible = numero === 1 || juegosSala3[numero - 1];
                const completo = juegosSala3[numero];
                const boton = item.querySelector('.game-open');
                item.classList.toggle('is-locked', !disponible);
                item.classList.toggle('is-complete', completo);
                if (boton) {
                    boton.disabled = !disponible || completo;
                    boton.textContent = completo ? 'Completado' : disponible ? 'Abrir juego' : 'Bloqueado';
                }
            });
        }

    function mostrarEtapaSala3(etapa) {
        const etapas = [
            document.querySelector('.objetos-section'),
            document.getElementById('sala3PuzzleSection'),
            document.getElementById('conveyorSection')
        ];

        etapas.forEach((elemento, indice) => {
            if (elemento) elemento.hidden = indice !== etapa;
        });

        document.querySelectorAll('.sala3-header .consigna-progress').forEach((item) => {
            item.classList.toggle('active', Number(item.dataset.consigna) === etapa + 1);
        });
    }

    document.querySelectorAll('#sala3Juegos [data-open-game]').forEach((button) => {
        button.addEventListener('click', () => {
            const numero = Number(button.dataset.openGame);
            if (numero > 1 && !juegosSala3[numero - 1]) return;
            document.getElementById('sala3Juegos').hidden = true;
            if (numero === 1) mostrarEtapaSala3(0);
            if (numero === 2) mostrarEtapaSala3(1);
            if (numero === 3) {
                mostrarEtapaSala3(2);
                iniciarCintaSala3();
            }
        });
    });

    mostrarListaSala3();

    if (markers.length) {
        markers.forEach((marker) => {
            marker.addEventListener('click', () => {
                const name = marker.dataset.name;
                const item = document.querySelector(`#objetosRestantes li[data-name="${name}"]`);
                if (!item || item.classList.contains('found')) return;

                item.classList.add('found');
                marker.classList.add('found');

                const mensaje = document.getElementById('objectMessage');
                if (mensaje) {
                    mensaje.textContent = `✅ Encontraste: ${marker.dataset.emoji} ${name}`;
                }

                const remaining = Array.from(listItems).filter((li) => !li.classList.contains('found')).length;
                if (remaining === 0) {
                    juegosSala3[1] = true;
                    guardarNivel(2);
                    mostrarListaSala3();
                }
            });
        });
    }

const puzzlePieces = document.getElementById('puzzlePieces');
const puzzleBoard = document.getElementById('puzzleBoard');
const puzzleMensaje = document.getElementById('puzzleMensaje');

const puzzleSize = 3;

// FOTO FIJA DEL ROMPECABEZAS
const puzzleImageURL = '/images/sala3/rompecabezas.png';

let puzzleSolved = false;


function crearRompecabezas() {

    if (!puzzlePieces || !puzzleBoard) return;

    puzzleSolved = false;

    puzzlePieces.innerHTML = '';
    puzzleBoard.innerHTML = '';

    if (puzzleMensaje) {
        puzzleMensaje.textContent =
            'Mantené apretada una pieza y arrastrala hasta su lugar.';
        puzzleMensaje.className = '';
    }

    // Crear los 9 huecos
    for (let i = 0; i < 9; i++) {

        const slot = document.createElement('div');

        slot.className = 'puzzle-slot';
        slot.dataset.slot = String(i);

        puzzleBoard.appendChild(slot);
    }
    const indices = Array.from(
        { length: 9 },
        (_, i) => i
    );
    indices.sort(() => Math.random() - 0.5);

    indices.forEach(index => {

        const piece = document.createElement('div');

        piece.className = 'puzzle-piece';

        piece.dataset.index = String(index);
        piece.dataset.locked = 'false';

        piece.style.backgroundImage =
            `url("${puzzleImageURL}")`;

        piece.style.backgroundSize = '300% 300%';

        const fila = Math.floor(index / 3);
        const columna = index % 3;

        piece.style.backgroundPosition =
            `${columna * 50}% ${fila * 50}%`;
        piece.draggable = false;

        puzzlePieces.appendChild(piece);

        activarArrastrePieza(piece);
    });
}

function activarArrastrePieza(piece) {
    let arrastre = null;

    piece.addEventListener('pointerdown', (event) => {
        if (piece.dataset.locked === 'true' || arrastre) return;

        event.preventDefault();

        const rect = piece.getBoundingClientRect();
        const boardRect = puzzleBoard.getBoundingClientRect();
        const ancho = boardRect.width / puzzleSize;
        const alto = boardRect.height / puzzleSize;

        arrastre = {
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            ancho,
            alto
        };

        puzzleBoard.appendChild(piece);
        piece.style.position = 'absolute';
        piece.style.width = `${ancho}px`;
        piece.style.height = `${alto}px`;
        piece.style.left = `${event.clientX - boardRect.left - arrastre.offsetX}px`;
        piece.style.top = `${event.clientY - boardRect.top - arrastre.offsetY}px`;
        piece.classList.add('dragging');

        if (piece.setPointerCapture) {
            piece.setPointerCapture(event.pointerId);
        }
    });

    const moverPieza = (event) => {
        if (!arrastre || event.pointerId !== arrastre.pointerId) return;

        event.preventDefault();

        const boardRect = puzzleBoard.getBoundingClientRect();
        const maxX = boardRect.width - arrastre.ancho;
        const maxY = boardRect.height - arrastre.alto;
        const x = Math.max(-arrastre.ancho * 0.25, Math.min(
            event.clientX - boardRect.left - arrastre.offsetX,
            maxX + arrastre.ancho * 0.25
        ));
        const y = Math.max(-arrastre.alto * 0.25, Math.min(
            event.clientY - boardRect.top - arrastre.offsetY,
            maxY + arrastre.alto * 0.25
        ));

        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
    };

    const soltarPieza = (event, cancelar = false) => {
        if (!arrastre || event.pointerId !== arrastre.pointerId) return;

        event.preventDefault();
        const estado = arrastre;
        arrastre = null;
        piece.classList.remove('dragging');

        try {
            if (piece.hasPointerCapture(event.pointerId)) {
                piece.releasePointerCapture(event.pointerId);
            }
        } catch { }

        if (cancelar) {
            volverAPiezas(piece);
            return;
        }

        intentarEncastrar(piece, estado.ancho, estado.alto);
    };

    document.addEventListener('pointermove', moverPieza, { passive: false });
    document.addEventListener('pointerup', soltarPieza, { passive: false });
    document.addEventListener('pointercancel', (event) => soltarPieza(event, true), { passive: false });
}


function intentarEncastrar(piece, anchoPieza, altoPieza) {

    const indexCorrecto =
        Number(piece.dataset.index);

    const boardRect =
        puzzleBoard.getBoundingClientRect();

    const ancho = anchoPieza || boardRect.width / puzzleSize;
    const alto = altoPieza || boardRect.height / puzzleSize;

    const pieceRect =
        piece.getBoundingClientRect();

    const centroX =
        pieceRect.left +
        pieceRect.width / 2;

    const centroY =
        pieceRect.top +
        pieceRect.height / 2;

    const columna =
        indexCorrecto % puzzleSize;

    const fila =
        Math.floor(indexCorrecto / puzzleSize);

    const objetivoX =
        boardRect.left +
        columna * ancho +
        ancho / 2;

    const objetivoY =
        boardRect.top +
        fila * alto +
        alto / 2;

    const distancia =
        Math.sqrt(
            Math.pow(centroX - objetivoX, 2) +
            Math.pow(centroY - objetivoY, 2)
        );
    const tolerancia =
        Math.min(ancho, alto) * 0.45;


    if (distancia <= tolerancia) {

        const slot =
            puzzleBoard.querySelector(
                `.puzzle-slot[data-slot="${indexCorrecto}"]`
            );

        if (!slot) return;

        // Si ya hay una pieza en ese lugar
        if (slot.querySelector('.puzzle-piece')) {

            volverAPiezas(piece);

            return;
        }
        slot.appendChild(piece);

        piece.style.position = 'absolute';

        piece.style.left = '0';
        piece.style.top = '0';

        piece.style.width = '100%';
        piece.style.height = '100%';

        piece.style.backgroundSize = '300% 300%';

        // Nunca rotar
        piece.style.transform = 'none';

        piece.dataset.locked = 'true';

        verificarRompecabezas();

    } else {
        volverAPiezas(piece);
    }
}


function volverAPiezas(piece) {

    piece.dataset.locked = 'false';

    piece.style.position = '';
    piece.style.left = '';
    piece.style.top = '';

    piece.style.width = '';
    piece.style.height = '';

    piece.style.backgroundSize = '300% 300%';

    piece.style.transform = 'none';

    puzzlePieces.appendChild(piece);
}


function verificarRompecabezas() {

    const slots =
        puzzleBoard.querySelectorAll('.puzzle-slot');

    const completo =
        Array.from(slots).every(slot => {

            const piece =
                slot.querySelector('.puzzle-piece');

            if (!piece) return false;

            return Number(piece.dataset.index) ===
                   Number(slot.dataset.slot);
        });


    if (!completo || puzzleSolved) return;

    puzzleSolved = true;

    if (puzzleMensaje) {

        puzzleMensaje.textContent =
            '🎉 ¡FOTO RECONSTRUIDA! Prepará las valijas...';

        puzzleMensaje.className =
            'respuesta-correcta';
    }

    setTimeout(() => {

        juegosSala3[2] = true;
        guardarNivel(3);
        mostrarListaSala3();

    }, 1200);
}
crearRompecabezas();
let codigoValijas = '';
let juegoCintaActivo = false;
let timeoutReinicioCinta = null;

function iniciarCintaSala3() {

    const valijas =
        document.querySelectorAll('.valija');

    if (!valijas.length) return;


    clearTimeout(timeoutReinicioCinta);

    codigoValijas = '';

    juegoCintaActivo = true;


    const codigoInput =
        document.getElementById('codigoSala3');

    if (codigoInput) {
        codigoInput.value = '';
    }


    const mensaje =
        document.getElementById('conveyorMensaje');

    if (mensaje) {

        mensaje.textContent =
            '🧳 ¡ATENCIÓN! Seleccioná únicamente las valijas del vuelo.';

        mensaje.className = '';
    }


    valijas.forEach((valija, index) => {

        valija.dataset.usada = 'false';

        valija.classList.remove(
            'selected',
            'wrong',
            'cinta-reinicio'
        );
        valija.style.setProperty('--valija-delay', `${index * 2.1}s`);
        valija.style.setProperty('--valija-lane', `${18 + (index % 5) * 16}%`);
    });
}

function perderCintaSala3(valijaIncorrecta) {

    if (!juegoCintaActivo) return;

    juegoCintaActivo = false;


    valijaIncorrecta.classList.add('wrong');


    const mensaje =
        document.getElementById('conveyorMensaje');

    if (mensaje) {

        mensaje.textContent =
            '❌ ¡TE EQUIVOCASTE DE VALIJA! La cinta vuelve a comenzar desde cero.';

        mensaje.className =
            'respuesta-incorrecta';
    }
    codigoValijas = '';

    const codigoInput =
        document.getElementById('codigoSala3');

    if (codigoInput) {
        codigoInput.value = '';
    }
    timeoutReinicioCinta = setTimeout(() => {

        iniciarCintaSala3();

    }, 1000);
}

function inicializarCintaSala3() {

    const valijas =
        document.querySelectorAll('.valija');

    if (!valijas.length) return;

    valijas.forEach(valija => {

        if (!valija.querySelector('img')) {

            const image =
                document.createElement('img');

            image.src =
                valija.dataset.image;

            image.alt =
                `Valija ${valija.dataset.number}`;

            image.addEventListener(
                'error',
                () => image.remove()
            );

            valija.prepend(image);
        }
        valija.addEventListener('click', () => {

            if (!juegoCintaActivo) return;

            if (valija.dataset.usada === 'true') {
                return;
            }


            const correcto =
                valija.dataset.correct === 'true';
            if (correcto) {

                valija.dataset.usada = 'true';

                valija.classList.add('selected');


                codigoValijas +=
                    valija.dataset.number;


                const codigoInput =
                    document.getElementById('codigoSala3');

                if (codigoInput) {
                    codigoInput.value =
                        codigoValijas;
                }


                const mensaje =
                    document.getElementById(
                        'conveyorMensaje'
                    );

                if (mensaje) {

                    mensaje.textContent =
                        `✅ Valija ${valija.dataset.number} correcta.`;

                    mensaje.className =
                        'respuesta-correcta';
                }
                const correctas = Array.from(valijas)
                    .filter((v) => v.dataset.correct === 'true').length;
                const seleccionadas = Array.from(valijas)
                    .filter((v) => v.dataset.correct === 'true' && v.dataset.usada === 'true').length;

                if (seleccionadas === correctas) {

                    juegoCintaActivo = false;

                    if (mensaje) {

                        mensaje.textContent =
                            '🎉 ¡Encontraste todas las valijas correctas!';
                    }
                }
            } else {

                perderCintaSala3(valija);
            }

        });
    });


    iniciarCintaSala3();
}
inicializarCintaSala3();

    const confirmarCodigoBtn = document.getElementById('confirmarCodigoSala3');
    if (confirmarCodigoBtn) {
        confirmarCodigoBtn.addEventListener('click', () => {
            const codigo = document.getElementById('codigoSala3').value.trim();
            const mensaje = document.getElementById('conveyorMensaje');

            const codigoValido = codigo.length === 4 &&
                codigo.split('').sort().join('') === '1468';

            if (codigoValido) {
                desbloquearSala(3)
                    .then(() => {
                        mensaje.textContent = '✅ Código 4816 correcto. Puedes pasar a la Sala 4.';
                        mensaje.className = 'respuesta-correcta';
                        setTimeout(() => { window.location.href = '/Home/Sala4'; }, 250);
                    })
                    .catch(() => {
                        mensaje.textContent = 'No se pudo registrar el avance. Recargá e intentá nuevamente.';
                        mensaje.className = 'respuesta-incorrecta';
                    });
            } else {
                mensaje.textContent = '❌ Código incompleto o incorrecto. Deben ser las valijas del vuelo de Luxemburgo.';
                mensaje.className = 'respuesta-incorrecta';
            }
        });
    }
}

function initSala4() {
    const buttons = Array.from(document.querySelectorAll('.simon-button'));
    const roundLabel = document.getElementById('simonRound');
    const statusLabel = document.getElementById('simonStatus');
    const message = document.getElementById('simonMessage');
    const result = document.getElementById('simonResult');
    const simonPanel = document.getElementById('simonPanel');
    const emergencyGame = document.getElementById('emergencyGame');
    const simonGame = document.getElementById('simonGame');
    const luxGame = document.getElementById('luxGame');
    const nivelInicial = Number(document.body.dataset.nivelActual || 1);
    const juegosSala4 = { 1: nivelInicial > 1, 2: nivelInicial > 2, 3: false };
    if (!buttons.length || !roundLabel || !statusLabel || !message || !result) return;

    function mostrarListaSala4() {
        if (simonGame) simonGame.hidden = true;
        if (emergencyGame) emergencyGame.hidden = true;
        if (luxGame) luxGame.hidden = true;
        const lista = document.getElementById('sala4Juegos');
        if (lista) lista.hidden = false;
        document.querySelectorAll('#sala4Juegos [data-game-item]').forEach((item) => {
            const numero = Number(item.dataset.gameItem);
            const disponible = numero === 1 || juegosSala4[numero - 1];
            const completo = juegosSala4[numero];
            const boton = item.querySelector('.game-open');
            item.classList.toggle('is-locked', !disponible);
            item.classList.toggle('is-complete', completo);
            if (boton) {
                boton.disabled = !disponible || completo;
                boton.textContent = completo ? 'Completado' : disponible ? 'Abrir juego' : 'Bloqueado';
            }
        });
    }

    document.querySelectorAll('#sala4Juegos [data-open-game]').forEach((button) => {
        button.addEventListener('click', () => {
            const numero = Number(button.dataset.openGame);
            if (numero > 1 && !juegosSala4[numero - 1]) return;
            document.getElementById('sala4Juegos').hidden = true;
            if (numero === 1) {
                simonGame.hidden = false;
                startRound();
            } else if (numero === 2) {
                emergencyGame.hidden = false;
                iniciarJuegoEmergencia();
            } else {
                luxGame.hidden = false;
                iniciarJuegoLux();
            }
        });
    });

    const roundLengths = [3, 4, 5, 6];
    let round = 0;
    let sequence = [];
    let playerIndex = 0;
    let acceptingInput = false;
    let playbackToken = 0;
    let audioContext = null;

    const tones = { red: 261.63, blue: 329.63, green: 392, yellow: 523.25 };

    const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

    function updateLabels() {
        roundLabel.textContent = `Ronda ${round + 1} de ${roundLengths.length}`;
    }

    function playTone(id) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioContext ||= new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.frequency.value = tones[id] || 330;
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.16, audioContext.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.38);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
    }

    function flashButton(button, duration = 720) {
        button.classList.add('simon-lit');
        playTone(button.dataset.simonId);
        return wait(duration).then(() => button.classList.remove('simon-lit'));
    }

    async function showSequence() {
        const token = ++playbackToken;
        acceptingInput = false;
        playerIndex = 0;
        statusLabel.textContent = 'Memorizá la secuencia';
        message.textContent = '';
        await wait(900);

        for (const id of sequence) {
            if (token !== playbackToken) return;
            const button = buttons.find((item) => item.dataset.simonId === id);
            if (button) await flashButton(button);
            await wait(320);
        }

        if (token === playbackToken) {
            acceptingInput = true;
            statusLabel.textContent = 'Ahora repetila';
        }
    }

    function startRound() {
        updateLabels();
        sequence = Array.from({ length: roundLengths[round] }, () => {
            return buttons[Math.floor(Math.random() * buttons.length)].dataset.simonId;
        });
        showSequence();
    }

    function restartFromZero() {
        playbackToken++;
        acceptingInput = false;
        round = 0;
        result.hidden = true;
        message.textContent = 'Te equivocaste. El panel se reinicia desde la ronda 1.';
        message.className = 'sala4-message sala4-error';
        setTimeout(startRound, 900);
    }

    function completeGame() {
        acceptingInput = false;
        statusLabel.textContent = 'Secuencia completa';
        message.textContent = 'Sistema de navegación restaurado. Preparando la puerta de emergencia.';
        message.className = 'sala4-message sala4-success';
        result.hidden = false;
        if (simonPanel) simonPanel.hidden = true;
        juegosSala4[1] = true;
        guardarNivel(2);
        mostrarListaSala4();
    }

    function iniciarJuegoEmergencia() {
        const buttons = Array.from(document.querySelectorAll('.emergency-button'));
        const clues = Array.from(document.querySelectorAll('.emergency-clue'));
        const clueMessage = document.getElementById('emergencyClueMessage');
        const sequenceLabel = document.getElementById('emergencySequence');
        const messageLabel = document.getElementById('emergencyMessage');
        const finalEscape = document.getElementById('finalEscape');
        const correctSequence = ['red', 'star', 'blue', 'green', 'plane', 'yellow'];
        let entered = [];
        let finished = false;

        clues.forEach((clue) => {
            clue.addEventListener('click', () => {
                clue.classList.add('revealed');
                clueMessage.textContent = clue.dataset.clue;
            });
        });

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                if (finished) return;
                const position = entered.length;
                if (button.dataset.emergencyId !== correctSequence[position]) {
                    entered = [];
                    buttons.forEach((item) => item.classList.remove('emergency-pressed'));
                    sequenceLabel.textContent = 'Secuencia incorrecta. Volvé a empezar: _ _ _ _ _ _';
                    messageLabel.textContent = 'El panel se reinició.';
                    messageLabel.className = 'sala4-message sala4-error';
                    return;
                }

                entered.push(button.dataset.emergencyId);
                button.classList.add('emergency-pressed');
                sequenceLabel.textContent = `Secuencia: ${entered.map((id) => buttons.find((item) => item.dataset.emergencyId === id).textContent).join(' → ')}${entered.length < correctSequence.length ? ' → _' : ''}`;
                messageLabel.textContent = `${entered.length} de ${correctSequence.length} posiciones correctas.`;
                messageLabel.className = 'sala4-message sala4-success';

                if (entered.length === correctSequence.length) {
                    finished = true;
                    buttons.forEach((item) => item.disabled = true);
                    iniciarCuentaRegresiva(messageLabel, finalEscape);
                }
            });
        });
    }

    function iniciarCuentaRegresiva(messageLabel, finalEscape) {
        let restante = 3;
        messageLabel.className = 'sala4-message sala4-success emergency-countdown';
        messageLabel.textContent = `${restante}...`;
        const timer = setInterval(() => {
            restante--;
            if (restante > 0) {
                messageLabel.textContent = `${restante}...`;
                return;
            }
            clearInterval(timer);
            messageLabel.textContent = '🚨 ALARMA DESACTIVADA';
            finalEscape.hidden = false;
            juegosSala4[2] = true;
            guardarNivel(3);
            mostrarListaSala4();
        }, 900);
    }

    function iniciarJuegoLux() {
        const respuestas = ['ESTE', 'LUZ', 'CRUCE'];
        const letras = ['L', 'U', 'X'];
        const descubiertas = [];

        document.querySelectorAll('.lux-search-button').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.luxClue);
                button.disabled = true;
                document.getElementById(`luxClue${index}`).hidden = false;
                document.getElementById(`luxAnswer${index}`).hidden = false;
                document.getElementById(`luxLabel${index}`).hidden = false;
                document.querySelector(`[data-lux-check="${index}"]`).hidden = false;
            }, { once: true });
        });

        document.querySelectorAll('.lux-check').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.luxCheck);
                const answer = document.getElementById(`luxAnswer${index}`).value.trim().toUpperCase();
                const found = document.getElementById(`luxFound${index}`);
                if (answer !== respuestas[index]) {
                    found.hidden = false;
                    found.textContent = 'Todavía no coincide con la pista.';
                    found.className = 'lux-found respuesta-incorrecta';
                    return;
                }

                if (!descubiertas.includes(index)) descubiertas.push(index);
                found.hidden = false;
                found.textContent = `Pista confirmada. Letra descubierta: ${letras[index]}`;
                found.className = 'lux-found respuesta-correcta';
                button.disabled = true;
                document.getElementById(`luxAnswer${index}`).disabled = true;
                if (descubiertas.length === 3) document.getElementById('luxCodePanel').hidden = false;
            });
        });

        document.getElementById('verifyLuxCode')?.addEventListener('click', () => {
            const input = document.getElementById('luxCodeInput');
            const message = document.getElementById('luxCodeMessage');

            if (input.value.trim().toUpperCase() === 'LUX') {
                message.textContent = 'CÓDIGO CORRECTO';
                message.className = 'sala4-message sala4-success';

                document.getElementById('luxFinalResult').hidden = false;

                // Guarda la partida como escapada
                fetch('/Home/CompletarPartida', {
                    method: 'POST'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo guardar la partida');
                    }

                    return response.json();
                })
                .then(data => {
                    console.log('Partida guardada como escapada');
                })
                .catch(error => {
                    console.error('Error al guardar la partida:', error);
                });

            } else {
                message.textContent = 'Las tres pistas todavía no forman el código correcto.';
                message.className = 'sala4-message sala4-error';
            }
        });
    }

    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            if (!acceptingInput) return;

            const expected = sequence[playerIndex];
            if (button.dataset.simonId !== expected) {
                restartFromZero();
                return;
            }

            acceptingInput = false;
            await flashButton(button, 260);
            playerIndex++;

            if (playerIndex < sequence.length) {
                acceptingInput = true;
                return;
            }

            acceptingInput = false;
            if (round === roundLengths.length - 1) {
                completeGame();
                return;
            }

            round++;
            message.textContent = '¡Bien! Preparando la siguiente ronda.';
            message.className = 'sala4-message sala4-success';
            setTimeout(startRound, 800);
        });
    });

    mostrarListaSala4();
}

document.addEventListener('DOMContentLoaded', initSalaEscapePage);
document.addEventListener('DOMContentLoaded', initRoomTimer);
function alternarMusica() { 
    const audio = document.getElementById("musicaEscape"); 
    const boton = document.getElementById("botonMusica"); 
    if (audio.muted) { 
        audio.muted = false; boton.textContent = "🔊"; 
    } 
    else { 
        audio.muted = true; boton.textContent = "🔇"; 
    }
}