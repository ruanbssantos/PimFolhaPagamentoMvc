using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Classes
{
    public class ResultadoBancoDados
    {
        public List<List<Dictionary<string, string>>>? resultado { get; set; }
        public bool erroSql  = false; 
    }

    public class RsToArray
    {
        public static ResultadoBancoDados CriarJSONDoDataReader(SqlDataReader reader)
        {
            ResultadoBancoDados resultadoBanco = new ResultadoBancoDados();
            resultadoBanco.resultado = new List<List<Dictionary<string, string>>>();

            // Loop para ler cada conjunto de resultados
            do
            {
                List<Dictionary<string, string>> listaDeDados = new List<Dictionary<string, string>>();

                while (reader.Read())
                {
                    Dictionary<string, string> dadosDoBanco = new Dictionary<string, string>();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        string nomeColuna = reader.GetName(i);
                        object valorColuna = reader.GetValue(i);

                        if (valorColuna == null) valorColuna = "";

                        dadosDoBanco[nomeColuna] = valorColuna.ToString().Trim();
                    }

                    listaDeDados.Add(dadosDoBanco);
                }

                resultadoBanco.resultado.Add(listaDeDados);
            }
            while (reader.NextResult());

            //trata erros
            if (resultadoBanco.resultado.Count == 1) {
                if (resultadoBanco.resultado[0][0].ContainsKey("SP_ERROR_MESSAGE") == true) resultadoBanco.erroSql = true;
            }

            return resultadoBanco;
        }
    }

}
