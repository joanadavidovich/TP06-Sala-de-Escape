-- ========================================================
-- SCRIPT DE ACTUALIZACIÓN - TP06 Sala de Escape
-- Ejecutar en SQL Server Management Studio
-- Base de datos: TP06
-- ========================================================

USE [TP06];
GO

-- 1. ACTUALIZAR TABLA Partidas - Agregar nuevas columnas
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'UsuarioId')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [UsuarioId] INT NULL;
    PRINT 'Columna UsuarioId agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'SalaActual')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [SalaActual] INT NULL;
    PRINT 'Columna SalaActual agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'sessionId')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [sessionId] VARCHAR(100) NULL;
    PRINT 'Columna sessionId agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'estado')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [estado] VARCHAR(50) NULL;
    PRINT 'Columna estado agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'nivelActual')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [nivelActual] INT NULL;
    PRINT 'Columna nivelActual agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'piezasCompletadas')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [piezasCompletadas] INT DEFAULT 0;
    PRINT 'Columna piezasCompletadas agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'fechaInicio')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [fechaInicio] DATETIME NULL;
    PRINT 'Columna fechaInicio agregada a Partidas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Partidas' AND COLUMN_NAME = 'fechaFin')
BEGIN
    ALTER TABLE [dbo].[Partidas] ADD [fechaFin] DATETIME NULL;
    PRINT 'Columna fechaFin agregada a Partidas';
END

-- 2. ACTUALIZAR TABLA Salas - Agregar nuevas columnas
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'nombre')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [nombre] VARCHAR(100) NULL;
    PRINT 'Columna nombre agregada a Salas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'descripcion')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [descripcion] VARCHAR(500) NULL;
    PRINT 'Columna descripcion agregada a Salas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'orden')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [orden] INT DEFAULT 1;
    PRINT 'Columna orden agregada a Salas';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Salas' AND COLUMN_NAME = 'fechaCreacion')
BEGIN
    ALTER TABLE [dbo].[Salas] ADD [fechaCreacion] DATETIME DEFAULT GETDATE();
    PRINT 'Columna fechaCreacion agregada a Salas';
END

-- 3. CREAR TABLA PiezasMapaPuzzle (si no existe)
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
    
    PRINT 'Tabla PiezasMapaPuzzle creada';
END

-- 4. AGREGAR FOREIGN KEYS para PiezasMapaPuzzle (si no existen)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_PiezasMapaPuzzle_Salas')
BEGIN
    ALTER TABLE [dbo].[PiezasMapaPuzzle] 
    ADD CONSTRAINT [FK_PiezasMapaPuzzle_Salas] 
    FOREIGN KEY([salaId]) REFERENCES [dbo].[Salas] ([id])
    PRINT 'Foreign Key FK_PiezasMapaPuzzle_Salas creado';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_PiezasMapaPuzzle_Partidas')
BEGIN
    ALTER TABLE [dbo].[PiezasMapaPuzzle] 
    ADD CONSTRAINT [FK_PiezasMapaPuzzle_Partidas] 
    FOREIGN KEY([partidaId]) REFERENCES [dbo].[Partidas] ([id])
    PRINT 'Foreign Key FK_PiezasMapaPuzzle_Partidas creado';
END

-- 5. INSERTAR DATOS INICIALES
-- Insertar Sala 1 (El Mapa Roto)
IF NOT EXISTS (SELECT * FROM [dbo].[Salas] WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[Salas] ON;
    INSERT INTO [dbo].[Salas] 
        ([id], [nombre], [descripcion], [nivel], [pista], [orden], [fechaCreacion])
    VALUES 
        (1, 'El Mapa Roto', 'Reconstruye el antiguo mapa del mundo resolviendo acertijos geográficos', 'PRINCIPIANTE', 'Resuelve los 4 acertijos para completar el mapa', 1, GETDATE());
    SET IDENTITY_INSERT [dbo].[Salas] OFF;
    PRINT 'Sala 1 insertada';
END

-- 6. LIMPIAR DATOS ANTERIORES (OPCIONAL - Descomentar si es necesario)
-- DELETE FROM [dbo].[PiezasMapaPuzzle];
-- DELETE FROM [dbo].[Partidas];

PRINT '';
PRINT '========================================================';
PRINT 'Base de datos TP06 actualizada correctamente';
PRINT '========================================================';
GO

