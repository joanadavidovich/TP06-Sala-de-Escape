-- Script para actualizar la base de datos TP06 con la Sala 1 de geografía

-- 1. Actualizar tabla Partidas para agregar nuevos campos
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'UsuarioId')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [UsuarioId] INT NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'SalaActual')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [SalaActual] INT NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'sessionId')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [sessionId] VARCHAR(50) NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'estado')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [estado] VARCHAR(50) NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'nivelActual')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [nivelActual] INT NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'piezasCompletadas')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [piezasCompletadas] INT DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'fechaInicio')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [fechaInicio] DATETIME NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'fechaFin')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [fechaFin] DATETIME NULL;
END

-- 2. Actualizar tabla Salas para agregar nuevos campos
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'nombre')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [nombre] VARCHAR(100) NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'descripcion')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [descripcion] VARCHAR(500) NULL;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'orden')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [orden] INT DEFAULT 1;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'fechaCreacion')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [fechaCreacion] DATETIME DEFAULT GETDATE();
END

-- 3. Crear tabla PiezasMapaPuzzle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PiezasMapaPuzzle')
BEGIN
    CREATE TABLE [dbo].[PiezasMapaPuzzle](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [salaId] [int] NOT NULL,
        [partidaId] [int] NOT NULL,
        [numeroPieza] [int] NOT NULL,
        [region] [varchar](100) NOT NULL,
        [pista] [varchar](500) NOT NULL,
        [respuestaCorrecta] [varchar](100) NOT NULL,
        [completada] [bit] DEFAULT 0,
        [fechaCompletacion] [datetime] NULL,
        CONSTRAINT [PK_PiezasMapaPuzzle] PRIMARY KEY CLUSTERED 
        (
            [id] ASC
        ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

-- 4. Agregar foreign keys para PiezasMapaPuzzle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_PiezasMapaPuzzle_Salas')
BEGIN
    ALTER TABLE [dbo].[PiezasMapaPuzzle] 
    ADD CONSTRAINT [FK_PiezasMapaPuzzle_Salas] 
    FOREIGN KEY([salaId]) REFERENCES [dbo].[Salas] ([id])
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_PiezasMapaPuzzle_Partidas')
BEGIN
    ALTER TABLE [dbo].[PiezasMapaPuzzle] 
    ADD CONSTRAINT [FK_PiezasMapaPuzzle_Partidas] 
    FOREIGN KEY([partidaId]) REFERENCES [dbo].[Partidas] ([id])
END

-- 5. Insertar datos iniciales para la Sala 1 (El Mapa Roto)
IF NOT EXISTS (SELECT * FROM [dbo].[Salas] WHERE id = 1)
BEGIN
    INSERT INTO [dbo].[Salas] 
        ([id], [nombre], [descripcion], [nivel], [pista], [orden], [fechaCreacion])
    VALUES 
        (1, 'El Mapa Roto', 'Reconstruye el antiguo mapa del mundo resolviendo acertijos geográficos', 'PRINCIPIANTE', 'Resuelve los 4 acertijos para completar el mapa', 1, GETDATE());
END

PRINT 'Base de datos actualizada correctamente para TP06 - Sala de Escape Geográfica';
