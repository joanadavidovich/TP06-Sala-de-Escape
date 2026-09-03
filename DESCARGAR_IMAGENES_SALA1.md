# Instrucciones para Descargar las Imágenes de Sala 1

Descarga estas imágenes en la carpeta: `wwwroot/images/sala1/`

## Imágenes necesarias:

### 9 Monumentos (Consigna 1):
1. **golden-gate.jpg** - Puente Golden Gate
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg

2. **cristo.jpg** - Cristo Redentor
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/e/e5/Oye_de_janeiro_by_night.JPG

3. **piramides.jpg** - Pirámides de Giza
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/a/af/All_Gizah_Pyramids.jpg

4. **taj-mahal.jpg** - Taj Mahal
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%282%29.jpg

5. **coliseo.jpg** - Coliseo Romano
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_2020.jpg

6. **muralla.jpg** - Muralla China
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/d/d7/Great_Wall_of_China_-_Section_near_Juyongguan_01.jpg

7. **opera.jpg** - Ópera de Sydney
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/c/cb/2016-12-19_Sydney_Opera_House.jpg

8. **eiffel.jpg** - Torre Eiffel
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/8/85/Eiffel_Tower_by_Photographer_I_Left_My_Heart_in_San_Francisco_131.jpg

9. **machu.jpg** - Machu Picchu
   - Fuente: https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg

### Imágenes adicionales (Consigna 3):
10. **liberty.jpg** - Estatua de la Libertad
    - Fuente: https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg

11. **placeholder.jpg** - Imagen de error (opcional)
    - O un simple cuadrado gris que generes localmente

## Pasos para descargar de forma masiva (Windows PowerShell):

```powershell
# Navega a la carpeta del proyecto
cd "z:\2026\Programación\TP06 Sala de Escape\wwwroot\images\sala1"

# Descarga cada imagen
$urls = @{
    "golden-gate.jpg" = "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg"
    "cristo.jpg" = "https://upload.wikimedia.org/wikipedia/commons/e/e5/Oye_de_janeiro_by_night.JPG"
    "piramides.jpg" = "https://upload.wikimedia.org/wikipedia/commons/a/af/All_Gizah_Pyramids.jpg"
    "taj-mahal.jpg" = "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%282%29.jpg"
    "coliseo.jpg" = "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_2020.jpg"
    "muralla.jpg" = "https://upload.wikimedia.org/wikipedia/commons/d/d7/Great_Wall_of_China_-_Section_near_Juyongguan_01.jpg"
    "opera.jpg" = "https://upload.wikimedia.org/wikipedia/commons/c/cb/2016-12-19_Sydney_Opera_House.jpg"
    "eiffel.jpg" = "https://upload.wikimedia.org/wikipedia/commons/8/85/Eiffel_Tower_by_Photographer_I_Left_My_Heart_in_San_Francisco_131.jpg"
    "machu.jpg" = "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg"
    "liberty.jpg" = "https://upload.wikimedia.org/wikipedia/commons/8/22/Statue_of_Liberty_7.jpg"
}

foreach ($name in $urls.Keys) {
    $url = $urls[$name]
    Invoke-WebRequest -Uri $url -OutFile $name
    Write-Host "Descargado: $name"
}
```

## O manualmente desde tu navegador:
1. Haz clic derecho en cada enlace
2. Selecciona "Guardar imagen como..."
3. Guarda en `wwwroot\images\sala1\` con el nombre especificado

Una vez descargadas las imágenes, la Sala 1 funcionará perfectamente con las fotos reales.
