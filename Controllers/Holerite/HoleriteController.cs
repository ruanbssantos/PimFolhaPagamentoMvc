using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes; 
using PimFolhaPagamentoV2.Models.Holerite;
using System.Data.SqlClient;
using System.Security.Cryptography.Xml;
using System.Web.Helpers;

namespace PimFolhaPagamentoV2.Controllers.Holerite
{
    public class HoleriteController : Controller
    {
        private readonly string vstr_title = "Holerite";
        private bool success = false;
        private string? message;
        private string? id;

        // GET: Holerite
        public IActionResult Consulta()
        {
            ViewBag.Title = vstr_title;
            return View();
        }

        public IActionResult Visualizar(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return NotFound(); // Retorna uma página 404 (NotFound)
                }

                ViewBag.Title = vstr_title;
                HoleriteDados holerite = new HoleriteDados();
                ResultadoBancoDados dadosBanco;

                Conexao conexao = new Conexao();

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_holerite";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_HOLERITE_VISUALIZACAO";
                    cmd.Parameters.Add("@id_holerite", System.Data.SqlDbType.VarChar).Value = Function.LimparString(id); 

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();
                }


                if (dadosBanco.erroSql)
                {
                    return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                }
                else
                {
                    if (dadosBanco.resultado[0].Count > 0)
                    {
                        var dadosHolerite = dadosBanco.resultado[0][0];
                        var dadosTotaisHolerite = dadosBanco.resultado[1][0];
                        var dadosLancamento = dadosBanco.resultado[2];


                        holerite.nomeEmpresa = dadosHolerite["empresa"].ToString();
                        holerite.cnpjEmpresa = dadosHolerite["cnpj"].ToString();
                        holerite.mesAnoReferencia = dadosHolerite["ds_referencia"].ToString();
                        holerite.nomeFuncionario = dadosHolerite["nomeFuncionario"].ToString();
                        holerite.codigoCBO = dadosHolerite["codigoCBO"].ToString();
                        holerite.tituloCBO = dadosHolerite["tituloCBO"].ToString();
                        holerite.dt_admissao = dadosHolerite["dt_admissao"].ToString();
                        holerite.nr_salarioBase = dadosHolerite["nr_salarioBruto"].ToString();
                        holerite.nr_baseINSS = dadosHolerite["nr_baseINSS"].ToString();
                        holerite.nr_baseFGTS = dadosHolerite["nr_baseFGTS"].ToString();
                        holerite.nr_valorFGTS = dadosHolerite["nr_valorFGTS"].ToString();
                        holerite.nr_valorIRRF = dadosHolerite["nr_baseIRRF"].ToString();
                        holerite.nr_totalProvento = dadosTotaisHolerite["nr_totalProvento"].ToString();
                        holerite.nr_totalDesconto = dadosTotaisHolerite["nr_totalDesconto"].ToString();
                        holerite.nr_salarioLiquido = dadosTotaisHolerite["nr_salarioLiquido"].ToString();

                        foreach (var item in dadosLancamento)
                        {
                            HoleriteLancamentos holeriteLancamentos = new HoleriteLancamentos
                            {
                                descricao = item["descricao"].ToString(),
                                referencia = item["nr_referencia"].ToString(),
                                provento = item["provento"].ToString(),
                                desconto = item["desconto"].ToString(),
                            };

                            holerite.lancamentos.Add(holeriteLancamentos);
                        }

                    }
                    else 
                    {
                        return NotFound();
                    }

                }

                conexao.FecharConexao();
                 

                return View(holerite);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public IActionResult Cadastro()
        {
            ViewBag.Title = vstr_title + " - Cadastro";
            return View("Formulario");
        }
        public IActionResult Alteracao(string id)
        {
            ViewBag.Title = vstr_title + " - Alteração";
            ViewBag.id = id;
            return View("Formulario");
        }

