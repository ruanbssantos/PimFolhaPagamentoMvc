using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Controllers.Contrato
{
    public class ContratoController : Controller
    {
        private readonly string vstr_title = "Contrato";
        private bool success = false;
        private string? message;
        private string? id;

        public IActionResult Consulta()
        {
            ViewBag.Title = vstr_title;
            return View();
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

                Conexao conexao = new Conexao();
                ResultadoBancoDados? dadosBanco = null;

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_contrato";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "INS";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "GRAVAR_CONTRATO";
                    cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                    cmd.Parameters.Add("@id_contrato", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_idContrato"].ToString());
                    cmd.Parameters.Add("@id_empresa", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_empresa"].ToString());
                    cmd.Parameters.Add("@id_funcionario", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_funcionario"].ToString());
                    cmd.Parameters.Add("@id_cbo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_cbo"].ToString());

                    cmd.Parameters.Add("@dt_admissao", System.Data.SqlDbType.VarChar).Value = Function.FormatarDataParaSQL(dados["txt_dtAdmissao"].ToString());

                    cmd.Parameters.Add("@nr_salarioBruto", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_salarioBase"].ToString());
                    cmd.Parameters.Add("@nr_baseINSS", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_baseINSS"].ToString());
                    cmd.Parameters.Add("@nr_baseFGTS", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_baseFGTS"].ToString());
                    cmd.Parameters.Add("@nr_valorFGTS", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_valorFGTS"].ToString());
                    cmd.Parameters.Add("@nr_baseIRRF", System.Data.SqlDbType.Decimal).Value = Function.FormatarMoedaParaSQL(dados["txt_baseIRRF"].ToString()); 

                    cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString());

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao();

                if (dadosBanco.erroSql)
                {
                    return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                }
                else
                {
                    success = true;
                    if (Function.LimparString(dados["hdn_idContrato"].ToString()) == null) message = "Cadastro realizado com sucesso!";
                    else message = "Alteração realizada com sucesso!";
                    return Json(new { success = success, message = message });
                }



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
                    cmd.CommandText = "SP_contrato";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CONTRATO";


                    cmd.Parameters.Add("@top", System.Data.SqlDbType.NVarChar).Value = vint_qtdPagina;
                    cmd.Parameters.Add("@nr_registroInicial", System.Data.SqlDbType.NVarChar).Value = vint_registroInicial;

                    cmd.Parameters.Add("@id_empresa", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_empresa"].ToString());
                    cmd.Parameters.Add("@id_funcionario", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_funcionario"].ToString());
                    cmd.Parameters.Add("@id_cbo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_txt_cbo"].ToString());
                    cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString());
                    

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
                    cmd.CommandText = "SP_contrato";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CAMPOS_CONTRATO";
                    cmd.Parameters.Add("@id_contrato", System.Data.SqlDbType.NVarChar).Value = dados["id_contrato"].ToString();

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
