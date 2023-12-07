using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;
using System.Linq;

namespace PimFolhaPagamentoV2.Controllers.Login
{
    public class LoginController : Controller
    {
		private readonly string vstr_title = "Login";
		private bool success = false;
		private string? message;

		public IActionResult Index()
        {
			ViewBag.Title = vstr_title;
			return View();
        }

		[HttpPost]
		public IActionResult Entrar()
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
					cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
					cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "LOGIN";
					cmd.Parameters.Add("@email", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["txt_email"].ToString());
					cmd.Parameters.Add("@cpf", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["txt_cpf"].ToString());

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
					if (dadosBanco.resultado[0].Count > 0) {
						HttpContext.Session.SetString("username", dadosBanco.resultado[0][0]["nome"].ToString()); // Armazena o nome de usuário na sessão
						HttpContext.Session.SetString("id_usuario", dadosBanco.resultado[0][0]["id_funcionario"].ToString()) ; // Armazena o nome de usuário na sessão

						success = true;	
					} else message = "Dados inválidos!";
					return Json(new { success = success, message = message });
				}



			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
	}
}
