using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

public class ImagenDescargador
{
    private readonly string _wwwrootPath;
    private readonly HttpClient _httpClient;

    public ImagenDescargador(string wwwrootPath)
    {
        _wwwrootPath = wwwrootPath;
        _httpClient = new HttpClient();
    }

    public async Task DescargarImagenesAsync()
    {
        try
        {
            // Crear directorios si no existen
            string sala1Path = Path.Combine(_wwwrootPath, "images", "sala1");
            string sala2Path = Path.Combine(_wwwrootPath, "images", "sala2");

            if (!Directory.Exists(sala1Path))
            {
                Directory.CreateDirectory(sala1Path);
            }

            if (!Directory.Exists(sala2Path))
            {
                Directory.CreateDirectory(sala2Path);
            }
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}