﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Classes;
using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Controllers.AutoBusca
{
    public class AutoBuscaController : Controller
    {
        Conexao conexao = new Conexao();

        // GET: AutoBuscaController
        [HttpPost]
        public IActionResult Field_Cbo()
        {
            //var data = Request.Form;
            ResultadoBancoDados dadosBanco;

            conexao.AbrirConexao();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = conexao.conn;
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "SP_Cbo";
                cmd.Parameters.Add("@vstr_tipoOper", System.Data.SqlDbType.VarChar).Value = "SEL";
                cmd.Parameters.Add("@vstr_acao", System.Data.SqlDbType.NVarChar).Value = "FIELD_CBO"; 

                SqlDataReader rs = cmd.ExecuteReader();
                dadosBanco = RsToArray.CriarJSONDoDataReader(rs);

                rs.Close();
            }
            conexao.FecharConexao();


            return Json(new { Status = true, dadosBanco.resultado });

        }

    }
}
