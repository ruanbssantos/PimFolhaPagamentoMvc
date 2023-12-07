using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using PimFolhaPagamentoV2.Models.Empresa;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;
using System.Reflection.PortableExecutable;

namespace PimFolhaPagamentoV2.Controllers.Empresa
{
    public class EmpresaController : Controller
    {
        private readonly string vstr_title = "Empresa";
        private bool success = false;
        private string? message;
        private string? id;

        public IActionResult Consulta()
        {
            ViewBag.Title = vstr_title;
            return View("Consulta");
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
        public IActionResult Gravar(EmpresaDados dados)
        {

            success = false;

            try 
            {
                if (ModelState.IsValid)
                {
                    Conexao conexao = new Conexao();

                    conexao.AbrirConexao();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = conexao.conn;
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.CommandText = "SP_empresa";
                        cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "INS";
                        cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "GRAVAR_EMPRESA";

                        cmd.Parameters.Add("@cnpj", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados.txt_cnpj);
                        cmd.Parameters.Add("@razaoSocial", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados.txt_razaoSocial);
                        cmd.Parameters.Add("@nomeFantasia", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados.txt_nomeFantasia);
                        cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados.cmb_status);
                        cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                        
                        SqlDataReader rs = cmd.ExecuteReader();

                        if (rs.Read())
                        {
                            id = rs["id_empresa"].ToString(); 
                        }

                        rs.Close();
                    }
                    conexao.FecharConexao();

                    success = true;
                    if (string.IsNullOrEmpty(dados.hdn_idEmpresa)) message = "Cadastro realizado com sucesso!";
                    else message = "Alteração realizada com sucesso!";

                }
                else 
                {
                    message = string.Join("<br />", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                }


                return Json(new { success = success, message = message, id = id });

            } 
            catch (Exception ex) { 
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
                    cmd.CommandText = "SP_empresa";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_EMPRESA";


                    cmd.Parameters.Add("@top", System.Data.SqlDbType.NVarChar).Value = vint_qtdPagina;
                    cmd.Parameters.Add("@nr_registroInicial", System.Data.SqlDbType.NVarChar).Value = vint_registroInicial;
                    cmd.Parameters.Add("@cnpj", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_cnpj"].ToString());
                    cmd.Parameters.Add("@razaoSocial", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_razaoSocial"].ToString());
                    cmd.Parameters.Add("@nomeFantasia", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_nomeFantasia"].ToString());
                    cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString());
                    cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao(); 

                return Json(new { success =  true, dadosBanco.resultado, registroInicial = (vint_registroInicial+1) });

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
                    cmd.CommandText = "SP_empresa";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CAMPOS_EMPRESA";
                    cmd.Parameters.Add("@id_empresa", System.Data.SqlDbType.NVarChar).Value = dados["id_empresa"].ToString(); 
                     
                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);
                    rs.Close();

                }
                conexao.FecharConexao(); 

                if (dadosBanco.resultado.Count > 0 ) 
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
