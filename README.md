# 🎮 Destino Desconocido - Sala 1 Setup

> Escape room geográfico. Juego de puzzle sobre monumentos mundiales.

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#-inicio-rápido)
2. [Archivo de Imágenes](#-archivo-de-imágenes)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Características Implementadas](#-características-implementadas)
5. [Cómo Jugar](#-cómo-jugar)
6. [Solución de Problemas](#-solución-de-problemas)

---

## 🚀 Inicio Rápido

### Requisitos
- **.NET 9** (o posterior)
- **SQL Server** (LocalDB o Enterprise)
- **Visual Studio Code** o **Visual Studio 2022+**

### Pasos

```bash
# 1. Navega al directorio del proyecto
cd "z:\2026\Programación\TP06 Sala de Escape"

# 2. Ejecuta el proyecto
dotnet run

# 3. Abre el navegador
# Ve a: https://localhost:7119/
# (el puerto puede variar, verás el URL en la terminal)

# 4. Haz clic en "Sala 1" desde la página principal
```

**✨ Las imágenes se descargarán automáticamente en la primera ejecución.**

---

## 📥 Archivo de Imágenes

### Opción A: Automático (RECOMENDADO)
Cuando ejecutas `dotnet run`, el programa descarga automáticamente las 9 imágenes necesarias.

```
wwwroot/images/sala1/
├── golden-gate.jpg    (Puente Golden Gate - EE.UU.)
├── cristo.jpg         (Cristo Redentor - Brasil)
├── piramides.jpg      (Pirámides de Giza - Egipto)
├── taj-mahal.jpg      (Taj Mahal - India)
├── coliseo.jpg        (Coliseo - Italia)
├── muralla.jpg        (Muralla China - China)
├── opera.jpg          (Ópera de Sydney - Australia)
├── eiffel.jpg         (Torre Eiffel - Francia)
└── machu.jpg          (Machu Picchu - Perú)
```

### Opción B: Descargador Interactivo
Abre [DESCARGAR_IMAGENES_INTERACTIVO.html](DESCARGAR_IMAGENES_INTERACTIVO.html) en tu navegador.

1. Haz clic en "Descargar TODAS las imágenes"
2. Tu navegador descargará cada archivo
3. Copia manualmente los archivos a `wwwroot\images\sala1\`

### Opción C: Manual desde Wikimedia
Ver archivo: [DESCARGAR_IMAGENES_SALA1.md](DESCARGAR_IMAGENES_SALA1.md)

---

## 📁 Estructura del Proyecto

```
TP06 Sala de Escape/
├── 📂 Controllers/
│   └── HomeController.cs          ← Lógica de las salas
├── 📂 Models/
│   ├── Usuario.cs
│   ├── Salas.cs
│   ├── Partidas.cs
│   ├── PiezasMapaPuzzle.cs
│   └── BD.cs                      ← Conexión a BD
├── 📂 Views/Home/
│   ├── Index.cshtml               ← Página principal (con animaciones de onda)
│   ├── Sala1.cshtml               ← ⭐ SALA 1 (3 consignas)
│   ├── Login.cshtml
│   ├── Register.cshtml
│   └── Privacy.cshtml
├── 📂 wwwroot/
│   ├── css/
│   │   └── site.css               ← ✓ Estilos centralizados (800+ líneas)
│   ├── js/
│   │   └── sala1.js               ← ✓ Lógica de juego
│   ├── lib/                       ← Bootstrap, jQuery, etc.
│   └── images/
│       └── sala1/                 ← 📥 Las 9 imágenes van aquí
├── Program.cs                     ← ✓ Con descargador automático
├── ImagenDescargador.cs           ← Servicio de descarga
├── TP06.sql                       ← BD original
├── CreateTablesTP06.sql           ← ⚠️ Ejecutar en SSMS
├── README.md                      ← Este archivo
├── ESTADO_SALA1.md                ← Resumen técnico detallado
├── DESCARGAR_IMAGENES_SALA1.md    ← URLs de descarga
├── DESCARGAR_IMAGENES_INTERACTIVO.html ← Descargador visual
├── descargar_imagenes.ps1         ← Script PowerShell
└── descargar_imagenes.bat         ← Script batch
```

---

## ✨ Características Implementadas

### ✅ Página Principal (Index)
- Animación de ondas geográficas
- 5 botones para las salas (Sala 1 funcional)
- Tema geográfico/cartográfico
- Responsive design

### ✅ Sala 1: "El Mapa Destruido"

#### **Consigna 1: La Palabra Mágica**
```
Objetivo: Arrastra las 9 imágenes de monumentos para ordenarlos 
          de OESTE a ESTE, formando la palabra "MAPAMUNDI"

Modo Experto: ❌ NO HAY PISTAS (removidas como solicitaste)
Dificultad: ⚡ ALTA - El jugador debe deducir el patrón

Orden correcto:
1. 🌉 Golden Gate  (M)  ← Todos están en orden oeste-este
2. 🗿 Cristo       (A)     para formar "MAPAMUNDI"
3. 🔺 Pirámides    (P)
4. 🏛️  Taj Mahal   (A)
5. 🏛️  Coliseo     (M)
6. 🧱 Muralla      (U)
7. 🎭 Ópera        (N)
8. 🗼 Eiffel       (D)
9. 🏔️  Machu Picchu(I)

Recompensa: "¡Mapa restaurado!" + Acceso a Consigna 2
```

#### **Consigna 2: Reconstrucción del Mapamundi**
```
Objetivo: Pantalla de tránsito/reconocimiento

(Versión simplificada, puede ampliarse)
```

#### **Consigna 3: Geografía Continental**
```
Objetivo: Arrastra 6 monumentos a los continentes correctos

Modo Experto: ❌ SIN ETIQUETAS DE CONTINENTES
Dificultad: ⚡ ALTA - Debe conocer geografía mundial

Monumentos a colocar:
- 🌉 Puente Golden Gate → América del Norte
- 🗿 Cristo Redentor    → América del Sur
- 🏛️  Coliseo            → Europa
- 🏛️  Taj Mahal          → Asia
- 🎭 Ópera de Sydney    → Oceanía
- 🧱 Muralla China      → Asia

Validación: Automática - Destaca en rojo si está mal
Recompensa: Código final "M7E4"
```

#### **Verificación Final**
```
Modal de código:
Entrada: Código de acceso a Sala 2
Código: M7E4
Recompensa: Desbloquea nuevo juego
```

### ⚙️ Backend

#### Controlador (HomeController.cs)
```csharp
// Métodos principales:
- Index()              ← Página principal
- Sala1()              ← Carga Sala 1 con datos JSON
- StartPartida()       ← Crea sesión de juego
- CompletarPieza()     ← Registra progreso (endpoint AJAX)
```

#### Modelos (Models/)
```
Salas.cs
├── IdSala
├── Nombre
├── Descripcion
├── Orden
└── FechaCreacion

Partidas.cs
├── IdPartida
├── UsuarioId
├── SalaActual
├── SessionId          ← Para continuidad
├── Estado            ← En progreso / Completada
├── NivelActual       ← Qué consigna está jugando
├── PiezasCompletadas ← Conteo
├── FechaInicio
└── FechaFin

PiezasMapaPuzzle.cs
├── Id
├── SalaId
├── PartidaId
├── NumeroPieza      ← 1-9 para Sala 1
├── Region
├── Pista
├── RespuestaCorrecta
├── Completada
└── FechaCompletacion
```

### 🎨 Frontend

#### CSS (wwwroot/css/site.css)
```
- Animaciones de onda para Index
- Grid de 3x3 para imágenes Consigna 1
- Drop zones para continentes Consigna 3
- Modal de código final
- Responsive para móvil, tablet, desktop
- Tema de colores: azul marino + dorado + verde
```

#### JavaScript (wwwroot/js/sala1.js)
```javascript
// Funciones principales:
inicializarConsigna1()    // Carga 9 imágenes, shuffle de orden
inicializarConsigna3()    // Carga 6 monumentos sin continentes

dragStartConsigna1()      // Evento drag start
dropConsigna1()           // Evento drop
verificarConsigna1()      // Valida "MAPAMUNDI"

dragStartConsigna3()      // Drag para continentes
dropConsigna3()           // Drop en continentes
verificarConsigna3()      // Valida ubicaciones

mostrarCodigoFinal()      // Modal de código
verificarCodigoFinal()    // Valida "M7E4"
```

---

## 🎮 Cómo Jugar

### Flujo de Juego

1. **Inicio**
   - Ve a `https://localhost:7119/`
   - Haz clic en "SALA 1 — EL MAPA DESTRUIDO"

2. **Consigna 1: Ordenar Imágenes**
   - Ves 9 imágenes de monumentos en orden aleatorio
   - Arrastra cada imagen al slot vacío de la izquierda
   - Mantén el ratón sobre el slot y suelta para dejar caer
   - Si es correcto → "¡Mapa restaurado!"
   - Si es incorrecto → "No es correcto. Continúa intentando..."

3. **Consigna 2: Transición**
   - Ver el mapa restaurándose
   - Presionar botón "Siguiente"

4. **Consigna 3: Monmumentos por Continente**
   - Ves 6 monumentos sin etiquetar
   - Arrastra cada uno al continente correcto
   - Las validaciones ocurren en tiempo real
   - 6/6 correctos → Desbloquea modal de código

5. **Código Final**
   - Modal pide "Código de Acceso"
   - Ingresa: `M7E4`
   - ✅ Acceso a Sala 2 permitido

---

## 🐛 Solución de Problemas

### Problema: "Las imágenes no aparecen / son rotas"

**Posibles causas:**
1. No se descargaron automáticamente
2. Archivo de imagen corrupto
3. Ruta incorrecta

**Solución:**
```
1. Abre: DESCARGAR_IMAGENES_INTERACTIVO.html
2. Haz clic: "Descargar TODAS las imágenes"
3. Los navegador descargará los .jpg
4. Copia manualmente a: wwwroot\images\sala1\
5. Actualiza navegador (Ctrl+Shift+K para vaciar caché)
```

### Problema: "Error: Cannot connect to database"

**Posibles causas:**
1. SQL Server no está ejecutándose
2. Cadena de conexión incorrecta en `appsettings.json`
3. Base de datos TP06 no existe

**Soluciones:**
```
A) Ejecuta CreateTablesTP06.sql
   - Abre SQL Server Management Studio
   - Conecta a tu servidor (ej: DESKTOP-XXX)
   - Haz clic en "Nueva consulta"
   - Abre CreateTablesTP06.sql
   - Presiona F5

B) Verifica cadena de conexión en appsettings.json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=TP06;Trusted_Connection=true;"
   }
```

### Problema: "Drag-drop no funciona"

**Verificación:**
1. Abre DevTools (F12 en navegador)
2. Pestaña "Console" - busca errores rojos
3. Pestaña "Network" - verifica que sala1.js se cargue (200 OK)
4. Pestaña "Elements" - busca `.imagen-card` con atributos `draggable`

**Si falta `sala1.js`:**
```
- Verifica que exista: wwwroot/js/sala1.js
- Verifica que esté referenciado en: Views/Home/Sala1.cshtml
- Línea debe contener: <script src="/js/sala1.js"></script>
```

### Problema: "Consignas salen del orden (no con cslayout correcto)"

**Solución:**
```css
/* Verifica en site.css */
.sala1-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
}

.consigna-container {
    display: none;  /* Inicialmente oculta */
}

.consigna-container.active {
    display: block;  /* Se muestra cuando activeClass */
}
```

### Problema: "El código final M7E4 no funciona"

**Nota:** Es normal que tarde un poco en procesar.

**Si persiste:**
1. Abre DevTools (F12)
2. Consola → Escribe: `console.log(sessionStorage.getItem('codigoVerificado'));`
3. Debería mostrar: `true` (después de completar Consigna 3)

---

## 📝 Base de Datos

### Ejecutar Migraciones

```sql
-- Abre SQL Server Management Studio
-- Ejecuta: CreateTablesTP06.sql

-- Crea tabla: PiezasMapaPuzzle
-- Agrega columnas a: Partidas, Salas
```

### Estructura de Datos SQL

**PiezasMapaPuzzle:**
```sql
CREATE TABLE PiezasMapaPuzzle (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SalaId INT NOT NULL,
    PartidaId INT NOT NULL,
    NumeroPieza INT,           -- 1-9 para Sala 1
    Region NVARCHAR(100),      -- Continente
    Pista NVARCHAR(500),       -- Ayuda
    RespuestaCorrecta BIT,     -- Validación
    Completada BIT DEFAULT 0,
    FechaCompletacion DATETIME,
    FOREIGN KEY (SalaId) REFERENCES Salas(IdSala),
    FOREIGN KEY (PartidaId) REFERENCES Partidas(IdPartida)
);
```

---

## 🚀 Próximas Fases

- [ ] **Sala 2**: Código de mapas (coordenadas geográficas)
- [ ] **Sala 3**: Historia de exploración
- [ ] **Sala 4**: Problemas de climatología
- [ ] **Sala 5**: Desafío final multironda
- [ ] Timer global (60 minutos)
- [ ] Leaderboard en tiempo real
- [ ] Efectos de sonido
- [ ] Animaciones de transición entre salas
- [ ] Mobile app (React Native)

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa [ESTADO_SALA1.md](ESTADO_SALA1.md) para detalles técnicos
2. Comprueba los pasos en [Solución de Problemas](#-solución-de-problemas)
3. Verifica que `dotnet run` compile sin errores
4. Abre la consola del navegador (F12) para ver errores JavaScript

---

## 📜 Licencia

Proyecto educativo - Año 2026

---

**Último update**: Versión 2.0 con descargador automático de imágenes
**Estado**: ✅ Listo para jugar (con descarga de imágenes)
