# 📚 Índice de Documentación - Sala 1

> **Guía rápida**: Empieza por [README.md](README.md) si es tu primer contacto

---

## 📄 Documentos (en orden de prioridad)

### 🟢 **INICIO AQUÍ**

#### 1. [README.md](README.md) - **Comienza aquí**
- Guía completa para ejecutar la aplicación
- Requisitos del sistema
- Pasos de inicio rápido
- Instrucciones de descarga de imágenes
- Cómo jugar paso-a-paso
- Solución de problemas

**Tiempo de lectura**: 5-10 minutos  
**Acción**: Ejecuta `dotnet run`

---

### 🟡 **INFORMACIÓN TÉCNICA**

#### 2. [ESTADO_SALA1.md](ESTADO_SALA1.md) - **Para desarrolladores**
- Resumen ejecutivo de lo implementado
- Estructura técnica detallada
- Modelos, controladores, vistas
- Estado de bases de datos
- Checklist de tareas completadas
- Cambios recientes

**Tiempo de lectura**: 10-15 minutos  
**Acción**: Entender la arquitectura

#### 3. [CHECKLIST.md](CHECKLIST.md) - **Para verificación**
- Checklist técnico completo
- Testing manual paso-a-paso
- Troubleshooting específico
- Datos de referencia (órdenes correctas)
- Valores críticos para debugging

**Tiempo de lectura**: 5-10 minutos  
**Acción**: Verificar que todo funciona

#### 4. [IMPLEMENTACION_COMPLETA.md](IMPLEMENTACION_COMPLETA.md) - **Resumen ejecutivo**
- Qué se ha hecho resumidamente
- Archivos modificados/creados
- Mecánicas de juego
- Tecnologías utilizadas
- Testing recomendado

**Tiempo de lectura**: 10 minutos  
**Acción**: Conocer el proyecto rápidamente

---

### 🟠 **DESCARGAS DE IMÁGENES**

#### 5. [DESCARGAR_IMAGENES_SALA1.md](DESCARGAR_IMAGENES_SALA1.md) - **URLs directas**
- URLs de Wikimedia Commons para cada imagen
- Scripts PowerShell y batch
- Instrucciones de descarga manual

**Tiempo de lectura**: 3 minutos  
**Acción**: Si descarga automática falla

#### 6. [DESCARGAR_IMAGENES_INTERACTIVO.html](DESCARGAR_IMAGENES_INTERACTIVO.html) - **Interfaz gráfica**
- Descargador visual e interactivo
- Muestra previews de imágenes
- Descarga individual o en lote
- **Abrir en navegador**

**Tiempo de uso**: 2-5 minutos  
**Acción**: Alternativa visual a scripts

#### 7. [descargar_imagenes.ps1](descargar_imagenes.ps1) - **Script PowerShell**
```powershell
cd "z:\2026\Programación\TP06 Sala de Escape"
powershell -ExecutionPolicy Bypass -File descargar_imagenes.ps1
```

#### 8. [descargar_imagenes.bat](descargar_imagenes.bat) - **Script Batch**
```cmd
cd "z:\2026\Programación\TP06 Sala de Escape"
descargar_imagenes.bat
```

---

## 🗂️ Archivos de Código Fuente

### Backend
- **[Controllers/HomeController.cs](Controllers/HomeController.cs)** - Lógica de Sala 1
- **[Program.cs](Program.cs)** - Configuración + descargador autoático
- **[ImagenDescargador.cs](ImagenDescargador.cs)** - Servicio de descarga

### Frontend
- **[Views/Home/Sala1.cshtml](Views/Home/Sala1.cshtml)** - HTML de Sala 1
- **[wwwroot/css/site.css](wwwroot/css/site.css)** - Estilos (850+ líneas)
- **[wwwroot/js/sala1.js](wwwroot/js/sala1.js)** - Lógica de juego

