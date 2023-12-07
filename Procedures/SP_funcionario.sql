IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_funcionario')
BEGIN
	DROP PROCEDURE SP_funcionario
END
GO

Create Procedure dbo.SP_funcionario
	@vstr_tipoOper 			char(3)			= null
	,@vstr_acao				nvarchar(max)	= null
	,@id_usuarioAcao		bigint			= null
	,@nr_registroInicial	bigint			= null
	,@top					int				= null

	,@id_funcionario        bigint			= null
	,@cpf                   varchar(11)		= null
	,@nome                  nvarchar(MAX)	= null
	,@email					nvarchar(MAX)	= null
	,@cep                   nvarchar(MAX)	= null
	,@logradouro            nvarchar(MAX)	= null
	,@numeroLogradouro      nvarchar(MAX)	= null
	,@estado                nvarchar(MAX)	= null
	,@cidade                nvarchar(MAX)	= null
	,@bairro                nvarchar(MAX)	= null
	,@complemento			nvarchar(MAX)	= null
	,@admin_fl              bit				= null
	,@status_fl             bit				= null 
	  
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
		
				--if LEN(@status_fl) > 0
				--	set @vstr_cmd += ' AND status_fl =' + CONVERT(varchar,@status_fl) 

				--if LEN(@razaoSocial) > 0
				--	set @vstr_cmd += ' AND razaoSocial like ''%' + CONVERT(varchar,@razaoSocial) + '%'''

				--if LEN(@nomeFantasia) > 0
				--	set @vstr_cmd += ' AND nomeFantasia like ''%' + CONVERT(varchar,@nomeFantasia) + '%'''
				
				--if LEN(@cnpj) > 0
				--	set @vstr_cmd += ' AND cnpj like ''%' + CONVERT(varchar,@cnpj) + '%'''

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
					id_empresa = @id_funcionario
			END 
		END

		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_FUNCIONARIO'
			BEGIN 
			 
				IF EXISTS(SELECT 1 FROM funcionario WHERE cpf = @cpf) AND @id_funcionario IS NULL 
					SET @id_funcionario = (SELECT id_funcionario FROM funcionario WHERE cpf = @cpf)		
				
				IF LEN(@id_funcionario) > 0
				BEGIN 
					UPDATE funcionario SET
						cpf			            = @cpf
						,nome                   = @nome
						,email                  = @email
						,cep                    = @cep
						,logradouro             = @logradouro
						,numeroLogradouro       = @numeroLogradouro
						,estado                 = @estado
						,cidade                 = @cidade
						,bairro                 = @bairro
						,complemento			= @complemento

						,admin_fl				= @admin_fl
						,status_fl	 			= @status_fl
						,id_ultimoUsuarioAcao	= @id_usuarioAcao
						,dt_ultimaAcao			= GETDATE()
					WHERE
						id_funcionario			= @id_funcionario
				END 
				ELSE
				BEGIN 
					INSERT INTO funcionario(
						cpf
						,nome
						,email
						,cep
						,logradouro
						,numeroLogradouro
						,estado
						,cidade
						,bairro
						,complemento
						,admin_fl
						,status_fl
						,id_ultimoUsuarioAcao
					) VALUES (
						@cpf
						,@nome
						,@email
						,@cep
						,@logradouro
						,@numeroLogradouro
						,@estado
						,@cidade
						,@bairro
						,@complemento
						,@admin_fl
						,@status_fl
						,@id_usuarioAcao
					)

					SET @id_funcionario = SCOPE_IDENTITY();
				END 

				SELECT @id_funcionario AS id_funcionario;
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