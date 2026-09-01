using System;

namespace TP06_Sala_de_Escape.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } 
        public string Email { get; set; }
        public DateTime FechaCreacion { get; set; } 
    }
}
