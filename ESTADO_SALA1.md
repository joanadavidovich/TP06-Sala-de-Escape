# 📋 Estado Actual de Sala 1 - Resumen Ejecutivo

## ✅ Completado

### Frontend Sala 1
- ✅ [Views/Home/Sala1.cshtml](Views/Home/Sala1.cshtml) - Interfaz de 3 consignas con estructura completa
- ✅ [wwwroot/css/site.css](wwwroot/css/site.css) - 800+ líneas de estilos (waves, cards, dropzones, etc.)
- ✅ [wwwroot/js/sala1.js](wwwroot/js/sala1.js) - Lógica completa de drag-drop, validación, código final

### Mecánicas de Juego
- ✅ **Consigna 1**: Ordenar 9 imágenes de monumentos
  - Corrección: Verificar que formen la palabra "MAPAMUNDI"
  - Dificultad: SIN PISTAS (removidas como solicitaste)
  
- ✅ **Consigna 2**: Reconstruir mapamundi (versión simplificada)

- ✅ **Consigna 3**: Colocar 6 monumentos en sus continentes
  - Corrección: Validar ubicación correcta de cada uno
  - Dificultad: SIN ETIQUETAS DE CONTINENTE (removidas como solicitaste)

- ✅ **Verificación de Código**: Código "M7E4" = Acceso a Sala 2

### Backend
- ✅ [Controllers/HomeController.cs](Controllers/HomeController.cs) - Actions para Sala1, manejo de sesiones
- ✅ [Models/Salas.cs](Models/Salas.cs) - Entidad Sala actualizada
- ✅ [Models/Partidas.cs](Models/Partidas.cs) - Entidad Partida con sessionId y estado
- ✅ [Models/PiezasMapaPuzzle.cs](Models/PiezasMapaPuzzle.cs) - Entidad para piezas del puzzle

### Configuración
- ✅ [Program.cs](Program.cs) - Integración automática de descarga de imágenes
- ✅ [ImagenDescargador.cs](ImagenDescargador.cs) - Servicio de descarga
- ✅ [descargar_imagenes.ps1](descargar_imagenes.ps1) - Script PowerShell alternativo
- ✅ [descargar_imagenes.bat](descargar_imagenes.bat) - Script batch alternativo

---

## ⚠️ Pendiente: Descargar Imágenes

El código está listo pero **REQUIERE DESCARGAR** las 9 imágenes de monumentos.

### OPCIÓN 1: Automático (Recomendado)
Cuando ejecutes `dotnet run`, el programa descargará automáticamente todas las imágenes.

```bash
cd "z:\2026\Programación\TP06 Sala de Escape"
dotnet run
```

**Qué hace:**
- Verifica que la carpeta `wwwroot/images/sala1` exista
- Descarga 9 imágenes desde Wikimedia Commons
- Si ya existen, las salta
- Toma ~30-60 segundos la primera vez

### OPCIÓN 2: Manual desde Browser
1. Descarga cada imagen haciendo clic derecho → "Guardar imagen como..."
2. Carpeta destino: `z:\2026\Programación\TP06 Sala de Escape\wwwroot\images\sala1\`

Imágenes necesarias:
- `golden-gate.jpg` - Puente Golden Gate (San Francisco, EE.UU.)
- `cristo.jpg` - Cristo Redentor (Río de Janeiro, Brasil)
- `piramides.jpg` - Pirámides de Giza (Giza, Egipto)
- `taj-mahal.jpg` - Taj Mahal (Agra, India)
- `coliseo.jpg` - Coliseo Romano (Roma, Italia)
- `muralla.jpg` - Muralla China
- `opera.jpg` - Ópera de Sydney (Sydney, Australia)
- `eiffel.jpg` - Torre Eiffel (París, Francia)
- `machu.jpg` - Machu Picchu (Perú)

Ver archivo: [DESCARGAR_IMAGENES_SALA1.md](DESCARGAR_IMAGENES_SALA1.md) para URLs exactas.

### OPCIÓN 3: Script PowerShell Manual
```powershell
cd "z:\2026\Programación\TP06 Sala de Escape"
powershell -ExecutionPolicy Bypass -File descargar_imagenes.ps1
```

### OPCIÓN 4: Script Batch Manual
```cmd
cd "z:\2026\Programación\TP06 Sala de Escape"
descargar_imagenes.bat
```

---

## 🗄️ Base de Datos

El código está preparado pero **REQUIERE** ejecutar migraciones:

Archivo: [CreateTablesTP06.sql](CreateTablesTP06.sql)

Ejecuta en SQL Server Management Studio:
1. Conecta a tu servidor SQL (ej: "DESKTOP-XXXX")
2. Selecciona database "TP06"
3. Abre el script y presiona F5

**Nota**: Sin estas tablas, algunos datos no se persistirán, pero la Sala 1 funcionará en "modo demo".

---

## 🎮 Cómo Probar Sala 1

### Pasos:
1. Abre una terminal PowerShell en la carpeta del proyecto
2. Ejecuta: `dotnet run`
3. Abre navegador en: `https://localhost:7119` (o puerto mostrado)
4. Haz clic en el botón de Sala 1 desde el Index
5. Deberías ver las imágenes de los 9 monumentos

