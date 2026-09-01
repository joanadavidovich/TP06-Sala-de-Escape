using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TP06_Sala_de_Escape.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Dapper;

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
    public IActionResult StartPartida()
    {
        BD bd = new BD();

        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        string? usuarioNombre = HttpContext.Session.GetString("UsuarioNombre");
        if (string.IsNullOrEmpty(usuarioNombre))
        {
            usuarioNombre = "Invitado";
        }

        int partidaId = bd.CrearPartida(usuarioNombre, 1, usuarioId);

        HttpContext.Session.SetInt32("PartidaId", partidaId);
        HttpContext.Session.SetInt32("SalaActual", 1);
        HttpContext.Session.SetString("Estado", "in_progress");

        return RedirectToAction("Index");
    }

    // Mostrar formulario registro
    public IActionResult Register()
    {
        return View();
    }

    // Recibe POST registro
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
