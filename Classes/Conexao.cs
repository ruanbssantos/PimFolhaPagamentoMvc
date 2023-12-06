using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Text.Json;

namespace PimFolhaPagamentoV2.Classes
{
    public class Conexao
    { 
        public SqlConnection? conn; 
        public void AbrirConexao()
        {
            try
            { 
                var builder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

                IConfigurationRoot configuration = builder.Build();
                var connString = configuration.GetConnectionString("DataBase");
                  
                conn = new SqlConnection(connString); 
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
                    conn.Dispose();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao fechar a conexão: " + ex.Message);
            }
        }
    }
}