### Expected Flow:
1. **Consigna 1**: Arrastra las 9 imágenes para deletrear "MAPAMUNDI" de oeste (izquierda) a este (derecha)
   - Golden Gate (M) → Cristo (A) → Pirámides (P) → Taj Mahal (A) → Coliseo (M) → Muralla (U) → Ópera (N) → Eiffel (D) → Machu (I)
   - Mensaje: "¡Mapa restaurado!" cuando es correcto

2. **Consigna 2**: Pantalla de tránsito (simplificada)

3. **Consigna 3**: Dragging 6 monumentos a 6 continentes (sin etiquetas)
   - Las posiciones correctas se validarán automáticamente

4. **Código Final**: Aparecerá un modal pidiendo el código
   - Código correcto: `M7E4`
   - Desbloquea acceso a Sala 2

---

## 📊 Estructura de Árbol

```
z:\2026\Programación\TP06 Sala de Escape\
├── Views/Home/
│   ├── Index.cshtml (✓ con animaciones)
│   ├── Sala1.cshtml (✓ 3 consignas)
│   ├── Login.cshtml
│   ├── Register.cshtml
│   └── Privacy.cshtml
├── wwwroot/
│   ├── images/
│   │   └── sala1/ (←→ AQUÍ van las 9 JPGs)
│   ├── css/
│   │   └── site.css (✓ 800+ líneas)
│   └── js/
│       └── sala1.js (✓ lógica completa)
├── Controllers/
│   └── HomeController.cs (✓ con métodos de Sala1)
├── Models/
│   ├── Usuario.cs
│   ├── Salas.cs ✓
│   ├── Partidas.cs ✓
│   ├── PiezasMapaPuzzle.cs ✓
│   └── BD.cs
├── Program.cs (✓ con descargador automático)
├── ImagenDescargador.cs (✓ nuevo)
├── CreateTablesTP06.sql (⚠️ requiere ejecutar)
├── DESCARGAR_IMAGENES_SALA1.md (instrucciones)
├── descargar_imagenes.ps1 (script alt)
└── descargar_imagenes.bat (script alt)
```

---

## 🐛 Si algo falla:

### Problema: "Imágenes no aparecen"
- [ ] Verifica que `wwwroot/images/sala1/` exista
- [ ] Verifica que los archivos .jpg estén ahí
- [ ] Abre DevTools (F12) → Console → busca errores 404

### Problema: "Error SQL Server connection"
- [ ] Ejecuta `CreateTablesTP06.sql` en SSMS
- [ ] Verifica que `appsettings.json` tenga la cadena de conexión correcta

### Problema: "Drag-drop no funciona"
- [ ] Abre DevTools (F12)
- [ ] Mira la consola por errores JavaScript
- [ ] Verifica que las imágenes se cargaron (pestañas Network)

---

## 🚀 Próximos Pasos Cuando Sala 1 Esté Lista

- [ ] Crear Sala 2, 3, 4, 5
- [ ] Implementar timer global para todas las salas
- [ ] Agregar leaderboard
- [ ] Agregar efectos de sonido
- [ ] Testing en navegadores diferentes

---

**Última actualización**: Versión 2.0 - Con automatización de descarga de imágenes
