function initSalaEscapePage() {
        if (document.querySelector('.sala1-container')) {
            initSala1();
        }

        if (document.querySelector('.sala2-container')) {
            initSala2();
        }
    }

    function initSala2() {
        const progressItems = document.querySelectorAll('.consigna-progress');
        const consignas = document.querySelectorAll('.consigna-container');
        const verificarConsigna1Btn = document.getElementById('verificarConsigna1');
        const mostrarPistasBtn = document.getElementById('mostrarPistas');
        const mejorImagenesBtn = document.getElementById('mejorarImagenes');
        const codigoSecuenciaInput = document.getElementById('codigoSecuencia');

        progressItems.forEach((item) => {
            item.addEventListener('click', function () {
                const numero = Number(this.getAttribute('data-consigna'));
                mostrarConsignaSala2(numero);
            });
        });

        if (codigoSecuenciaInput) {
            codigoSecuenciaInput.addEventListener('input', function () {
                const valor = this.value.trim();
                if (valor.length === 0 && mejorImagenesBtn) {
                    mejorImagenesBtn.disabled = true;
                    mejorImagenesBtn.textContent = '🔒 MEJORAR IMÁGENES';
                }
            });
        }

        if (verificarConsigna1Btn) {
            verificarConsigna1Btn.addEventListener('click', function () {
                const codigo = (codigoSecuenciaInput ? codigoSecuenciaInput.value : '').trim();
                const codigoEsperado = '4-1-5-2-3';

                if (codigo === codigoEsperado) {
                    alert('🟢 SISTEMA DE CÁMARAS RESTAURADO');
                    if (mejorImagenesBtn) {
                        mejorImagenesBtn.disabled = false;
                        mejorImagenesBtn.textContent = '🔓 MEJORAR IMÁGENES';
                    }
                    if (codigoSecuenciaInput) {
                        codigoSecuenciaInput.value = codigoEsperado;
                    }
                } else {
                    alert('❌ Código incorrecto. Debes reconstruir la secuencia correcta antes de desbloquear la mejora de imágenes.');
                    if (mejorImagenesBtn) mejorImagenesBtn.disabled = true;
                }
            });
        }

        if (mejorImagenesBtn) {
            mejorImagenesBtn.addEventListener('click', function () {
                const fotos = document.querySelectorAll('.foto-secuencia-item img');
                fotos.forEach((foto) => {
                    foto.style.filter = 'none';
                });

                alert('🔓 MEJORAR IMÁGENES activado. Las fotos quedan visibles y listas para analizar.');
            });
        }

        const fotosBorrosas = document.querySelectorAll('.foto-borrosa');
        fotosBorrosas.forEach((foto) => {
            foto.classList.remove('visible');
        });

        if (mostrarPistasBtn) {
            mostrarPistasBtn.addEventListener('click', () => {
                fotosBorrosas.forEach((foto) => {
                    foto.classList.add('visible');
                });
                const placeholder = document.querySelectorAll('.foto-placeholder');
                placeholder.forEach((node) => {
                    node.style.display = 'none';
                });
            });
        }

        const pistas = [
            'Las fotografías fueron tomadas en Europa.',
            'Hay un aeropuerto internacional con movimiento constante.',
            'Los colores y referencias del paisaje coinciden con un país del norte de Europa.',
            'La señal y la bandera apuntan a un país con gran tradición aeroportuaria.'
        ];

        const pistasList = document.getElementById('pistasList');
        if (pistasList) {
            pistasList.innerHTML = pistas
                .map((pista) => '<div class="pistas-list-item">• ' + pista + '</div>')
                .join('');
        }

        const paises = ['ALEMANIA', 'FRANCIA', 'ESPAÑA', 'ITALIA', 'NORUEGA'];
        const paisesGrid = document.getElementById('paisesGrid');
        if (paisesGrid) {
            paisesGrid.innerHTML = '';
            paises.forEach((pais) => {
                const opcion = document.createElement('button');
                opcion.type = 'button';
                opcion.className = 'pais-option';
                opcion.textContent = pais;
                opcion.addEventListener('click', function () {
                    document.querySelectorAll('.pais-option').forEach((item) => item.classList.remove('selected'));
                    this.classList.add('selected');
                });
                paisesGrid.appendChild(opcion);
            });
        }

        const verificarConsigna2Btn = document.getElementById('verificarConsigna2');
        if (verificarConsigna2Btn) {
            verificarConsigna2Btn.addEventListener('click', function () {
                mostrarConsignaSala2(3);
            });
        }

        const verificarConsigna3Btn = document.getElementById('verificarConsigna3');
        if (verificarConsigna3Btn) {
            verificarConsigna3Btn.addEventListener('click', function () {
                const seleccion = document.querySelector('.pais-option.selected');
                if (seleccion && seleccion.textContent.trim() === 'ALEMANIA') {
                    alert('✅ ¡Correcto! Has identificado el país correctamente.');
                } else if (seleccion) {
                    alert('❌ Esa no es la respuesta correcta. Revisa las pistas del aeropuerto y la ubicación europea.');
                } else {
                    alert('❌ Debes seleccionar un país antes de verificar.');
                }
            });
        }

        mostrarConsignaSala2(1);
    }

    function mostrarConsignaSala2(numero) {
        const consignas = document.querySelectorAll('.consigna-container');
        consignas.forEach((consigna) => {
            const isActive = Number(consigna.id.replace('consigna', '')) === numero;
            consigna.classList.toggle('active', isActive);
        });

        document.querySelectorAll('.consigna-progress').forEach((item) => {
            const isActive = Number(item.getAttribute('data-consigna')) === numero;
            item.classList.toggle('active', isActive);
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
                        el.style.left = Math.max(0, Math.min(stage.clientWidth - startRect.width, x)) + 'px';
                        el.style.top = Math.max(0, Math.min(stage.clientHeight - startRect.height, y)) + 'px';
                        // enlarge thumbnail to full piece size for easier placement
                        const fw = parseInt(el.dataset.fullWidth, 10) || startRect.width;
                        const fh = parseInt(el.dataset.fullHeight, 10) || startRect.height;
                        el.style.width = fw + 'px';
                        el.style.height = fh + 'px';
                    }
                    el.setPointerCapture(ev.pointerId);

                    function onMove(e) {
                        const stageRect2 = stage.getBoundingClientRect();
                        const currRect = el.getBoundingClientRect();
                        const x = e.clientX - stageRect2.left - offsetX;
                        const y = e.clientY - stageRect2.top - offsetY;
                        el.style.left = Math.max(0, Math.min(stage.clientWidth - currRect.width, x)) + 'px';
                        el.style.top = Math.max(0, Math.min(stage.clientHeight - currRect.height, y)) + 'px';
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
            if (stage.clientHeight < 200) stage.style.minHeight = '260px';

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
                    btnEnviar.onclick = verificarCodigoFinal;
                }
            }
        }

        function verificarCodigoFinal() {
            const input = document.getElementById('codigoInput').value.toUpperCase();
            const mensaje = document.getElementById('mensajeCodigo');

            if (input === codigoFinal) {
                if (mensaje) {
                    mensaje.textContent = '✅ ¡CORRECTO! El vuelo aterrizó en Europa. Acceso a Sala 2 disponible.';
                    mensaje.style.color = '#27ae60';
                }

                setTimeout(() => {
                    window.location.href = '/Home/Sala2';
                }, 2500);
            } else {
                if (mensaje) {
                    mensaje.textContent = '❌ Código incorrecto. Revisa las pistas de las consignas anteriores.';
                    mensaje.style.color = '#e74c3c';
                }

                const codigoInput = document.getElementById('codigoInput');
                if (codigoInput) {
                    codigoInput.value = '';
                }
            }
        }

        function inicializarEventosBotones() {
            const btnVerificar2 = document.getElementById('verificarConsigna2');
            if (btnVerificar2) {
                btnVerificar2.addEventListener('click', verificarMapaRotoButton);
            }

            const btnVerificar1 = document.getElementById('verificarConsigna1');
            if (btnVerificar1) {
                btnVerificar1.addEventListener('click', verificarConsigna1);
            }

            const btnVerificar3 = document.getElementById('verificarConsigna3');
            if (btnVerificar3) {
                btnVerificar3.addEventListener('click', verificarConsigna3);
            }
        }

        function inicializarNavigacionConsignas() {
            const tracker = document.querySelectorAll('.consigna-progress');
            tracker.forEach((el) => {
                el.addEventListener('click', function () {
                    const consigna = Number(this.getAttribute('data-consigna'));
                    const maxConsignaPermitida = consignaActual;

                    if (consigna > maxConsignaPermitida && !respuestasConsignas[consigna - 1]) {
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

    document.addEventListener('DOMContentLoaded', initSalaEscapePage);