### Modelos
- **[Models/Salas.cs](Models/Salas.cs)** - Entidad Sala
- **[Models/Partidas.cs](Models/Partidas.cs)** - Entidad Partida
- **[Models/PiezasMapaPuzzle.cs](Models/PiezasMapaPuzzle.cs)** - Entidad Pieza
- **[Models/BD.cs](Models/BD.cs)** - Acceso a datos

### Base de Datos
- **[CreateTablesTP06.sql](CreateTablesTP06.sql)** - Migraciones SQL (opcional)

---

## 🎮 Flujo Rápido de Uso

```
1. LEE          → README.md (5 min)
2. EJECUTA      → dotnet run (30 seg)
3. DESCARGA     → Automática o usa DESCARGAR_IMAGENES_INTERACTIVO.html
4. JUEGA        → Abre https://localhost:7119 → Haz clic "SALA 1"
5. VERIFICA     → CHECKLIST.md si hay problemas
```

---

## 🔍 ¿Qué Busco?

### "¿Cómo ejecuto la aplicación?"
→ [README.md](README.md) - Sección "🚀 Inicio Rápido"

### "¿Qué está implementado?"
→ [ESTADO_SALA1.md](ESTADO_SALA1.md) - Sección "✅ Completado"

### "¿Cómo juego?"
→ [README.md](README.md) - Sección "🎮 Cómo Jugar"

### "Las imágenes no se descargan"
→ [DESCARGAR_IMAGENES_INTERACTIVO.html](DESCARGAR_IMAGENES_INTERACTIVO.html)  
O [DESCARGAR_IMAGENES_SALA1.md](DESCARGAR_IMAGENES_SALA1.md)

### "¿Qué debo verificar?"
→ [CHECKLIST.md](CHECKLIST.md) - Testing Manual

### "Error en consola JavaScript"
→ [CHECKLIST.md](CHECKLIST.md) - Sección "Solución de Problemas"

### "Error en SQL"
→ [ESTADO_SALA1.md](ESTADO_SALA1.md) - Sección "🗄️ Base de Datos"

### "¿Cómo funciona el código?"
→ [IMPLEMENTACION_COMPLETA.md](IMPLEMENTACION_COMPLETA.md) - Sección "🎓 Cómo Funciona"

### "¿Cuál es el orden correcto?"
→ [CHECKLIST.md](CHECKLIST.md) - Sección "Datos de Referencia"

---

## 📊 Resumen de Archivos

| Documento | Tipo | Tamaño | Público | Propósito |
|-----------|------|--------|---------|-----------|
| README.md | Markdown | ~12KB | ✅ Sí | Guía de usuario |
| ESTADO_SALA1.md | Markdown | ~20KB | ✅ Sí | Resumen técnico |
| CHECKLIST.md | Markdown | ~15KB | ✅ Sí | Verificación |
| IMPLEMENTACION_COMPLETA.md | Markdown | ~10KB | ✅ Sí | Resumen ejecutivo |
| DESCARGAR_IMAGENES_SALA1.md | Markdown | ~3KB | ✅ Sí | URLs de descarga |
| DESCARGAR_IMAGENES_INTERACTIVO.html | HTML | ~15KB | ✅ Sí | App descargador |
| descargar_imagenes.ps1 | PowerShell | ~2KB | ✅ Sí | Script de descarga |
| descargar_imagenes.bat | Batch | ~2KB | ✅ Sí | Script Windows |
| INDICE.md | Markdown | Este archivo | ✅ Sí | Mapa de docs |

---

## 🎯 Escenarios Comunes

### Escenario 1: "Ejecuto por primera vez"
```
ORDEN RECOMENDADO:
1. Leer: README.md (inicio rápido)
2. Ejecutar: dotnet run
3. Abrir: https://localhost:7119
4. Si falla descarga: DESCARGAR_IMAGENES_INTERACTIVO.html
5. Jugar: Haz clic en "SALA 1"
TIEMPO: 10 minutos
```

