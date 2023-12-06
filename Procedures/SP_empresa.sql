IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_empresa')
BEGIN
	DROP PROCEDURE SP_empresa
END
GO

Create Procedure dbo.SP_empresa
	@vstr_tipoOper 			char(3)			= null
	,@vstr_acao				nvarchar(max)	= null
	,@id_usuarioAcao		bigint			= null
	,@nr_registroInicial	bigint			= null
	,@top					int				= null

	,@id_empresa			bigint          = null
	,@cnpj					varchar(50)     = null
	,@razaoSocial			varchar(255)    = null
	,@nomeFantasia			varchar(255)    = null
	,@status_fl				bit             = null
	  
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
			IF @vstr_acao = 'CARREGAR_EMPRESA'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						ROW_NUMBER() OVER (ORDER BY razaoSocial ASC) AS nr_registro
						,razaoSocial
						,nomeFantasia
						,CASE
							isnull(status_fl,0)
							WHEN 1 THEN ''Ativo''
							WHEN 0 THEN ''Inativo''
						END ds_status	

   						,id_empresa AS [id_banner|pk]

						INTO #TEMP_BUSCA
					FROM
						empresa
					WHERE
						1=1'
		
				--if LEN(@fl_status) > 0
				--	set @vstr_cmd += ' AND fl_status =' + CONVERT(varchar,@fl_status) 

				--if LEN(@ds_banner) > 0
				--	set @vstr_cmd += ' AND ds_banner like ''%' + CONVERT(varchar,@ds_banner) + '%'''


				--GERA PAGINAÇÃO
   				set @vstr_cmd += '
					SELECT TOP '+ CONVERT(varchar,@top) + '
						* 
					FROM 
						#TEMP_BUSCA 
					WHERE 
						nr_registro > ' + CONVERT(varchar,@nr_registroInicial) + ' 
					ORDER BY 
						nr_registro

					SELECT COUNT(*) AS nr_totalRegistro FROM #TEMP_BUSCA 

					DROP TABLE #TEMP_BUSCA'
					 
				execute (@vstr_cmd)
			END

		END
		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_EMPRESA'
			BEGIN 

				IF EXISTS(SELECT 1 FROM empresa WHERE cnpj = @cnpj) AND @id_empresa IS NULL 
					SET @id_empresa = (SELECT id_empresa FROM empresa WHERE cnpj = @cnpj)		
				
				IF LEN(@id_empresa) > 0
				BEGIN
					UPDATE empresa SET
						cnpj					= @cnpj
						,razaoSocial			= @razaoSocial
						,nomeFantasia 			= @nomeFantasia 
						,id_ultimoUsuarioAcao	= @id_usuarioAcao
						,dt_ultimaAcao			= GETDATE()
					WHERE
						id_empresa				= @id_empresa
				END 
				ELSE
				BEGIN
					INSERT INTO empresa (
						cnpj
						,razaoSocial
						,nomeFantasia 
						,id_ultimoUsuarioAcao
						,status_fl
					) VALUES (
						@cnpj
						,@razaoSocial
						,@nomeFantasia 
						,@id_usuarioAcao
						,@status_fl
					)
				END 
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