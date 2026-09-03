using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Dapper;
using TP06_Sala_de_Escape.Models;

namespace TP06_Sala_de_Escape.Models
{
    public class BD
    {
        // Cadena de conexion por defecto a TP06 local. Cambiar si es necesario.
        private static string _connectionString = @"Server=localhost;Database=TP06;Integrated Security=True;TrustServerCertificate=True;";

        // Agrega un usuario y devuelve el id que puso la BD (IDENTITY)
        public int AgregarUsuario(Usuario usuario)
        {
            string sql = @"INSERT INTO Usuario (nombre, email, fechaCreacion) OUTPUT INSERTED.id VALUES (@Nombre, @Email, @FechaCreacion);";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QuerySingle<int>(sql, new { Nombre = usuario.Nombre, Email = usuario.Email, FechaCreacion = usuario.FechaCreacion });
            }
        }

        // Obtener usuario por nombre
        public Usuario? ObtenerUsuarioPorNombre(string nombre)
        {
            string sql = "SELECT * FROM Usuario WHERE nombre = @Nombre";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirstOrDefault<Usuario>(sql, new { Nombre = nombre });
            }
        }

        // Obtener usuario por id
        public Usuario? ObtenerUsuarioPorId(int id)
        {
            string sql = "SELECT * FROM Usuario WHERE id = @Id";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirstOrDefault<Usuario>(sql, new { Id = id });
            }
        }
        // Crear una partida y devolver el id que genera la BD (IDENTITY)
        public int CrearPartida(string nombreParticipante, int idSala, int? usuarioId = null)
        {
            string sql = @"
                INSERT INTO Partidas (nombreParticipante, idSala, UsuarioId, SalaActual, sessionId, estado, nivelActual, fechaInicio)
                OUTPUT INSERTED.id
                VALUES (@NombreParticipante, @IdSala, @UsuarioId, @SalaActual, @SessionId, @Estado, @NivelActual, @FechaInicio);
            ";

            var parametros = new {
                NombreParticipante = nombreParticipante,
                IdSala = idSala,
                UsuarioId = usuarioId,
                SalaActual = idSala,
                SessionId = Guid.NewGuid().ToString(),
                Estado = "in_progress",
                NivelActual = 1,
                FechaInicio = DateTime.Now
            };

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QuerySingle<int>(sql, parametros);
            }
        }

        // Obtener la última partida de un usuario (por ejemplo para restaurar)
        public Partida? ObtenerUltimaPartidaPorUsuario(int usuarioId)
        {
            string sql = "SELECT TOP 1 * FROM Partidas WHERE UsuarioId = @UsuarioId ORDER BY fechaInicio DESC";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirstOrDefault<Partida>(sql, new { UsuarioId = usuarioId });
            }
        }

        // Obtener partida por id
        public Partida? ObtenerPartidaPorId(int id)
        {
            string sql = "SELECT * FROM Partidas WHERE id = @Id";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirstOrDefault<Partida>(sql, new { Id = id });
            }
        }

        // Guardar progreso simple (actualiza columnas de Partidas)
        public void GuardarProgreso(int partidaId, int salaActual, int nivelActual, string estado, string? sessionId = null)
        {
            string sql = @"
                UPDATE Partidas
                SET SalaActual = @SalaActual,
                    nivelActual = @NivelActual,
                    estado = @Estado,
                    sessionId = COALESCE(@SessionId, sessionId)
                WHERE id = @PartidaId
            ";

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                connection.Execute(sql, new { SalaActual = salaActual, NivelActual = nivelActual, Estado = estado, SessionId = sessionId, PartidaId = partidaId });
            }
        }

        // Guardar snapshot JSON del estado de la partida
        public void GuardarSnapshot(int partidaId, string progresoJson)
        {
            string sql = "INSERT INTO PartidaProgresos (IdPartida, Progreso) VALUES (@IdPartida, @Progreso)";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                connection.Execute(sql, new { IdPartida = partidaId, Progreso = progresoJson });
            }
        }

        // Recuperar los snapshots de una partida
        public IEnumerable<dynamic> ObtenerSnapshots(int partidaId)
        {
            string sql = "SELECT * FROM PartidaProgresos WHERE IdPartida = @IdPartida ORDER BY Fecha DESC";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.Query(sql, new { IdPartida = partidaId });
            }
        }

        // Obtener todas las salas
        public IEnumerable<Salas> ObtenerTodasLasSalas()
        {
            string sql = "SELECT * FROM Salas ORDER BY orden ASC";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.Query<Salas>(sql);
            }
        }

        // Obtener una sala por id
        public Salas? ObtenerSalaPorId(int id)
        {
            string sql = "SELECT * FROM Salas WHERE id = @Id";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirstOrDefault<Salas>(sql, new { Id = id });
            }
        }

        // Obtener todas las piezas del mapa para una sala y partida
        public IEnumerable<PiezasMapaPuzzle> ObtenerPiezasMapa(int salaId, int partidaId)
        {
            string sql = "SELECT * FROM PiezasMapaPuzzle WHERE salaId = @SalaId AND partidaId = @PartidaId ORDER BY numeroPieza ASC";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.Query<PiezasMapaPuzzle>(sql, new { SalaId = salaId, PartidaId = partidaId });
            }
        }

        // Crear piezas del mapa para una nueva partida en la sala 1
        public void CrearPiezasMapaSala1(int salaId, int partidaId)
        {
            string sql = @"
                INSERT INTO PiezasMapaPuzzle (salaId, partidaId, numeroPieza, region, pista, respuestaCorrecta, completada)
                VALUES 
                    (@SalaId, @PartidaId, 1, 'Primera Pieza', 'En qué continente está el país más grande del mundo?', 'ASIA', 0),
                    (@SalaId, @PartidaId, 2, 'Segunda Pieza', '¿Cuál es la capital de Australia?', 'SÍDNEY', 0),
                    (@SalaId, @PartidaId, 3, 'Tercera Pieza', '¿Cuál es el país más poblado de América del Sur?', 'BRASIL', 0),
                    (@SalaId, @PartidaId, 4, 'Cuarta Pieza', '¿En qué océano está Nueva Zelanda?', 'PACÍFICO', 0)
            ";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                connection.Execute(sql, new { SalaId = salaId, PartidaId = partidaId });
            }
        }

        // Marcar una pieza del mapa como completada
        public void CompletarPiezaMapa(int piezaId, int partidaId)
        {
            string sql = @"
                UPDATE PiezasMapaPuzzle 
                SET completada = 1, fechaCompletacion = @FechaCompletacion
                WHERE id = @PiezaId AND partidaId = @PartidaId
            ";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                connection.Execute(sql, new { PiezaId = piezaId, PartidaId = partidaId, FechaCompletacion = DateTime.Now });
            }
        }

        // Obtener el progreso de una partida en la sala 1
        public (int completadas, int total) ObtenerProgresoSala1(int partidaId)
        {
            string sql = @"
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN completada = 1 THEN 1 ELSE 0 END) as completadas
                FROM PiezasMapaPuzzle
                WHERE partidaId = @PartidaId
            ";
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var resultado = connection.QueryFirstOrDefault<dynamic>(sql, new { PartidaId = partidaId });
                return (resultado?.completadas ?? 0, resultado?.total ?? 0);
            }
        }
    }
}
