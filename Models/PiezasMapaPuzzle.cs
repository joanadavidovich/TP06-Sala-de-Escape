using System;

namespace TP06_Sala_de_Escape.Models
{
    public class PiezasMapaPuzzle
    {
        public int id { get; set; }
        public int salaId { get; set; }
        public int partidaId { get; set; }
        public int numeroPieza { get; set; }
        public string region { get; set; }
        public string pista { get; set; }
        public string respuestaCorrecta { get; set; }
        public bool completada { get; set; }
        public DateTime? fechaCompletacion { get; set; }
    }
}