        [HttpPost]
        public IActionResult Gravar()
        {

            success = false;

            try
            {
                var dados = Request.Form;
                ResultadoBancoDados dadosBanco;

                Conexao conexao = new Conexao();

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_holerite";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "INS";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "GRAVAR_HOLERITE";
                    cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                    cmd.Parameters.Add("@id_holerite", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_idHolerite"].ToString());
                    cmd.Parameters.Add("@id_empresa", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_empresa"].ToString());
                    cmd.Parameters.Add("@id_funcionario", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_funcionario"].ToString());
                    cmd.Parameters.Add("@id_contrato", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_contrato"].ToString());
                    cmd.Parameters.Add("@nr_mes", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_mes"].ToString());
                    cmd.Parameters.Add("@nr_ano", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_ano"].ToString());
                    cmd.Parameters.Add("@id_status", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString());


                    cmd.Parameters.Add("@dt_admissao", System.Data.SqlDbType.VarChar).Value = Function.FormatarDataParaSQL(dados["txt_dtAdmissao"].ToString());
                    cmd.Parameters.Add("@nr_salarioBruto", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_salarioBase"].ToString());
                    cmd.Parameters.Add("@nr_baseINSS", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_baseINSS"].ToString());
                    cmd.Parameters.Add("@nr_baseFGTS", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_baseFGTS"].ToString());
                    cmd.Parameters.Add("@nr_valorFGTS", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_valorFGTS"].ToString());
                    cmd.Parameters.Add("@nr_baseIRRF", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_baseIRRF"].ToString());

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close(); 
                }


                if (dadosBanco.erroSql)
                {
                    return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                }
                else
                {

                    string vint_idHolerite = dadosBanco.resultado[0][0]["id_holerite"].ToString();

                    string[] arr_registros = dados["lancamentos"].ToString().Split("|,|");

                    foreach (string registro in arr_registros)
                    {
                        string[] dadosLancamento = registro.Split("|-|");

                        using (SqlCommand cmd = new SqlCommand())
                        {
                            cmd.Connection = conexao.conn;
                            cmd.CommandType = System.Data.CommandType.StoredProcedure;
                            cmd.CommandText = "SP_holeriteLancamentos";
                            cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "INS";
                            cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "GRAVAR_HOLERITE_LANCAMENTOS"; 
                            cmd.Parameters.Add("@id_holerite", System.Data.SqlDbType.VarChar).Value = Function.LimparString(vint_idHolerite);

                            cmd.Parameters.Add("@nr_ordem", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dadosLancamento[0].ToString()); 
                            cmd.Parameters.Add("@id_tipo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dadosLancamento[1].ToString());
                            cmd.Parameters.Add("@descricao", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dadosLancamento[2].ToString());

                            cmd.Parameters.Add("@nr_referencia", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dadosLancamento[3].ToString());
                            cmd.Parameters.Add("@nr_valor", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dadosLancamento[4].ToString()); 

                            cmd.ExecuteReader();
                        }
                    }

                }

                conexao.FecharConexao();

                success = true;
                if (Function.LimparString(dados["hdn_idHolerite"].ToString()) == null) message = "Cadastro realizado com sucesso!";
                else message = "Alteração realizada com sucesso!";
                return Json(new { success = success, message = message });



            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Carregar()
        {
            try
            {
                var dados = Request.Form;
                int vint_qtdPagina = 10;
                int vint_pagina = 1;

                if (!string.IsNullOrEmpty(dados["qtdPagina"].ToString())) vint_qtdPagina = int.Parse(dados["qtdPagina"].ToString());
                if (!string.IsNullOrEmpty(dados["pagina"].ToString())) vint_pagina = int.Parse(dados["pagina"].ToString());

                int vint_registroInicial = vint_qtdPagina * (vint_pagina - 1);

                Conexao conexao = new Conexao();
                ResultadoBancoDados? dadosBanco = null;

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_holerite";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_HOLERITE";


                    cmd.Parameters.Add("@top", System.Data.SqlDbType.NVarChar).Value = vint_qtdPagina;
                    cmd.Parameters.Add("@nr_registroInicial", System.Data.SqlDbType.NVarChar).Value = vint_registroInicial;

                    cmd.Parameters.Add("@id_empresa", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_empresa"].ToString());
                    cmd.Parameters.Add("@id_funcionario", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_funcionario"].ToString());
                    cmd.Parameters.Add("@id_contrato", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_contrato"].ToString());
                    cmd.Parameters.Add("@nr_mes", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_mes"].ToString());
                    cmd.Parameters.Add("@nr_ano", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_ano"].ToString());

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao();

                if (dadosBanco.erroSql) return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                else return Json(new { success = true, dadosBanco.resultado, registroInicial = (vint_registroInicial + 1) });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        public IActionResult CarregarCampos()
        {
            try
            {
                var dados = Request.Form;

                Conexao conexao = new Conexao();
                ResultadoBancoDados? dadosBanco = null;

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_holerite";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CAMPOS_HOLERITE";
                    cmd.Parameters.Add("@id_holerite", System.Data.SqlDbType.NVarChar).Value = dados["id_holerite"].ToString();

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao();

                if (dadosBanco.resultado.Count > 0)
                {
                    if (dadosBanco.erroSql) return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                    else success = true;
                }

                return Json(new { success = success, dadosBanco.resultado });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
