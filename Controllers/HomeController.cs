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
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        BD bd = new BD();
        var piezas = bd.ObtenerPiezasMapa(1, partidaId.Value).ToList();

        // Si no hay piezas, crearlas
        if (piezas.Count == 0)
        {
            bd.CrearPiezasMapaSala1(1, partidaId.Value);
            piezas = bd.ObtenerPiezasMapa(1, partidaId.Value).ToList();
        }

        // Convertir a JSON para pasar a la vista
        var piezasJson = JsonSerializer.Serialize(piezas);
        ViewBag.PuzzlesJson = piezasJson;
        ViewBag.PartidaId = partidaId.Value;

        return View(piezas);
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
        BD bd = new BD();

        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        string? usuarioNombre = HttpContext.Session.GetString("UsuarioNombre");
        int partidaId = bd.CrearPartida(usuarioNombre, 1, usuarioId);
        HttpContext.Session.SetInt32("PartidaId", partidaId);
        HttpContext.Session.SetInt32("SalaActual", 1);
        HttpContext.Session.SetString("Estado", "in_progress");

        return RedirectToAction("Sala1");
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
