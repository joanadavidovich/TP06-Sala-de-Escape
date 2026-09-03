using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TP06_Sala_de_Escape.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Text.Json;

namespace TP06_Sala_de_Escape.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Sala1()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        // Datos de Sala 1: Las 3 consignas
        var consigna1 = new
        {
            titulo = "Consigna 1: Las 9 Imágenes",
            descripcion = "Ordena las imágenes de OESTE a ESTE para descubrir la palabra mágica",
            imagenes = new[]
            {
                new { id = 1, letra = "M", imagen = "golden-gate.jpg", ubicacion = "San Francisco, USA", orden = 0 },
                new { id = 2, letra = "A", imagen = "cristo.jpg", ubicacion = "Rio de Janeiro, Brasil", orden = 1 },
                new { id = 3, letra = "P", imagen = "piramides.jpg", ubicacion = "Giza, Egipto", orden = 2 },
                new { id = 4, letra = "A", imagen = "taj-mahal.jpg", ubicacion = "Agra, India", orden = 3 },
                new { id = 5, letra = "M", imagen = "coliseo.jpg", ubicacion = "Roma, Italia", orden = 4 },
                new { id = 6, letra = "U", imagen = "muralla.jpg", ubicacion = "China", orden = 5 },
                new { id = 7, letra = "N", imagen = "opera.jpg", ubicacion = "Sydney, Australia", orden = 6 },
                new { id = 8, letra = "D", imagen = "eiffel.jpg", ubicacion = "Paris, Francia", orden = 7 },
                new { id = 9, letra = "I", imagen = "machu.jpg", ubicacion = "Perú", orden = 8 }
            }
        };

        var consigna2 = new
        {
            titulo = "Consigna 2: El Mapa Roto",
            descripcion = "Reconstruye el mapamundi colocando las piezas correctamente"
        };

        var consigna3 = new
        {
            titulo = "Consigna 3: Ubica los Continentes",
            descripcion = "Coloca cada monumento en su continente correcto",
            monumentos = new[]
            {
                new { id = 1, nombre = "Torre Eiffel", continente = "EUROPA", imagen = "eiffel.jpg", letra = "E" },
                new { id = 2, nombre = "Estatua de la Libertad", continente = "AMÉRICA", imagen = "liberty.jpg", letra = "U" },
                new { id = 3, nombre = "Pirámides de Giza", continente = "ÁFRICA", imagen = "piramides.jpg", letra = "R" },
                new { id = 4, nombre = "Taj Mahal", continente = "ASIA", imagen = "taj-mahal.jpg", letra = "O" },
                new { id = 5, nombre = "Cristo Redentor", continente = "AMÉRICA", imagen = "cristo.jpg", letra = "P" },
                new { id = 6, nombre = "Ópera de Sydney", continente = "OCEANÍA", imagen = "opera.jpg", letra = "A" }
            }
        };

        ViewBag.Consigna1 = JsonSerializer.Serialize(consigna1);
        ViewBag.Consigna2 = JsonSerializer.Serialize(consigna2);
        ViewBag.Consigna3 = JsonSerializer.Serialize(consigna3);
        ViewBag.PartidaId = partidaId.Value;
        ViewBag.UsuarioId = usuarioId;

        return View();
    }

    [HttpPost]
    public IActionResult CompletarPieza([FromBody] CompletarPiezaRequest request)
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        if (!partidaId.HasValue || partidaId.Value != request.PartidaId)
        {
            return BadRequest(new { success = false, message = "Partida no válida" });
        }

        BD bd = new BD();
        bd.CompletarPiezaMapa(request.PiezaId, request.PartidaId);

        // Verificar si todas las piezas están completadas
        var (completadas, total) = bd.ObtenerProgresoSala1(request.PartidaId);

        var respuesta = new
        {
            success = true,
            completadas = completadas,
            total = total,
            mensaje = completadas == total ? "¡Todas las piezas completadas! Accede al código final." : "Pieza completada correctamente"
        };

        return Json(respuesta);
    }

    public IActionResult StartPartida()
    {
        try
        {
            BD bd = new BD();
            int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
            string? usuarioNombre = HttpContext.Session.GetString("UsuarioNombre");
            int partidaId = bd.CrearPartida(usuarioNombre, 1, usuarioId);
            HttpContext.Session.SetInt32("PartidaId", partidaId);
            HttpContext.Session.SetInt32("SalaActual", 1);
            HttpContext.Session.SetString("Estado", "in_progress");
            return RedirectToAction("Sala1");
        }
        catch (Exception ex)
        {
            // Si hay error en la BD, crear una partida en session sin guardar
            int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
            int tempPartidaId = new Random().Next(1000, 9999);
            HttpContext.Session.SetInt32("PartidaId", tempPartidaId);
            HttpContext.Session.SetInt32("SalaActual", 1);
            HttpContext.Session.SetString("Estado", "in_progress");
            
            _logger.LogError($"Error al crear partida: {ex.Message}. Usando modo offline.");
            return RedirectToAction("Sala1");
        }
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Register(string nombre, string email)
    {
        if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(email))
        {
            return Content("Completa nombre y email.");
        }

        BD bd = new BD();
        Usuario usuario = new Usuario();
        usuario.Nombre = nombre;
        usuario.Email = email;
        usuario.FechaCreacion = DateTime.Now;

        int id = bd.AgregarUsuario(usuario);

        HttpContext.Session.SetInt32("UsuarioId", id);
        HttpContext.Session.SetString("UsuarioNombre", nombre);

        return RedirectToAction("Index");
    }

    // Mostrar formulario login
    public IActionResult Login()
    {
        return View();
    }

    // Recibe POST login
    [HttpPost]
    public IActionResult Login(string nombre)
    {
        if (string.IsNullOrWhiteSpace(nombre))
        {
            return Content("Ingresa tu nombre.");
        }

        BD bd = new BD();
        Usuario? usuario = bd.ObtenerUsuarioPorNombre(nombre);
        if (usuario == null)
        {
            return Content("Usuario no encontrado. Registrate primero.");
        }

        HttpContext.Session.SetInt32("UsuarioId", usuario.Id);
        HttpContext.Session.SetString("UsuarioNombre", usuario.Nombre);

        return RedirectToAction("Index");
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

public class CompletarPiezaRequest
{
    public int PiezaId { get; set; }
    public int PartidaId { get; set; }
}
