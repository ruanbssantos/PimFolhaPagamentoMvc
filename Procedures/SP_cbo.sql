IF EXISTS(SELECT NAME FROM SYSOBJECTS WHERE NAME = 'SP_Cbo')
BEGIN
	DROP PROCEDURE SP_Cbo
END
GO

Create Procedure dbo.SP_Cbo
	@vstr_tipoOper 			char(3)			= null
	,@vstr_acao				nvarchar(max)	= null 
	,@id_usuarioAcao		bigint			= null
	,@nr_registroInicial	bigint			= null
	,@top					int				= null
	,@status_fl				bit				= null

	,@id_cbo				bigint			= null
	,@codigo				varchar(50)		= null
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
			IF @vstr_acao = 'CARREGAR_CAMPOS_CBO'
			BEGIN
				SELECT
					codigo AS txt_codigo
					,titulo AS txt_titulo
					,CONVERT(tinyint,status_fl) AS cmb_status
				FROM	
					cbo
				WHERE
					id_cbo = @id_cbo
			END

			IF @vstr_acao = 'CARREGAR_CBO'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT
						ROW_NUMBER() OVER (ORDER BY titulo ASC) AS nr_registro
						,codigo
						,titulo
						,CASE
							isnull(status_fl,0)
							WHEN 1 THEN ''Ativo''
							WHEN 0 THEN ''Inativo''
						END ds_status	

   						,id_cbo AS [id_cbo|PK]

						INTO #TEMP_BUSCA
					FROM
						cbo
					WHERE
						1=1'
		
				if LEN(@codigo) > 0
					set @vstr_cmd += ' AND codigo like ''%' + CONVERT(varchar,@codigo) + '%'''

				if LEN(@titulo) > 0
					set @vstr_cmd += ' AND titulo like ''%' + CONVERT(nvarchar(max),@titulo) + '%'''

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
					 
				print(@vstr_cmd)
				execute (@vstr_cmd)
			END

			IF @vstr_acao = 'FIELD_CBO'
			BEGIN 
				set @vstr_cmd = ' 
					SELECT 
						id_cbo AS [id]
						,codigo + '' - '' + titulo AS [label]
					FROM
						cbo
					WHERE
						status_fl = 1'
		
				if LEN(@codigo) > 0
					set @vstr_cmd += ' AND codigo like ''%' + CONVERT(varchar,@codigo) + '%'''

				if LEN(@titulo) > 0
					set @vstr_cmd += ' AND titulo like ''%' + CONVERT(varchar,@titulo) + '%'''

				execute (@vstr_cmd)
			END
		END

		IF @vstr_tipoOper = 'INS'
		BEGIN
			IF @vstr_acao = 'GRAVAR_CBO'
			BEGIN 

				IF EXISTS(SELECT id_cbo FROM cbo WHERE codigo = @codigo) AND @id_cbo IS NULL 
					SET @id_cbo = (SELECT id_cbo FROM cbo WHERE codigo = @codigo)		
				
				IF LEN(@id_cbo) > 0
				BEGIN
					UPDATE cbo SET
						codigo					= @codigo
						,titulo					= @titulo
						,status_fl	 			= @status_fl
						,id_ultimoUsuarioAcao	= @id_usuarioAcao
						,dt_ultimaAcao			= GETDATE()
					WHERE
						id_cbo					= @id_cbo
				END 
				ELSE
				BEGIN
					INSERT INTO cbo (
						codigo
						,titulo
						,id_ultimoUsuarioAcao
						,status_fl
					) VALUES (
						@codigo
						,@titulo 
						,@id_usuarioAcao
						,@status_fl
					)

					SET @id_cbo = SCOPE_IDENTITY();
				END 

				SELECT @id_cbo AS id_empresa;
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