namespace PimFolhaPagamentoV2.Classes
{
    public class Function
    {
        public static string LimparString(string dado) {
            // Declara variável para limpar a string
            string vstr_string = null; 

            if (!string.IsNullOrEmpty(dado))
            {
                vstr_string = dado.Replace("'", "''").Trim();
            } 

            // Retorna o valor
            return vstr_string;

        }
    }
}
