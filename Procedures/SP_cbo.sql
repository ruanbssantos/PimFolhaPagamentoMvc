IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_Cbo')
BEGIN
	DROP PROCEDURE SP_Cbo
END
GO

Create Procedure dbo.SP_Cbo
	@vstr_tipoOper 		char(3)			= null
	,@vstr_acao			nvarchar(max)	= null
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Inicie a transação
    BEGIN TRANSACTION;
    
	--Declara variavel
	Declare @vstr_cmd As nvarchar(max)

    BEGIN TRY
		
		IF @vstr_tipoOper = 'SEL'
		BEGIN
			IF @vstr_acao = 'Field_Cbo'
			BEGIN
				SELECT 
					id_cbo AS [id]
					,cbo AS [label]
				FROM
					cbo
				WHERE
					fl_status = 1
			END
		END


    END TRY
    BEGIN CATCH 
        -- Se ocorrer um erro 
        ROLLBACK; 
    END CATCH; 

    -- Se chegou até aqui, commit a transação
    COMMIT;
END;