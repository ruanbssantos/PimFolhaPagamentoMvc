using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Classes
{
    public class ResultadoBancoDados
    {
        public List<List<Dictionary<string, string>>> Resultado { get; set; }
    }

    public class RsToArray
    {
        public static ResultadoBancoDados CriarJSONDoDataReader(SqlDataReader reader)
        {
            ResultadoBancoDados resultadoBanco = new ResultadoBancoDados();
            resultadoBanco.Resultado = new List<List<Dictionary<string, string>>>();

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

                resultadoBanco.Resultado.Add(listaDeDados);
            }
            while (reader.NextResult());

            return resultadoBanco;
        }
    }

}
