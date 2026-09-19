using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TP06_Sala_de_Escape.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Text.Json;
using System.Security.Cryptography;

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
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        if (usuarioId.HasValue)
        {
            RestaurarPartidaEnSesion(usuarioId.Value, false);
        }

        ViewBag.SalaActual = usuarioId.HasValue ? HttpContext.Session.GetInt32("SalaActual") ?? 0 : 0;
        ViewBag.UsuarioNombre = usuarioId.HasValue ? HttpContext.Session.GetString("UsuarioNombre") : null;

        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        if (partidaId.HasValue)
        {
            PrepararReloj(partidaId.Value);
        }

        return View();
    }

    public IActionResult Sala1()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (!partidaId.HasValue && usuarioId.HasValue)
        {
            RestaurarPartidaEnSesion(usuarioId.Value, true);
            partidaId = HttpContext.Session.GetInt32("PartidaId");
        }

        else if (partidaId.HasValue)
        {
            ReanudarPartidaSiPausada(partidaId.Value);
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        if (!PuedeAccederSala(1))
        {
            return RedirigirASalaActual();
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
        PrepararReloj(partidaId.Value);

        return View();
    }

    public IActionResult Sala2()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (!partidaId.HasValue && usuarioId.HasValue)
        {
            RestaurarPartidaEnSesion(usuarioId.Value, true);
            partidaId = HttpContext.Session.GetInt32("PartidaId");
        }

        else if (partidaId.HasValue)
        {
            ReanudarPartidaSiPausada(partidaId.Value);
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        if (!PuedeAccederSala(2))
        {
            return RedirigirASalaActual();
        }

        // Datos de Sala 2: Las Imágenes Borrosas
        var consigna1 = new
        {
            titulo = "Consigna 1: Las Fotografías Recuperadas",
            descripcion = "El sistema recuperó 5 fotografías tomadas dentro y alrededor del aeropuerto, pero están muy borrosas. Observa todas ellas y relacionalas para descubrir en qué país está el aeropuerto.",
            fotografias = new[]
            {
                new { id = 1, nombre = "Bandera", descripcion = "Una parte de una bandera nacional", tipo = "bandera" },
                new { id = 2, nombre = "Cartel", descripcion = "Un cartel con información del aeropuerto", tipo = "cartel" },
                new { id = 3, nombre = "Señal", descripcion = "Una señal de tránsito o información", tipo = "señal" },
                new { id = 4, nombre = "Edificio", descripcion = "Parte de un edificio emblemático", tipo = "edificio" },
                new { id = 5, nombre = "Paisaje", descripcion = "Un paisaje caracterísitco de la región", tipo = "paisaje" }
            }
        };

        ViewBag.Consigna1 = JsonSerializer.Serialize(consigna1);
        ViewBag.PartidaId = partidaId.Value;
        ViewBag.UsuarioId = usuarioId;
        PrepararReloj(partidaId.Value);

        return View();
    }

    public IActionResult Sala3()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (!partidaId.HasValue && usuarioId.HasValue)
        {
            RestaurarPartidaEnSesion(usuarioId.Value, true);
            partidaId = HttpContext.Session.GetInt32("PartidaId");
        }

        else if (partidaId.HasValue)
        {
            ReanudarPartidaSiPausada(partidaId.Value);
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        if (!PuedeAccederSala(3))
        {
            return RedirigirASalaActual();
        }

        ViewBag.PartidaId = partidaId.Value;
        ViewBag.UsuarioId = usuarioId;
        PrepararReloj(partidaId.Value);

        return View();
    }

    public IActionResult Sala4()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");

        if (!partidaId.HasValue && usuarioId.HasValue)
        {
            RestaurarPartidaEnSesion(usuarioId.Value, true);
            partidaId = HttpContext.Session.GetInt32("PartidaId");
        }

        else if (partidaId.HasValue)
        {
            ReanudarPartidaSiPausada(partidaId.Value);
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }
        
        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        if (!partidaId.HasValue)
        {
            return RedirectToAction("StartPartida");
        }

        if (!PuedeAccederSala(4))
        {
            return RedirigirASalaActual();
        }

        ViewBag.PartidaId = partidaId.Value;
        ViewBag.UsuarioId = usuarioId;
        PrepararReloj(partidaId.Value);

        return View();
    }

    [HttpPost]
    public IActionResult DesbloquearSala([FromBody] DesbloquearSalaRequest request)
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int salaActual = HttpContext.Session.GetInt32("SalaActual") ?? 0;

        if (!partidaId.HasValue || request.Sala > salaActual || request.Sala < 1 || request.Sala > 3)
        {
            return BadRequest(new { success = false, message = "La transición no es válida." });
        }

        if (request.Sala < salaActual)
        {
            return Json(new { success = true, siguienteSala = salaActual });
        }

        int siguienteSala = salaActual + 1;
        HttpContext.Session.SetInt32("SalaActual", siguienteSala);

        try
        {
            var bd = new BD();
            bd.GuardarProgreso(partidaId.Value, siguienteSala, 1, "in_progress");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "No se pudo guardar el avance de la partida {PartidaId}.", partidaId.Value);
        }

        return Json(new { success = true, siguienteSala });
    }

    private bool PuedeAccederSala(int sala)
    {
        return (HttpContext.Session.GetInt32("SalaActual") ?? 0) >= sala;
    }

    private void RestaurarPartidaEnSesion(int usuarioId, bool reanudar)
    {
        try
        {
            var partida = new BD().ObtenerPartidaEnCursoPorUsuario(usuarioId);
            if (partida == null)
            {
                return;
            }

            if (reanudar && partida.estado == "paused")
            {
                new BD().ReanudarPartida(partida.id);
            }

            HttpContext.Session.SetInt32("PartidaId", partida.id);
            HttpContext.Session.SetInt32("SalaActual", partida.SalaActual ?? 1);
            HttpContext.Session.SetString("Estado", partida.estado ?? "in_progress");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "No se pudo restaurar la partida del usuario {UsuarioId}.", usuarioId);
        }
    }

    private void ReanudarPartidaSiPausada(int partidaId)
    {
        if (HttpContext.Session.GetString("Estado") != "paused")
        {
            return;
        }

        try
        {
            new BD().ReanudarPartida(partidaId);
            HttpContext.Session.SetString("Estado", "in_progress");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "No se pudo reanudar la partida {PartidaId}.", partidaId);
        }
    }

    private void PrepararReloj(int partidaId)
    {
        var partida = new BD().ObtenerPartidaPorId(partidaId);

        ViewBag.MostrarReloj = true;
        ViewBag.PartidaFechaInicio = partida?.fechaInicio?.ToUniversalTime().ToString("O");
        ViewBag.TiempoRestanteSegundos = partida?.tiempoRestanteSegundos ?? 1800;
        ViewBag.NivelActual = partida?.nivelActual ?? 1;
    }

    [HttpPost]
    public IActionResult GuardarNivel([FromBody] GuardarNivelRequest request)
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        int? salaActual = HttpContext.Session.GetInt32("SalaActual");
        if (!partidaId.HasValue || !salaActual.HasValue || request.Nivel < 1)
        {
            return BadRequest(new { success = false });
        }

        try
        {
            new BD().GuardarProgreso(partidaId.Value, salaActual.Value, request.Nivel, "in_progress");
            return Json(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "No se pudo guardar el nivel de la partida {PartidaId}.", partidaId.Value);
            return StatusCode(503, new { success = false });
        }
    }

    private IActionResult RedirigirASalaActual()
    {
        return (HttpContext.Session.GetInt32("SalaActual") ?? 1) switch
        {
            2 => RedirectToAction("Sala2"),
            3 => RedirectToAction("Sala3"),
            4 => RedirectToAction("Sala4"),
            _ => RedirectToAction("Sala1")
        };
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
        int? usuarioId = HttpContext.Session.GetInt32("UsuarioId");
        if (!usuarioId.HasValue)
        {
            TempData["AuthNotice"] = "Para comenzar la partida primero tenés que registrarte o iniciar sesión.";
            return RedirectToAction("Index");
        }

        if (HttpContext.Session.GetInt32("PartidaId").HasValue)
        {
            return RedirigirASalaActual();
        }

        try
        {
            BD bd = new BD();
            string? usuarioNombre = HttpContext.Session.GetString("UsuarioNombre");
            var partidaAnterior = bd.ObtenerPartidaEnCursoPorUsuario(usuarioId.Value);
            if (partidaAnterior != null)
            {
                HttpContext.Session.SetInt32("PartidaId", partidaAnterior.id);
                HttpContext.Session.SetInt32("SalaActual", partidaAnterior.SalaActual ?? 1);
                if (partidaAnterior.estado == "paused")
                {
                    bd.ReanudarPartida(partidaAnterior.id);
                }
                HttpContext.Session.SetString("Estado", "in_progress");
                return RedirectToAction("Sala" + (partidaAnterior.SalaActual ?? 1));
            }
            int partidaId = bd.CrearPartida(usuarioNombre, 1, usuarioId);
            HttpContext.Session.SetInt32("PartidaId", partidaId);
            HttpContext.Session.SetInt32("SalaActual", 1);
            HttpContext.Session.SetString("Estado", "in_progress");
            return RedirectToAction("Sala1");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "No se pudo crear o recuperar la partida del usuario {UsuarioId}.", usuarioId.Value);
            TempData["AuthNotice"] = "Tu sesión está activa, pero no se pudo crear la partida en la base de datos. Revisá la conexión y volvé a intentar.";
            return RedirectToAction("Index");
        }
    }

    [HttpPost]
    public IActionResult Logout()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        if (partidaId.HasValue)
        {
            try
            {
                new BD().PausarPartida(partidaId.Value);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "No se pudo pausar la partida {PartidaId}.", partidaId.Value);
            }
        }

        HttpContext.Session.Clear();
        return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult PausePartida()
    {
        int? partidaId = HttpContext.Session.GetInt32("PartidaId");
        if (partidaId.HasValue)
        {
            new BD().PausarPartida(partidaId.Value);
        }

        return Ok();
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Register(string nombre, string email, string password, string confirmPassword)
    {
        if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            ViewBag.Error = "Completá nombre, email y contraseña para crear el perfil.";
            return View();
        }

        if (password.Length < 8 || password != confirmPassword)
        {
            ViewBag.Error = password.Length < 8 ? "La contraseña debe tener al menos 8 caracteres." : "Las contraseñas no coinciden.";
            return View();
        }

        BD bd = new BD();
        Usuario usuario = new Usuario();
        usuario.Nombre = nombre;
        usuario.Email = email;
        usuario.PasswordHash = CrearHash(password);
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
    public IActionResult Login(string nombre, string password, string? returnUrl = null)
    {
        if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(password))
        {
            ViewBag.Error = "Ingresá tu nombre y contraseña para continuar.";
            return View();
        }

        BD bd = new BD();
        Usuario? usuario = bd.ObtenerUsuarioPorNombre(nombre);
        if (usuario == null || !VerificarHash(password, usuario.PasswordHash))
        {
            ViewBag.Error = "El nombre o la contraseña no son correctos.";
            return View();
        }

        HttpContext.Session.SetInt32("UsuarioId", usuario.Id);
        HttpContext.Session.SetString("UsuarioNombre", usuario.Nombre);
        RestaurarPartidaEnSesion(usuario.Id, true);

        return Url.IsLocalUrl(returnUrl) ? Redirect(returnUrl) : RedirectToAction("Index");
    }

    private static string CrearHash(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 120000, HashAlgorithmName.SHA256, 32);
        return $"120000.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    private static bool VerificarHash(string password, string? storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash)) return false;
        string[] parts = storedHash.Split('.');
        if (parts.Length != 3 || !int.TryParse(parts[0], out int iterations)) return false;
        try
        {
            byte[] salt = Convert.FromBase64String(parts[1]);
            byte[] expected = Convert.FromBase64String(parts[2]);
            byte[] actual = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, expected.Length);
            return CryptographicOperations.FixedTimeEquals(actual, expected);
        }
        catch (FormatException) { return false; }
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

public class DesbloquearSalaRequest
{
    public int Sala { get; set; }
}

public class GuardarNivelRequest
{
    public int Nivel { get; set; }
}
