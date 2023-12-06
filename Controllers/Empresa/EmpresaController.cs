using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using PimFolhaPagamentoV2.Models.Empresa;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Controllers.Empresa
{
    public class EmpresaController : Controller
    {
        private readonly string vstr_title = "Empresa";
        private bool success = false;
        private string? message;

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

        public IActionResult Alteracao()
        {
            ViewBag.Title = vstr_title + " - Alteração";
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

                        cmd.Parameters.Add("@cnpj", System.Data.SqlDbType.VarChar).Value = dados.txt_cnpj;
                        cmd.Parameters.Add("@razaoSocial", System.Data.SqlDbType.VarChar).Value = dados.txt_razaoSocial;
                        cmd.Parameters.Add("@nomeFantasia", System.Data.SqlDbType.VarChar).Value = dados.txt_nomeFantasia;
                        cmd.Parameters.Add("@status_fl", System.Data.SqlDbType.VarChar).Value = dados.cmb_status;
                        cmd.Parameters.Add("@id_usuarioAcao", System.Data.SqlDbType.VarChar).Value = HttpContext.Session.GetString("id_usuario");

                        cmd.ExecuteReader();
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


                return Json(new { success = success, message = message });

            } 
            catch (Exception ex) { 
                return BadRequest(ex.Message); 
            }
        } 

    }
}
