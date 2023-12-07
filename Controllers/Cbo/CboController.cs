using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes;
using PimFolhaPagamentoV2.Models.Empresa;
using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Controllers.Cbo
{
    public class CboController : Controller
    {
        private readonly string vstr_title = "CBO";
        private bool success = false;
        private string? message;
        private string? id;

        public IActionResult Consulta()
        {
            ViewBag.Title = "CBO";
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

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_cbo";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "INS";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "GRAVAR_CBO";

                    cmd.Parameters.Add("@id_cbo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_idCbo"].ToString()); 
                    cmd.Parameters.Add("@codigo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_codigo"].ToString()); 
                    cmd.Parameters.Add("@titulo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_titulo"].ToString()); 
                    cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString()); 
                    cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                    cmd.ExecuteReader();
                }
                conexao.FecharConexao();

                success = true;
                if (Function.LimparString(dados["hdn_idCbo"].ToString()) == null) message = "Cadastro realizado com sucesso!";
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
                    cmd.CommandText = "SP_cbo";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CBO";


                    cmd.Parameters.Add("@top", System.Data.SqlDbType.NVarChar).Value = vint_qtdPagina;
                    cmd.Parameters.Add("@nr_registroInicial", System.Data.SqlDbType.NVarChar).Value = vint_registroInicial;
                    cmd.Parameters.Add("@codigo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_codigo"].ToString()); 
                    cmd.Parameters.Add("@titulo", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_titulo"].ToString());  
                    cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString());  

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao();

                return Json(new { success = true, dadosBanco.resultado, registroInicial = (vint_registroInicial + 1) });

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
                    cmd.CommandText = "SP_cbo";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CAMPOS_CBO";
                    cmd.Parameters.Add("@id_cbo", System.Data.SqlDbType.NVarChar).Value = dados["id_cbo"].ToString();

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao();

                if (dadosBanco.resultado.Count > 0)
                {
                    success = true;
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
