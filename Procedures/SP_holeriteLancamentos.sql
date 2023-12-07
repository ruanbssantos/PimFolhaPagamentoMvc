IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_holeriteLancamentos')
BEGIN
	DROP PROCEDURE SP_holeriteLancamentos
END
GO

Create Procedure dbo.SP_holeriteLancamentos
	@vstr_tipoOper 			char(3)			= null
	,@vstr_acao				nvarchar(max)	= null
	,@id_usuarioAcao		bigint			= null
	,@nr_registroInicial	bigint			= null
	,@top					int				= null

	,@id_lancamento			bigint			= null
	,@id_holerite			bigint			= null
	,@id_tipo				int				= null
	,@descricao				varchar(50)		= null
	,@nr_referencia			decimal(18, 2)	= null
	,@nr_valor				decimal(18, 2)	= null
	,@nr_ordem				int				= null
	


	  
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Inicie a transação
    BEGIN TRANSACTION;
    
	--Declara variavel
	Declare @vstr_cmd As nvarchar(max)

    BEGIN TRY 

		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_HOLERITE_LANCAMENTOS'
			BEGIN 
			 
				 
				INSERT INTO holeriteLancamentos(
					id_holerite
					,id_tipo
					,descricao
					,nr_referencia
					,nr_valor
					,nr_ordem
				) VALUES (
					@id_holerite
					,@id_tipo
					,@descricao
					,@nr_referencia
					,@nr_valor
					,@nr_ordem
				) 
			END
		END

    END TRY
    BEGIN CATCH 
        -- Se ocorrer um erro 
		SELECT ERROR_MESSAGE() AS SP_ERROR_MESSAGE;
        RollBack; 
		RETURN;
    END CATCH; 

    -- Se chegou até aqui, commit a transação
    COMMIT;
END;	