### Escenario 2: "Las imágenes no se cargan"
```
ORDEN DE ACCIÓN:
1. Leer: CHECKLIST.md (problema: imágenes no aparecen)
2. Intentar: DESCARGAR_IMAGENES_INTERACTIVO.html
3. Si falla: Ejecutar descargar_imagenes.bat manualmente
4. Copiar: Archivos a wwwroot\images\sala1\
5. Actualizar: Navegador (Ctrl+Shift+K)
TIEMPO: 5 minutos
```

### Escenario 3: "Código no valida"
```
ORDEN:
1. Leer: CHECKLIST.md (Paso 5: Código Final)
2. Verificar: Que haya completado Consigna 3 (6/6)
3. Referencia: CHECKLIST.md (Datos de Referencia)
4. Código correcto: M7E4
TIEMPO: 2 minutos
```

### Escenario 4: "Soy desarrollador, quiero entender la arquitectura"
```
ORDEN:
1. Leer: ESTADO_SALA1.md (arquitectura completa)
2. Revisar: IMPLEMENTACION_COMPLETA.md (tecnologías)
3. Explorar código: Controllers/HomeController.cs
4. Revisar estilos: wwwroot/css/site.css
5. Analizar lógica: wwwroot/js/sala1.js
TIEMPO: 30 minutos
```

---

## 🌐 Estructura Web

```
NAVEGACIÓN DOCUMENTOS:
📄 INDICE.md (AQUÍ) ← Empezar
  ├─ 📄 README.md (Guía de usuario)
  ├─ 📄 ESTADO_SALA1.md (Detalles técnicos)
  ├─ 📄 CHECKLIST.md (Verificación)
  ├─ 📄 IMPLEMENTACION_COMPLETA.md (Resumen)
  ├─ 📄 DESCARGAR_IMAGENES_SALA1.md (URLs)
  ├─ 🌐 DESCARGAR_IMAGENES_INTERACTIVO.html (App web)
  ├─ Script descargar_imagenes.ps1
  └─ Script descargar_imagenes.bat
```

---

## ✅ Checklist de Bienvenida

- [ ] He leído **README.md**
- [ ] He ejecutado `dotnet run` exitosamente
- [ ] Las imágenes se descargaron (automática o manual)
- [ ] Abrí https://localhost:7119
- [ ] Hice clic en "SALA 1 — EL MAPA DESTRUIDO"
- [ ] Las 9 imágenes de monumentos se cargaron
- [ ] Logré completar **Consigna 1** (MAPAMUNDI)
- [ ] Logré completar **Consigna 3** (Continentes)
- [ ] Ingresé **código M7E4** correctamente
- [ ] ¡Desbloqueé "Sala 2"!

Si marcaste TODO ✅ → **¡Sala 1 está funcionando perfectamente!**

---

## 📞 Contacto + Soporte

### Si tienes dudas sobre:
- **Instalación/Ejecución** → [README.md](README.md)
- **Errores técnicos** → [CHECKLIST.md](CHECKLIST.md) - Troubleshooting
- **Código fuente** → [ESTADO_SALA1.md](ESTADO_SALA1.md)
- **Imágenes** → [DESCARGAR_IMAGENES_INTERACTIVO.html](DESCARGAR_IMAGENES_INTERACTIVO.html)

### Pasos para debugging:
1. Abre DevTools (F12 en el navegador)
2. Revisa pestaña "Console" por errores rojos
3. Revisa pestaña "Network" → filtra .jpg
4. Compara con instrucciones en [CHECKLIST.md](CHECKLIST.md)

---

## 🎉 Versión

- **Versión**: 2.0
- **Estado**: ✅ COMPLETO Y FUNCIONAL
- **Última actualización**: 2026-01
- **Próxima fase**: Sala 2

---

**¡Bienvenido a "Destino Desconocido" - Sala 1!** 🌎🎮

Comienza por [README.md](README.md) →
