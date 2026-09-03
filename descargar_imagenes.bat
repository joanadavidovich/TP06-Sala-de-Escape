@echo off
cd /d "z:\2026\Programación\TP06 Sala de Escape\wwwroot\images\sala1"

echo Descargando imágenes de monumentos...

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg' -OutFile 'golden-gate.jpg'" 2>nul && echo ✓ golden-gate.jpg || echo ✗ golden-gate.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Oye_de_janeiro_by_night.JPG' -OutFile 'cristo.jpg'" 2>nul && echo ✓ cristo.jpg || echo ✗ cristo.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/a/af/All_Gizah_Pyramids.jpg' -OutFile 'piramides.jpg'" 2>nul && echo ✓ piramides.jpg || echo ✗ piramides.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%282%29.jpg' -OutFile 'taj-mahal.jpg'" 2>nul && echo ✓ taj-mahal.jpg || echo ✗ taj-mahal.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_2020.jpg' -OutFile 'coliseo.jpg'" 2>nul && echo ✓ coliseo.jpg || echo ✗ coliseo.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Great_Wall_of_China_-_Section_near_Juyongguan_01.jpg' -OutFile 'muralla.jpg'" 2>nul && echo ✓ muralla.jpg || echo ✗ muralla.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/c/cb/2016-12-19_Sydney_Opera_House.jpg' -OutFile 'opera.jpg'" 2>nul && echo ✓ opera.jpg || echo ✗ opera.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/8/85/Eiffel_Tower_by_Photographer_I_Left_My_Heart_in_San_Francisco_131.jpg' -OutFile 'eiffel.jpg'" 2>nul && echo ✓ eiffel.jpg || echo ✗ eiffel.jpg

powershell -Command "Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg' -OutFile 'machu.jpg'" 2>nul && echo ✓ machu.jpg || echo ✗ machu.jpg

echo.
echo Descarga completada. Verifica los archivos en %cd%
pause
