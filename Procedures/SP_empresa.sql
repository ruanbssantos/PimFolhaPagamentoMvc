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
		IF @vstr_tipoOper = 'SEL'
		BEGIN
			IF @vstr_acao = 'CARREGAR_EMPRESA'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						ROW_NUMBER() OVER (ORDER BY razaoSocial ASC) AS nr_registro
						,dbo.MascaraCPFCNPJ(cnpj) AS cnpj
						,razaoSocial
						,nomeFantasia
						,CASE
							isnull(status_fl,0)
							WHEN 1 THEN ''Ativo''
							WHEN 0 THEN ''Inativo''
						END ds_status	

   						,id_empresa AS [id_empresa|PK]

						INTO #TEMP_BUSCA
					FROM
						empresa
					WHERE
						1=1'
		
				if LEN(@status_fl) > 0
					set @vstr_cmd += ' AND status_fl =' + CONVERT(varchar,@status_fl) 

				if LEN(@razaoSocial) > 0
					set @vstr_cmd += ' AND razaoSocial like ''%' + CONVERT(varchar,@razaoSocial) + '%'''

				if LEN(@nomeFantasia) > 0
					set @vstr_cmd += ' AND nomeFantasia like ''%' + CONVERT(varchar,@nomeFantasia) + '%'''
				
				if LEN(@cnpj) > 0
					set @vstr_cmd += ' AND cnpj like ''%' + CONVERT(varchar,@cnpj) + '%'''

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

			IF @vstr_acao = 'CARREGAR_CAMPOS_EMPRESA'
			BEGIN
				SELECT
					cnpj AS txt_cnpj
					,nomeFantasia AS txt_nomeFantasia
					,razaoSocial AS txt_razaoSocial
					,CONVERT(tinyint,status_fl) AS cmb_status
				FROM
					empresa
				WHERE
					id_empresa = @id_empresa
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
						,status_fl	 			= @status_fl
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

					SET @id_empresa = SCOPE_IDENTITY();
				END 

				SELECT @id_empresa AS id_empresa;
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