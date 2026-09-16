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

    function initRoomTimer() {
        const timerEl = document.getElementById('roomTimer');
        if (!timerEl) return;

        const roomKey =
            document.querySelector('.sala1-container') ? 'escapeRoomSala1StartedAt' :
            document.querySelector('.sala2-container') ? 'escapeRoomSala2StartedAt' :
            document.querySelector('.sala3-container') ? 'escapeRoomSala3StartedAt' :
            document.querySelector('.sala4-container') ? 'escapeRoomSala4StartedAt' : 'escapeRoomDefaultStartedAt';

        if (!sessionStorage.getItem(roomKey)) {
            sessionStorage.setItem(roomKey, String(Date.now()));
        }

        const startedAt = Number(sessionStorage.getItem(roomKey));
        const totalSeconds = 30 * 60;
        const endTime = startedAt + (totalSeconds * 1000);

        const updateTimer = () => {
            const remainingMs = Math.max(0, endTime - Date.now());
            const remainingSeconds = Math.ceil(remainingMs / 1000);
            const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
            const seconds = String(remainingSeconds % 60).padStart(2, '0');
            timerEl.textContent = `${minutes}:${seconds}`;

            if (remainingSeconds <= 0) {
                timerEl.textContent = '00:00';
                timerEl.classList.add('timer-finished');
                alert('⏰ Se acabó el tiempo. ¡Perdiste!');
                window.location.href = '/Home/Index';
            }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
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
        const respuestasSala2 = { 1: false, 2: false, 3: false };

        const verificarConsigna1Btn = document.getElementById('verificarConsigna1');
        const mejorImagenesBtn = document.getElementById('mejorarImagenes');
        const codigoSecuenciaInput = document.getElementById('codigoSecuencia');
        const progressItems = document.querySelectorAll('.consigna-progress');

        inicializarDragDropFotos();
        inicializarConnections();

        progressItems.forEach((item) => {
            item.addEventListener('click', function () {
                const numero = Number(this.getAttribute('data-consigna'));
                if (numero > consignaSala2Actual && !respuestasSala2[numero - 1]) {
                    alert('Debes completar las consignas en orden.');
                    return;
                }
                mostrarConsignaSala2(numero);
            });
        });

        if (verificarConsigna1Btn) {
            verificarConsigna1Btn.addEventListener('click', function () {
                const codigo = (codigoSecuenciaInput ? codigoSecuenciaInput.value : '').trim();
                const codigoEsperado = '4-1-5-2-3';

                if (codigo === codigoEsperado) {
                    alert('🟢 ¡BIEN! SISTEMA DE CÁMARAS RESTAURADO\n\nAhora puedes MEJORAR LAS IMÁGENES para analizarlas mejor.');
                    respuestasSala2[1] = true;
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

                alert('🔓 ¡IMÁGENES MEJORADAS!\n\nAhora puedes ver con más claridad. Usa estas pistas para identificar el país.');
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
                    alert('✅ Código correcto. Accediendo a la Sala 3...');
                    window.location.href = '/Home/Sala3';
                    return;
                }

                alert('❌ Código incorrecto. Debes ingresar 41523 para avanzar a la Sala 3.');
            });
        }

        mostrarConsignaSala2(1);
    }

    function inicializarFotosMejoradas() {
        document.querySelectorAll('.fotos-mejoradas img').forEach((img) => {
            if (img && img.getAttribute('src')) img.classList.add('visible');
        });
    }

    function inicializarConnections() {
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
                        boton.classList.add(grupo.color, 'resolved');
                    }
                });
                const categoria = document.createElement('div');
                categoria.className = `connections-grupo ${grupo.color}`;
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
                mostrarConsignaSala2(3);
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
        });

        document.querySelectorAll('.consigna-progress').forEach((item) => {
            const isActive = Number(item.getAttribute('data-consigna')) === numero;
            item.classList.toggle('active', isActive);
        });
    }

    function initSala3() {
        const markers = document.querySelectorAll('.object-marker');
    const listItems = document.querySelectorAll('#objetosRestantes li');

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
                    const puzzleSection = document.getElementById('sala3PuzzleSection');
                    if (puzzleSection) {
                        puzzleSection.hidden = false;
                        alert('✅ ¡Encontraste todos los objetos! Ahora arma el cartel del aeropuerto.');
                    }
                }
            });
        });
    }

    const pieces = document.querySelectorAll('.puzzle-piece');
    const slots = document.querySelectorAll('.puzzle-slot');
    let selectedPiece = null;

    if (pieces.length && slots.length) {
        const applyTransform = (piece) => {
            const deg = Number(piece.dataset.rotation || 0);
            const mirror = piece.dataset.mirror === 'true';
            piece.style.transform = `rotate(${deg}deg)${mirror ? ' scaleX(-1)' : ''}`;
        };

        pieces.forEach((piece) => {
            piece.dataset.rotation = '0';
            applyTransform(piece);

            const rotateButton = piece.querySelector('.rotate-piece');
            if (rotateButton) {
                rotateButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const current = Number(piece.dataset.rotation || 0);
                    piece.dataset.rotation = String((current + 90) % 360);
                    applyTransform(piece);
                });
            }

            piece.addEventListener('click', () => {
                selectedPiece = piece;
                pieces.forEach((other) => other.classList.toggle('selected', other === piece));
            });

            piece.addEventListener('dragstart', (event) => {
                selectedPiece = piece;
                event.dataTransfer.setData('text/plain', piece.dataset.piece);
            });
        });

        slots.forEach((slot) => {
            slot.addEventListener('dragover', (event) => {
                event.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (event) => {
                event.preventDefault();
                slot.classList.remove('drag-over');

                if (!selectedPiece) return;
                const pieceToPlace = selectedPiece;
                const targetSlot = slot.getAttribute('data-slot');

                slot.innerHTML = '';
                slot.appendChild(pieceToPlace);
                pieceToPlace.classList.remove('selected');
                pieceToPlace.dataset.placedSlot = targetSlot;
                selectedPiece = null;

                const allPlaced = Array.from(slots).every((item) => item.querySelector('.puzzle-piece'));
                if (allPlaced) {
                    const solved = Array.from(slots).every((item) => {
                        const piece = item.querySelector('.puzzle-piece');
                        return piece && Number(piece.dataset.correct) === Number(item.dataset.slot);
                    });

                    if (solved) {
                        document.getElementById('puzzleMensaje').textContent = '✅ ¡Rompecabezas armado! La palabra del cartel quedó completa.';
                        document.getElementById('puzzleMensaje').className = 'respuesta-correcta';

                        const conveyorSection = document.getElementById('conveyorSection');
                        if (conveyorSection) {
                            conveyorSection.hidden = false;
                        }
                    }
                }
            });

            slot.addEventListener('click', () => {
                if (!selectedPiece) return;
                const pieceToPlace = selectedPiece;
                const slotNumber = slot.dataset.slot;
                if (slot.querySelector('.puzzle-piece')) {
                    slot.innerHTML = '';
                }
                slot.appendChild(pieceToPlace);
                pieceToPlace.classList.remove('selected');
                pieceToPlace.dataset.placedSlot = slotNumber;
                selectedPiece = null;
            });
        });
    }

    const verificarPuzzleBtn = document.getElementById('verificarPuzzle');
    if (verificarPuzzleBtn) {
        verificarPuzzleBtn.addEventListener('click', () => {
            const respuesta = document.getElementById('aeropuertoRespuesta');
            const mensaje = document.getElementById('puzzleMensaje');
            if (!respuesta || !mensaje) return;

            const texto = respuesta.value.trim().toUpperCase();
            const validAnswers = ['AEROPUERTO DE LUXEMBURGO', 'AÉROPORT DE LUXEMBOURG', 'LUXEMBOURG AIRPORT', 'LUXEMBOURG'];

            if (validAnswers.includes(texto) || (texto.includes('LUXEMBOURG') && texto.includes('AER'))) {
                mensaje.textContent = '✅ ¡Correcto! El aeropuerto corresponde a Luxembourg Airport.';
                mensaje.className = 'respuesta-correcta';

                const conveyorSection = document.getElementById('conveyorSection');
                if (conveyorSection) {
                    conveyorSection.hidden = false;
                }
            } else {
                mensaje.textContent = '❌ No es la respuesta correcta. Piensa en el aeropuerto de Luxemburgo.';
                mensaje.className = 'respuesta-incorrecta';
            }
        });
    }

    const valijas = document.querySelectorAll('.valija');
    let codigoValijas = '';

    if (valijas.length) {
        valijas.forEach((valija) => {
            valija.addEventListener('click', () => {
                if (valija.dataset.usada === 'true') return;

                const correcto = valija.dataset.correct === 'true';
                if (correcto) {
                    valija.dataset.usada = 'true';
                    valija.classList.add('selected');
                    codigoValijas += valija.dataset.number;
                    document.getElementById('codigoSala3').value = codigoValijas;
                    document.getElementById('conveyorMensaje').textContent = '✅ Valija correcta marcada.';
                    document.getElementById('conveyorMensaje').className = 'respuesta-correcta';
                } else {
                    valija.classList.add('wrong');
                    setTimeout(() => valija.classList.remove('wrong'), 500);
                    document.getElementById('conveyorMensaje').textContent = '❌ Esa valija no corresponde al vuelo correcto.';
                    document.getElementById('conveyorMensaje').className = 'respuesta-incorrecta';
                }
            });
        });
    }

    const confirmarCodigoBtn = document.getElementById('confirmarCodigoSala3');
    if (confirmarCodigoBtn) {
        confirmarCodigoBtn.addEventListener('click', () => {
            const codigo = document.getElementById('codigoSala3').value.trim();
            const mensaje = document.getElementById('conveyorMensaje');

            if (codigo === '4816') {
                mensaje.textContent = '✅ Código 4816 correcto. Puedes pasar a la Sala 4.';
                mensaje.className = 'respuesta-correcta';
                setTimeout(() => {
                    window.location.href = '/Home/Sala4';
                }, 1200);
            } else {
                mensaje.textContent = '❌ Código incompleto o incorrecto. Deben ser las valijas del vuelo de Luxemburgo.';
                mensaje.className = 'respuesta-incorrecta';
            }
        });
    }
}

function initSala4() {
    return null;
}

document.addEventListener('DOMContentLoaded', initSalaEscapePage);
document.addEventListener('DOMContentLoaded', initRoomTimer);
