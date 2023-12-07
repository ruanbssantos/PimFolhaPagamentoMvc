using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Controllers.Funcionario
{
    public class FuncionarioController : Controller
    {
        private readonly string vstr_title = "Funcionário";
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
                    cmd.CommandText = "SP_funcionario";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "INS";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "GRAVAR_FUNCIONARIO";
                    cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                    cmd.Parameters.Add("@id_funcionario", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["hdn_idFuncionario"].ToString());
                    cmd.Parameters.Add("@cpf", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_cpf"].ToString());
                    cmd.Parameters.Add("@nome", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_nome"].ToString());
                    cmd.Parameters.Add("@email", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_email"].ToString());
                    cmd.Parameters.Add("@cep", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_cep"].ToString());
                    cmd.Parameters.Add("@logradouro", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_endereco"].ToString());
                    cmd.Parameters.Add("@numeroLogradouro", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_numeroResidencial"].ToString());
                    cmd.Parameters.Add("@estado", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_uf"].ToString());
                    cmd.Parameters.Add("@cidade", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_cidade"].ToString());
                    cmd.Parameters.Add("@bairro", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_bairro"].ToString());
                    cmd.Parameters.Add("@complemento", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_complemento"].ToString());
                    cmd.Parameters.Add("@admin_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_admin"].ToString());
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
                    if (Function.LimparString(dados["hdn_idFuncionario"].ToString()) == null) message = "Cadastro realizado com sucesso!";
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
                    cmd.CommandText = "SP_funcionario";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_FUNCIONARIO";


                    cmd.Parameters.Add("@top", System.Data.SqlDbType.NVarChar).Value = vint_qtdPagina;
                    cmd.Parameters.Add("@nr_registroInicial", System.Data.SqlDbType.NVarChar).Value = vint_registroInicial;

                    cmd.Parameters.Add("@cpf", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_cpf"].ToString());
                    cmd.Parameters.Add("@nome", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_nome"].ToString());
                    cmd.Parameters.Add("@email", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["txt_email"].ToString());
                    cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_status"].ToString());
                    cmd.Parameters.Add("@admin_fl", System.Data.SqlDbType.VarChar).Value = Function.LimparString(dados["cmb_admin"].ToString());

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
                    cmd.CommandText = "SP_funcionario";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "CARREGAR_CAMPOS_FUNCIONARIO";
                    cmd.Parameters.Add("@id_funcionario", System.Data.SqlDbType.NVarChar).Value = dados["id_funcionario"].ToString();

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
