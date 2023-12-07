using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Controllers.AutoBusca
{
    public class AutoBuscaController : Controller
    {
        [HttpPost]
        public IActionResult Field_empresa()
        {
            var dados = Request.Form;
            try
            {
                Conexao conexao = new Conexao();
                ResultadoBancoDados dadosBanco;

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_empresa";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "FIELD_EMPRESA";

                    if(Function.IsNumeric(dados["ds_busca"].ToString())) cmd.Parameters.Add("@cnpj", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["ds_busca"].ToString());
                    else cmd.Parameters.Add("@nomeFantasia", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["ds_busca"].ToString());


                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);

                    rs.Close();
                }
                conexao.FecharConexao();

                if (dadosBanco.erroSql) return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                else return Json(new { Status = true, dadosBanco.resultado });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            } 
        }

        [HttpPost]
        public IActionResult Field_funcionario()
        {
            var dados = Request.Form;
            try
            {
                Conexao conexao = new Conexao();
                ResultadoBancoDados dadosBanco;

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_funcionario";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "FIELD_FUNCIONARIO";

                    if (Function.IsNumeric(dados["ds_busca"].ToString())) cmd.Parameters.Add("@cpf", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["ds_busca"].ToString());
                    else cmd.Parameters.Add("@nome", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["ds_busca"].ToString());


                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);

                    rs.Close();
                }
                conexao.FecharConexao();

                if (dadosBanco.erroSql) return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                else return Json(new { Status = true, dadosBanco.resultado });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Field_cbo()
        {
            var dados = Request.Form;
            try
            {
                Conexao conexao = new Conexao();
                ResultadoBancoDados dadosBanco;

                conexao.AbrirConexao();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conexao.conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "SP_cbo";
                    cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                    cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "FIELD_CBO";
                    cmd.Parameters.Add("@top", System.Data.SqlDbType.NVarChar).Value = "50";

                    if (Function.IsNumeric(dados["ds_busca"].ToString())) cmd.Parameters.Add("@codigo", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["ds_busca"].ToString());
                    else cmd.Parameters.Add("@titulo", System.Data.SqlDbType.NVarChar).Value = Function.LimparString(dados["ds_busca"].ToString());


                    SqlDataReader rs = cmd.ExecuteReader();
                    dadosBanco = RsToArray.CriarJSONDoDataReader(rs);

                    rs.Close();
                }
                conexao.FecharConexao();

                if (dadosBanco.erroSql) return BadRequest(dadosBanco.resultado[0][0]["SP_ERROR_MESSAGE"].ToString());
                else return Json(new { Status = true, dadosBanco.resultado });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
