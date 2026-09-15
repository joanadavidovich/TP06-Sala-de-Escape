function initSalaEscapePage() {
        if (document.querySelector('.sala2-container')) {
            initSala2();
        }
    }

    function initSala2() {
        let consignaSala2Actual = 1;
        const respuestasSala2 = { 1: false, 2: false, 3: false };
        const progressItems = document.querySelectorAll('.consigna-progress');
        const consignas = document.querySelectorAll('.consigna-container');
        const verificarConsigna1Btn = document.getElementById('verificarConsigna1');
        const mostrarPistasBtn = document.getElementById('mostrarPistas');
        const mejorImagenesBtn = document.getElementById('mejorarImagenes');
        const codigoSecuenciaInput = document.getElementById('codigoSecuencia');

        // Inicializar drag and drop para fotos
        inicializarDragDropFotos();

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
        inicializarConnections();

        const verificarConsigna3Btn = document.getElementById('verificarConsigna3');
        if (verificarConsigna3Btn) {
            verificarConsigna3Btn.addEventListener('click', function () {
                const respuesta = document.getElementById('paisRespuesta');
                const mensaje = document.getElementById('paisMensaje');
                const pais = respuesta ? respuesta.value.trim().toUpperCase() : '';
                if (pais === 'LUXEMBURGO') {
                    mensaje.textContent = '✅ ¡Correcto! El aeropuerto está en Luxemburgo. ¡Has completado Sala 2!';
                    mensaje.className = 'respuesta-correcta';
                } else if (pais) {
                    mensaje.textContent = '❌ Esa no es la respuesta. Revisa las pistas y las fotos mejoradas.';
                    mensaje.className = 'respuesta-incorrecta';
                } else {
                    mensaje.textContent = 'Escribe un país antes de verificar.';
                    mensaje.className = 'respuesta-incorrecta';
                }
            });
        }

        mostrarConsignaSala2(1);
    }

    function inicializarFotosMejoradas() {
        // Las fotos mejoradas ahora se muestran desde archivos fijos proporcionados
        // Si los <img> ya tienen `src`, sólo los mostramos; no permitimos subir archivos.
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
                // Mostrar el botón para continuar al país. No dependemos de variables externas
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
        let draggedElement = null;
        let selectedItem = null; // fallback for click-to-place

        // Hacer fotos draggables
        if (fotosPanel) {
            fotosPanel.addEventListener('dragstart', (e) => {
                const card = e.target.closest('.foto-secuencia-item');
                if (!card) return;
                draggedElement = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                // set some data for compatibility with some browsers
                try { e.dataTransfer.setData('text/plain', card.dataset.secuencia || 'foto'); } catch (err) {}
            });

            fotosPanel.addEventListener('dragend', (e) => {
                const card = e.target.closest('.foto-secuencia-item');
                if (!card) return;
                card.classList.remove('dragging');
                // clear draggedElement reference
                if (draggedElement === card) draggedElement = null;
            });

            fotosPanel.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            fotosPanel.addEventListener('drop', (e) => {
                e.preventDefault();
                const sourceEl = draggedElement;
                if (!sourceEl) return;

                const origenContenedor = sourceEl.closest('.slot-contenedor');
                if (origenContenedor) {
                    origenContenedor.dataset.fotoId = '';
                }
                fotosPanel.appendChild(sourceEl);
                sourceEl.classList.remove('dragging', 'selected');
                draggedElement = null;
                actualizarCodigo();
            });
        }

        // Also attach per-item listeners to be robust across browsers
        document.querySelectorAll('.foto-secuencia-item').forEach((item) => {
            item.addEventListener('dragstart', (e) => {
                draggedElement = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                try { e.dataTransfer.setData('text/plain', item.dataset.secuencia || ''); } catch (err) {}
            });
            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                if (draggedElement === item) draggedElement = null;
            });
            // click selects item as fallback
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

        // Preparar slots para recibir fotos
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

                // Determine source element: prefer in-memory reference, fallback to dataTransfer id
                let sourceEl = draggedElement;
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

                // If source is inside another slot, remember its container
                const origenContenedor = sourceEl.closest('.slot-contenedor');

                // If the destination already has an item, move it back to fotosPanel (or to origin)
                if (existing) {
                    if (fotosPanel) {
                        fotosPanel.appendChild(existing);
                    } else if (origenContenedor) {
                        origenContenedor.appendChild(existing);
                    } else {
                        existing.remove();
                    }
                }

                // Move the actual node into the slot container
                // If sourceEl is from fotosPanel or another container, append it directly
                contenedor.appendChild(sourceEl);
                contenedor.dataset.fotoId = sourceEl.dataset.secuencia;

                // If the source was inside a previous slot container, and it's now moved, clear that container
                if (origenContenedor && origenContenedor !== contenedor) {
                    // If origenContenedor still contains the moved node, clear it
                    if (origenContenedor.contains(sourceEl)) {
                        // already moved
                    } else {
                        origenContenedor.innerHTML = '';
                    }
                }

                // Clean up state
                if (sourceEl.classList) sourceEl.classList.remove('dragging');
                if (draggedElement === sourceEl) draggedElement = null;
                selectedItem = null;

                // Actualizar código automáticamente
                actualizarCodigo();
            });
            // click on slot places selectedItem as a fallback
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

            // Verificar si está completo
            if (!codigo.includes('_')) {
                const allFilled = Array.from(slots).every(slot => 
                    slot.querySelector('.slot-contenedor').dataset.fotoId
                );
                if (allFilled) {
                    codigoInput.style.color = '#27ae60';
                    codigoInput.style.fontWeight = 'bold';
                }
            }
        }
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
