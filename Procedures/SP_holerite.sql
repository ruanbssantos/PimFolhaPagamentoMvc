IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_holerite')
BEGIN
	DROP PROCEDURE SP_holerite
END
GO

Create Procedure dbo.SP_holerite
	@vstr_tipoOper 			char(3)			= null
	,@vstr_acao				nvarchar(max)	= null
	,@id_usuarioAcao		bigint			= null
	,@nr_registroInicial	bigint			= null
	,@top					int				= null

	,@id_holerite			bigint			= null
	,@id_empresa			bigint			= null
	,@id_funcionario		bigint			= null
	,@id_contrato			bigint			= null
	,@dt_admissao			date			= null
	,@nr_mes				int				= null
	,@nr_ano				int				= null
	,@nr_salarioBruto		decimal(18, 2)	= null
	,@nr_baseINSS			decimal(18, 2)	= null
	,@nr_baseFGTS			decimal(18, 2)	= null
	,@nr_valorFGTS			decimal(18, 2)	= null
	,@nr_baseIRRF			decimal(18, 2)	= null
	,@id_status				int				= null


	  
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
			IF @vstr_acao = 'CARREGAR_HOLERITE'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						ROW_NUMBER() OVER (ORDER BY (nr_ano+nr_mes) DESC) AS nr_registro
						,FORMAT(H.nr_mes, ''00'') + ''/'' + FORMAT(H.nr_ano, ''0000'') as ds_referencia
						,isnull(E.nomeFantasia,E.razaoSocial)  + '' - '' + dbo.MascaraCPFCNPJ(E.cnpj) as ds_empresa
						,F.nome  + '' - '' + dbo.MascaraCPFCNPJ(F.cpf) as ds_funcionario
						,cbo.codigo + '' - '' + cbo.titulo as ds_cbo
						,HS.ds_status

						,H.id_holerite AS [id_holerite|PK]
						INTO #TEMP_BUSCA
					FROM
						holerite H
						INNER JOIN contrato C ON H.id_contrato = C.id_contrato
						INNER JOIN empresa E ON C.id_empresa = E.id_empresa
						INNER JOIN funcionario F ON C.id_funcionario = F.id_funcionario
						INNER JOIN cbo ON C.id_cbo = cbo.id_cbo
						INNER JOIN holeriteStatus HS ON H.id_status = HS.id_status
					WHERE
						1=1'
						
				--if LEN(@cpf) > 0
				--	set @vstr_cmd += ' AND cpf like ''%' + CONVERT(varchar,@cpf) + '%'''

				--if LEN(@nome) > 0
				--	set @vstr_cmd += ' AND nome like ''%' + CONVERT(varchar,@nome) + '%'''

				--if LEN(@email) > 0
				--	set @vstr_cmd += ' AND email like ''%' + CONVERT(varchar,@email) + '%'''
		
				--if LEN(@status_fl) > 0
				--	set @vstr_cmd += ' AND status_fl =' + CONVERT(varchar,@status_fl) 

				--if LEN(@admin_fl) > 0
				--	set @vstr_cmd += ' AND admin_fl =' + CONVERT(varchar,@admin_fl) 

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

			IF @vstr_acao = 'CARREGAR_CAMPOS_HOLERITE'
			BEGIN
				SELECT
					E.id_empresa as hdn_txt_empresa
					,isnull(E.nomeFantasia,E.razaoSocial)  + ' - ' + dbo.MascaraCPFCNPJ(E.cnpj) as txt_empresa
					,F.id_funcionario as hdn_txt_funcionario
					,F.nome  + ' - ' + dbo.MascaraCPFCNPJ(F.cpf) as txt_funcionario
					,C.id_contrato AS hdn_txt_contrato
					,cbo.codigo + ' - ' + cbo.titulo as txt_contrato
					,H.id_status as cmb_status
					,H.nr_mes as cmb_mes
					,H.nr_ano as cmb_ano

					,CONVERT(varchar,H.dt_admissao,23) as txt_dtAdmissao
					,FORMAT(H.nr_salarioBruto, 'N', 'pt-BR') AS txt_salarioBase
					,FORMAT(H.nr_baseINSS, 'N', 'pt-BR') AS txt_baseINSS
					,FORMAT(H.nr_baseFGTS, 'N', 'pt-BR') AS txt_baseFGTS
					,FORMAT(H.nr_valorFGTS, 'N', 'pt-BR') AS txt_valorFGTS
					,FORMAT(H.nr_baseIRRF, 'N', 'pt-BR') AS txt_baseIRRF
				FROM
					holerite H
					INNER JOIN contrato C ON H.id_contrato = C.id_contrato
					INNER JOIN empresa E ON C.id_empresa = E.id_empresa
					INNER JOIN funcionario F ON C.id_funcionario = F.id_funcionario
					INNER JOIN cbo ON C.id_cbo = cbo.id_cbo
					INNER JOIN holeriteStatus HS ON H.id_status = HS.id_status
				WHERE
					id_holerite = @id_holerite


				SELECT
					HL.id_tipo AS cmb_tipo
					,HLT.ds_tipo AS tipo
					,HL.descricao AS txt_descricao
					,FORMAT(HL.nr_referencia, 'N', 'pt-BR') AS txt_referencia
					,FORMAT(HL.nr_valor, 'N', 'pt-BR') AS txt_valor
				FROM
					holeriteLancamentos HL
					INNER JOIN holeriteLancamentosTipo HLT ON HL.id_tipo = HLT.id_tipo
				WHERE
					id_holerite = @id_holerite
				ORDER BY
					nr_ordem
			END  
		END

		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_HOLERITE'
			BEGIN 
			 
				IF EXISTS(
					SELECT
						1
					FROM
						holerite
					WHERE
						id_empresa = @id_empresa
					and id_funcionario = @id_funcionario
					and id_contrato = @id_contrato
					and nr_mes = @nr_mes
					and nr_ano = @nr_ano
				)
					SET @id_holerite = (
						SELECT
							id_holerite
						FROM
							holerite
						WHERE
							id_empresa = @id_empresa
						and id_funcionario = @id_funcionario
						and id_contrato = @id_contrato
						and nr_mes = @nr_mes
						and nr_ano = @nr_ano
					)		
				
				IF LEN(@id_holerite) > 0
				BEGIN 
					UPDATE holerite SET
						id_empresa				= @id_empresa
						,id_status				= @id_status
						,id_funcionario			= @id_funcionario
						,id_contrato			= @id_contrato
						,dt_admissao			= @dt_admissao
						,nr_mes					= @nr_mes
						,nr_ano					= @nr_ano
						,nr_salarioBruto		= @nr_salarioBruto
						,nr_baseINSS			= @nr_baseINSS
						,nr_baseFGTS			= @nr_baseFGTS
						,nr_valorFGTS			= @nr_valorFGTS
						,nr_baseIRRF			= @nr_baseIRRF
						,id_ultimoUsuarioAcao	= @id_usuarioAcao
						,dt_ultimaAcao			= GETDATE()
					WHERE
						id_funcionario			= @id_funcionario

					DELETE FROM holeriteLancamentos WHERE id_holerite = @id_holerite
				END 
				ELSE
				BEGIN 
					INSERT INTO holerite(
						id_empresa 
						,id_funcionario
						,id_contrato
						,dt_admissao
						,nr_mes
						,nr_ano
						,nr_salarioBruto
						,nr_baseINSS
						,nr_baseFGTS
						,nr_valorFGTS
						,nr_baseIRRF
						,id_status
						,id_ultimoUsuarioAcao
					) VALUES (
						@id_empresa 
						,@id_funcionario
						,@id_contrato
						,@dt_admissao
						,@nr_mes
						,@nr_ano
						,@nr_salarioBruto
						,@nr_baseINSS
						,@nr_baseFGTS
						,@nr_valorFGTS
						,@nr_baseIRRF
						,@id_status
						,@id_usuarioAcao
					)

					SET @id_holerite = SCOPE_IDENTITY();
				END 
				 
				SELECT @id_holerite AS id_holerite;
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