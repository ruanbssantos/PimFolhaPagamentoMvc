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
			IF @vstr_acao = 'CARREGAR_FUNCIONARIO'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						ROW_NUMBER() OVER (ORDER BY nome ASC) AS nr_registro
						,dbo.MascaraCPFCNPJ(cpf) AS cpf
						,nome
						,email
						,CASE
							isnull(status_fl,0)
							WHEN 1 THEN ''Ativo''
							WHEN 0 THEN ''Inativo''
						END ds_status	
						,CASE
							isnull(admin_fl,0)
							WHEN 1 THEN ''Sim''
							WHEN 0 THEN ''Não''
						END ds_admin

   						,id_funcionario AS [id_funcionario|PK]

						INTO #TEMP_BUSCA
					FROM
						funcionario
					WHERE
						1=1'
						
				if LEN(@cpf) > 0
					set @vstr_cmd += ' AND cpf like ''%' + CONVERT(varchar,@cpf) + '%'''

				if LEN(@nome) > 0
					set @vstr_cmd += ' AND nome like ''%' + CONVERT(varchar,@nome) + '%'''

				if LEN(@email) > 0
					set @vstr_cmd += ' AND email like ''%' + CONVERT(varchar,@email) + '%'''
		
				if LEN(@status_fl) > 0
					set @vstr_cmd += ' AND status_fl =' + CONVERT(varchar,@status_fl) 

				if LEN(@admin_fl) > 0
					set @vstr_cmd += ' AND admin_fl =' + CONVERT(varchar,@admin_fl) 

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

			IF @vstr_acao = 'CARREGAR_CAMPOS_FUNCIONARIO'
			BEGIN
				SELECT
					cpf AS txt_cpf
					,nome AS txt_nome
					,email AS txt_email
					,cep as txt_cep
					,logradouro as txt_endereco
					,numeroLogradouro as txt_numeroResidencial
					,estado as txt_uf
					,cidade as txt_cidade
					,bairro as txt_bairro
					,complemento as txt_complemento
					,CONVERT(tinyint,status_fl) AS cmb_status
					,CONVERT(tinyint,admin_fl) AS cmb_admin
				FROM
					funcionario
				WHERE
					id_funcionario = @id_funcionario
			END 

			IF @vstr_acao = 'FIELD_FUNCIONARIO'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT 
						id_funcionario AS [id]
						,nome  + '' - '' + dbo.MascaraCPFCNPJ(cpf) AS [label]
					FROM
						funcionario
					WHERE
						status_fl = 1'
		
				if LEN(@cpf) > 0
					set @vstr_cmd += ' AND cpf like ''%' + CONVERT(varchar,@cpf) + '%'''

				if LEN(@nome) > 0
					set @vstr_cmd += ' AND nome like ''%' + CONVERT(varchar,@nome) + '%'''

				set @vstr_cmd += ' 
					ORDER BY 
						[label]'

				execute (@vstr_cmd)
			END
		END

		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_FUNCIONARIO'
			BEGIN 
			 
				IF EXISTS(SELECT 1 FROM funcionario WHERE cpf = @cpf)
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