IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_contrato')
BEGIN
	DROP PROCEDURE SP_contrato
END
GO

Create Procedure dbo.SP_contrato
	@vstr_tipoOper 			char(3)			= null
	,@vstr_acao				nvarchar(max)	= null
	,@id_usuarioAcao		bigint			= null
	,@nr_registroInicial	bigint			= null
	,@top					int				= null
	,@status_fl				bit				= null

	,@id_contrato           bigint          = null
	,@id_funcionario        bigint          = null
	,@id_empresa            bigint          = null
	,@id_cbo                bigint          = null
	,@dt_admissao           date            = null
	,@nr_salarioBruto       decimal(18, 2)  = null
	,@nr_baseINSS           decimal(18, 2)  = null
	,@nr_baseFGTS           decimal(18, 2)  = null
	,@nr_valorFGTS          decimal(18, 2)  = null
	,@nr_baseIRRF           decimal(18, 2)  = null
	,@codigo				nvarchar(max)	= null
	,@titulo				nvarchar(max)	= null
	  
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
			IF @vstr_acao = 'CARREGAR_CONTRATO'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						ROW_NUMBER() OVER (ORDER BY F.nome  + '' - '' + dbo.MascaraCPFCNPJ(F.cpf) ASC) AS nr_registro
						,isnull(E.nomeFantasia,E.razaoSocial)  + '' - '' + dbo.MascaraCPFCNPJ(E.cnpj) as ds_empresa
						,F.nome  + '' - '' + dbo.MascaraCPFCNPJ(F.cpf) as ds_funcionario
						,cbo.codigo + '' - '' + cbo.titulo as ds_cbo
						,CASE
							isnull(C.status_fl,0)
							WHEN 1 THEN ''Ativo''
							WHEN 0 THEN ''Inativo''
						END ds_status	

   						,C.id_contrato AS [id_contrato|PK] 
						INTO #TEMP_BUSCA
					FROM
						contrato C
						INNER JOIN empresa E ON C.id_empresa = E.id_empresa
						INNER JOIN funcionario F ON C.id_funcionario = F.id_funcionario
						INNER JOIN cbo ON C.id_cbo = cbo.id_cbo
					WHERE
						1=1'

				if LEN(@id_empresa) > 0
					set @vstr_cmd += ' AND C.id_empresa =' + CONVERT(varchar,@id_empresa) 

				if LEN(@id_funcionario) > 0
					set @vstr_cmd += ' AND C.id_funcionario =' + CONVERT(varchar,@id_funcionario) 

				if LEN(@id_cbo) > 0
					set @vstr_cmd += ' AND C.id_cbo =' + CONVERT(varchar,@id_cbo) 

				if LEN(@status_fl) > 0
					set @vstr_cmd += ' AND status_fl =' + CONVERT(varchar,@status_fl) 

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

			IF @vstr_acao = 'CARREGAR_CAMPOS_CONTRATO'
			BEGIN
				SELECT
					E.id_empresa as hdn_txt_empresa
					,isnull(E.nomeFantasia,E.razaoSocial)  + ' - ' + dbo.MascaraCPFCNPJ(E.cnpj) as txt_empresa
					,F.id_funcionario as hdn_txt_funcionario
					,F.nome  + ' - ' + dbo.MascaraCPFCNPJ(F.cpf) as txt_funcionario
					,cbo.id_cbo AS hdn_txt_cbo
					,cbo.codigo + ' - ' + cbo.titulo as txt_cbo 
					,CONVERT(varchar,dt_admissao,23) as txt_dtAdmissao
					,FORMAT(C.nr_salarioBruto, 'N', 'pt-BR') AS txt_salarioBase
					,FORMAT(C.nr_baseINSS, 'N', 'pt-BR') AS txt_baseINSS
					,FORMAT(C.nr_baseFGTS, 'N', 'pt-BR') AS txt_baseFGTS
					,FORMAT(C.nr_valorFGTS, 'N', 'pt-BR') AS txt_valorFGTS
					,FORMAT(C.nr_baseIRRF, 'N', 'pt-BR') AS txt_baseIRRF
					,CONVERT(tinyint, C.status_fl) AS cmb_status
				FROM
					contrato C
					INNER JOIN empresa E ON C.id_empresa = E.id_empresa
					INNER JOIN funcionario F ON C.id_funcionario = F.id_funcionario
					INNER JOIN cbo ON C.id_cbo = cbo.id_cbo
				WHERE
					id_contrato = @id_contrato
			END 

			IF @vstr_acao = 'FIELD_CONTRATO'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						C.id_contrato AS [id]
						,cbo.codigo + '' - '' + cbo.titulo AS [label]
						,CONVERT(varchar,dt_admissao,23) as txt_dtAdmissao
						,FORMAT(C.nr_salarioBruto, ''N'', ''pt-BR'') AS nr_salarioBruto
						,FORMAT(C.nr_baseINSS, ''N'', ''pt-BR'') AS nr_baseINSS
						,FORMAT(C.nr_baseFGTS, ''N'', ''pt-BR'') AS nr_baseFGTS
						,FORMAT(C.nr_valorFGTS, ''N'', ''pt-BR'') AS nr_valorFGTS
						,FORMAT(C.nr_baseIRRF, ''N'', ''pt-BR'') AS nr_baseIRRF
					FROM
						contrato C
						INNER JOIN empresa E ON C.id_empresa = E.id_empresa
						INNER JOIN funcionario F ON C.id_funcionario = F.id_funcionario
						INNER JOIN cbo ON C.id_cbo = cbo.id_cbo
					WHERE
						1=1'

				if LEN(@id_empresa) > 0
					set @vstr_cmd += ' AND C.id_empresa =' + CONVERT(varchar,@id_empresa) 

				if LEN(@id_funcionario) > 0
					set @vstr_cmd += ' AND C.id_funcionario =' + CONVERT(varchar,@id_funcionario) 

				if LEN(@codigo) > 0
					set @vstr_cmd += ' AND cbo.codigo like ''%' + CONVERT(varchar(200),@codigo) + '%'''

				if LEN(@titulo) > 0
					set @vstr_cmd += ' AND cbo.titulo like ''%' + CONVERT(varchar(200),@titulo) + '%'''

				if LEN(@status_fl) > 0
					set @vstr_cmd += ' AND C.status_fl =' + CONVERT(varchar,@status_fl) 

				set @vstr_cmd += ' 
					ORDER BY 
						[label]'

				execute (@vstr_cmd)
			END
		END

		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_CONTRATO'
			BEGIN  
				
				IF LEN(@id_contrato) > 0
				BEGIN 
					UPDATE contrato SET
						id_funcionario				= @id_funcionario
						,id_empresa					= @id_empresa
						,id_cbo						= @id_cbo
						,dt_admissao				= @dt_admissao
						,nr_salarioBruto			= @nr_salarioBruto
						,nr_baseINSS				= @nr_baseINSS
						,nr_baseFGTS				= @nr_baseFGTS
						,nr_valorFGTS				= @nr_valorFGTS
						,nr_baseIRRF				= @nr_baseIRRF
						 
						,status_fl	 				= @status_fl
						,id_ultimoUsuarioAcao		= @id_usuarioAcao
						,dt_ultimaAcao				= GETDATE()
					WHERE
						id_contrato					= @id_contrato
				END 
				ELSE
				BEGIN 
					INSERT INTO contrato( 
						id_funcionario
						,id_empresa
						,id_cbo
						,dt_admissao
						,nr_salarioBruto
						,nr_baseINSS
						,nr_baseFGTS
						,nr_valorFGTS
						,nr_baseIRRF
						,dt_ultimaAcao
						,status_fl
						,id_ultimoUsuarioAcao
					) VALUES (
						@id_funcionario
						,@id_empresa
						,@id_cbo
						,@dt_admissao
						,@nr_salarioBruto
						,@nr_baseINSS
						,@nr_baseFGTS
						,@nr_valorFGTS
						,@nr_baseIRRF
						,GETDATE()
						,@status_fl
						,@id_usuarioAcao
					)

					SET @id_contrato = SCOPE_IDENTITY();
				END 

				SELECT @id_contrato AS id_contrato;
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