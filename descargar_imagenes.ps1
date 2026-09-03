$imagenes = @{
    "golden-gate.jpg" = "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg"
    "cristo.jpg" = "https://upload.wikimedia.org/wikipedia/commons/e/e5/Oye_de_janeiro_by_night.JPG"
    "piramides.jpg" = "https://upload.wikimedia.org/wikipedia/commons/a/af/All_Gizah_Pyramids.jpg"
    "taj-mahal.jpg" = "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%282%29.jpg"
    "coliseo.jpg" = "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_2020.jpg"
    "muralla.jpg" = "https://upload.wikimedia.org/wikipedia/commons/d/d7/Great_Wall_of_China_-_Section_near_Juyongguan_01.jpg"
    "opera.jpg" = "https://upload.wikimedia.org/wikipedia/commons/c/cb/2016-12-19_Sydney_Opera_House.jpg"
    "eiffel.jpg" = "https://upload.wikimedia.org/wikipedia/commons/8/85/Eiffel_Tower_by_Photographer_I_Left_My_Heart_in_San_Francisco_131.jpg"
    "machu.jpg" = "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg"
}

$carpeta = "wwwroot\images\sala1"

foreach ($nombre in $imagenes.Keys) {
    $url = $imagenes[$nombre]
    $ruta = Join-Path $carpeta $nombre
    Write-Host "Descargando: $nombre"
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $url -OutFile $ruta -TimeoutSec 30
        Write-Host "✓ $nombre descargado correctamente" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Error al descargar $nombre : $_" -ForegroundColor Red
    }
}

Write-Host "Proceso completado" -ForegroundColor Cyan