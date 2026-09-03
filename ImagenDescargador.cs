using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

public class ImagenDescargador
{
    private readonly string _carpetaSala1;
    private readonly HttpClient _httpClient;

    public ImagenDescargador(string rutaWwwroot)
    {
        _carpetaSala1 = Path.Combine(rutaWwwroot, "images", "sala1");
        _httpClient = new HttpClient();
    }

    public async Task DescargarImagenesAsync()
    {
        // Crear carpeta si no existe
        if (!Directory.Exists(_carpetaSala1))
        {
            Directory.CreateDirectory(_carpetaSala1);
        }

        var imagenes = new Dictionary<string, string>
        {
            { "golden-gate.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg" },
            { "cristo.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e5/Oye_de_janeiro_by_night.JPG" },
            { "piramides.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/af/All_Gizah_Pyramids.jpg" },
            { "taj-mahal.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%282%29.jpg" },
            { "coliseo.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_2020.jpg" },
            { "muralla.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d7/Great_Wall_of_China_-_Section_near_Juyongguan_01.jpg" },
            { "opera.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/cb/2016-12-19_Sydney_Opera_House.jpg" },
            { "eiffel.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/85/Eiffel_Tower_by_Photographer_I_Left_My_Heart_in_San_Francisco_131.jpg" },
            { "machu.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg" }
        };

        Console.WriteLine("📥 Descargando imágenes de Sala 1...");

        foreach (var (nombreArchivo, urlImagen) in imagenes)
        {
            string rutaArchivo = Path.Combine(_carpetaSala1, nombreArchivo);

            // Si ya existe, saltar
            if (File.Exists(rutaArchivo))
            {
                Console.WriteLine($"✓ {nombreArchivo} ya existe");
                continue;
            }

            try
            {
                using (HttpResponseMessage response = await _httpClient.GetAsync(urlImagen))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        using (FileStream fs = new FileStream(rutaArchivo, FileMode.Create, FileAccess.Write))
                        {
                            await response.Content.CopyToAsync(fs);
                        }
                        Console.WriteLine($"✓ {nombreArchivo} descargado");
                    }
                    else
                    {
                        Console.WriteLine($"✗ Error descargando {nombreArchivo}: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Error con {nombreArchivo}: {ex.Message}");
            }
        }

        Console.WriteLine("✅ Proceso de descarga completado");
    }
}
