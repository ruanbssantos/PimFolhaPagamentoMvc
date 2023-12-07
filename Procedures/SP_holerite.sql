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
						
				if LEN(@id_empresa) > 0
					set @vstr_cmd += ' AND H.id_empresa =' + CONVERT(varchar,@id_empresa) 

				if LEN(@id_funcionario) > 0
					set @vstr_cmd += ' AND H.id_funcionario =' + CONVERT(varchar,@id_funcionario) 

				if LEN(@id_contrato) > 0
					set @vstr_cmd += ' AND H.id_contrato =' + CONVERT(varchar,@id_contrato) 

				if LEN(@nr_mes) > 0
					set @vstr_cmd += ' AND H.nr_mes =' + CONVERT(varchar,@nr_mes) 

				if LEN(@nr_ano) > 0
					set @vstr_cmd += ' AND H.nr_ano =' + CONVERT(varchar,@nr_ano) 

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

			IF @vstr_acao = 'CARREGAR_HOLERITE_VISUALIZACAO'
			BEGIN
				SELECT
					isnull(E.nomeFantasia,E.razaoSocial) as empresa
					,dbo.MascaraCPFCNPJ(E.cnpj) as cnpj 
					,FORMAT(H.nr_mes, '00') + '/' + FORMAT(H.nr_ano, '0000') as ds_referencia
					,F.nome as nomeFuncionario
					,cbo.codigo as codigoCBO
					,cbo.titulo as tituloCBO
					,CONVERT(varchar,H.dt_admissao,103) as dt_admissao
					,FORMAT(H.nr_salarioBruto, 'N', 'pt-BR') AS nr_salarioBruto
					,FORMAT(H.nr_baseINSS, 'N', 'pt-BR') AS nr_baseINSS
					,FORMAT(H.nr_baseFGTS, 'N', 'pt-BR') AS nr_baseFGTS
					,FORMAT(H.nr_valorFGTS, 'N', 'pt-BR') AS nr_valorFGTS
					,FORMAT(H.nr_baseIRRF, 'N', 'pt-BR') AS nr_baseIRRF
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
					SUM(CASE WHEN id_tipo = 1 THEN HL.nr_valor ELSE 0 END) AS nr_totalProvento
					,SUM(CASE WHEN id_tipo = 2 THEN HL.nr_valor ELSE 0 END) AS nr_totalDesconto 
					INTO #TEMP_TOTAIS
				FROM
					holeriteLancamentos HL 
				WHERE
					id_holerite = @id_holerite

				SELECT 
					FORMAT(nr_totalProvento, 'N', 'pt-BR') AS nr_totalProvento
					,FORMAT(nr_totalDesconto, 'N', 'pt-BR') AS nr_totalDesconto
					,FORMAT((nr_totalProvento - nr_totalDesconto), 'N', 'pt-BR') AS nr_salarioLiquido
				FROM
					#TEMP_TOTAIS

				SELECT
					HL.descricao AS descricao
					,isnull(FORMAT(HL.nr_referencia, 'N', 'pt-BR'),'') AS nr_referencia
					,CASE
						WHEN HL.id_tipo = 1 THEN FORMAT(HL.nr_valor, 'N', 'pt-BR') 
						ELSE ''
					END AS provento
					,CASE
						WHEN HL.id_tipo = 1 THEN FORMAT(HL.nr_valor, 'N', 'pt-BR') 
						ELSE ''
					END AS desconto
					,FORMAT(HL.nr_valor, 'N', 'pt-BR') AS txt_valor
				FROM
					holeriteLancamentos HL 
				WHERE
					id_holerite = @id_holerite
				ORDER BY
					nr_ordem

				DROP TABLE #TEMP_TOTAIS
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