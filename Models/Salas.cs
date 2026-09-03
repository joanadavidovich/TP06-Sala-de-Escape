using System;

namespace TP06_Sala_de_Escape.Models
{
    public class Salas
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public int nivel { get; set; }
        public string pista { get; set; }
        public int orden { get; set; }
        public DateTime? fechaCreacion { get; set; }
    }
}