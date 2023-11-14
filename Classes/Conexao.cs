using System.Data.SqlClient;

namespace PimFolhaPagamentoV2.Classes
{
    public class Conexao
    {
        public SqlConnection conn;

        public void AbrirConexao()
        {
            try
            {
                conn = new SqlConnection("Server=localhost;Database=PIM_III;User Id=SA;Password=1q2w3e4r5t@@;MultipleActiveResultSets=True;");
                conn.Open();
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao abrir a conexão: " + ex.Message);
            }
        }

        public void FecharConexao()
        {
            try
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao fechar a conexão: " + ex.Message);
            }
        }
    }
}
