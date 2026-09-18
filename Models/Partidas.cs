using System;

namespace TP06_Sala_de_Escape.Models
{
    public class Partida
    {
        public int id { get; set; }
        public string nombreParticipante { get; set; } = string.Empty;
        public int idSala { get; set; }
        public int? UsuarioId { get; set; }
        public int? SalaActual { get; set; }
        public string? sessionId { get; set; }
        public string? estado { get; set; }
        public int? nivelActual { get; set; }
        public int? piezasCompletadas { get; set; } = 0;
        public DateTime? fechaInicio { get; set; }
        public DateTime? fechaFin { get; set; }
        public int? tiempoRestanteSegundos { get; set; }
    }
}
