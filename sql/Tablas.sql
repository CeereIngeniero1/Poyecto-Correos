Create table  [Entidad Recordatorios] 
(
[Id Entidad Recordatorios] int identity(1,1) primary key,
[Documento Entidad] Varchar (100),
[Dia De La Mujer] DateTime,
[Cumpleaños] DateTime,
[Navidad] DateTime

)


 INSERT INTO [Entidad Recordatorios]
    (
        [Documento Entidad],
        [Dia De La Mujer],
        [Cumpleaños],
        [Navidad]
    )
    SELECT 
        [Documento Entidad],
        DATEADD(YEAR,-1,GETDATE()),
        DATEADD(YEAR,-1,GETDATE()),
        DATEADD(YEAR,-1,GETDATE())
    FROM Entidad

    


CREATE TRIGGER TR_Insert_Entidad_Recordatorios
ON dbo.Entidad
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.[Entidad Recordatorios]
    (
        [Documento Entidad],
        [Dia De La Mujer],
        [Cumpleaños],
        [Navidad]
    )
    SELECT 
        i.[Documento Entidad],
        DATEADD(YEAR, -1, GETDATE()),
        DATEADD(YEAR, -1, GETDATE()),
        DATEADD(YEAR, -1, GETDATE())
    FROM inserted i
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM dbo.[Entidad Recordatorios] er
        WHERE er.[Documento Entidad] = i.[Documento Entidad]
    );
END
GO



CREATE VIEW [dbo].[Cnsta Recordatorios Dia de la mujer]
AS
SELECT TOP(100) dbo.Entidad.[Nombre Completo Entidad], dbo.EntidadII.[E-mail Nro 1 EntidadII], dbo.[Entidad Recordatorios].[Dia De La Mujer], dbo.Entidad.[Documento Entidad], 'Dia de la Mujer' AS Recordatorio
FROM     dbo.Entidad INNER JOIN
                  dbo.[Entidad Recordatorios] ON dbo.Entidad.[Documento Entidad] = dbo.[Entidad Recordatorios].[Documento Entidad] INNER JOIN
                  dbo.EntidadIII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadIII.[Documento Entidad] INNER JOIN
                  dbo.EntidadII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad]
                   
WHERE  (YEAR(dbo.[Entidad Recordatorios].[Dia De La Mujer]) < YEAR(GETDATE())) AND (DAY(GETDATE()) = 8) AND (MONTH(GETDATE()) = 3) AND (dbo.EntidadIII.[Id Sexo] = 3) AND (dbo.EntidadII.[E-mail Nro 1 EntidadII] LIKE N'%@%') AND EXISTS (
        SELECT 1
        FROM dbo.CompromisoVI C
        WHERE C.[Entidad Atendida] = dbo.Entidad.[Documento Entidad]
          AND C.[Fecha Inicio CompromisoVI] >= DATEADD(YEAR, -1, GETDATE())
    );
GO



CREATE VIEW [dbo].[Cnsta Recordatorios Cumpleaños]
AS
SELECT TOP(50) dbo.Entidad.[Documento Entidad], dbo.Entidad.[Nombre Completo Entidad], dbo.[Entidad Recordatorios].Cumpleaños, dbo.EntidadIII.[Fecha Nacimiento EntidadIII], dbo.EntidadII.[E-mail Nro 1 EntidadII], 'Cumpleaños' AS Recordatorio
FROM     dbo.Entidad INNER JOIN
                  dbo.EntidadIII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadIII.[Documento Entidad] 
                  INNER JOIN
                  dbo.EntidadII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad] 
                  INNER JOIN
                  dbo.[Entidad Recordatorios] ON dbo.Entidad.[Documento Entidad] = dbo.[Entidad Recordatorios].[Documento Entidad]
                  
WHERE  (YEAR(dbo.[Entidad Recordatorios].Cumpleaños) < YEAR(GETDATE())) AND (DAY(dbo.EntidadIII.[Fecha Nacimiento EntidadIII]) = DAY(GETDATE())) AND (MONTH(dbo.EntidadIII.[Fecha Nacimiento EntidadIII]) = MONTH(GETDATE())) AND (dbo.EntidadII.[E-mail Nro 1 EntidadII] LIKE N'%@%') AND EXISTS (
        SELECT 1
        FROM dbo.CompromisoVI C
        WHERE C.[Entidad Atendida] = dbo.Entidad.[Documento Entidad]
          AND C.[Fecha Inicio CompromisoVI] >= DATEADD(YEAR, -1, GETDATE())
    );
GO


CREATE VIEW [dbo].[Cnsta Recordatorios Navidad]
AS
SELECT TOP(100) dbo.Entidad.[Documento Entidad], dbo.Entidad.[Nombre Completo Entidad], dbo.[Entidad Recordatorios].Navidad, dbo.EntidadII.[E-mail Nro 1 EntidadII], 'Feliz navidad' AS Recordatorio
FROM     dbo.Entidad INNER JOIN
                  dbo.EntidadII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad] 
                  INNER JOIN dbo.[Entidad Recordatorios] 
                  ON dbo.Entidad.[Documento Entidad] = dbo.[Entidad Recordatorios].[Documento Entidad]
                  
WHERE  (YEAR(dbo.[Entidad Recordatorios].Navidad) < YEAR(GETDATE())) AND (DAY(GETDATE()) = 24) AND (MONTH(GETDATE()) = 12) AND (dbo.EntidadII.[E-mail Nro 1 EntidadII] LIKE N'%@%') AND EXISTS (
        SELECT 1
        FROM dbo.CompromisoVI C
        WHERE C.[Entidad Atendida] = dbo.Entidad.[Documento Entidad]
          AND C.[Fecha Inicio CompromisoVI] >= DATEADD(YEAR, -1, GETDATE())
    );
GO


