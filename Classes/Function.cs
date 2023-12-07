namespace PimFolhaPagamentoV2.Classes
{
    public class Function
    {
        public static string LimparString(string dado)
        {
            // Declara variável para limpar a string
            string vstr_string = null;

            if (!string.IsNullOrEmpty(dado))
            {
                vstr_string = dado.Replace("'", "\'").Trim();
            }

            // Retorna o valor
            return vstr_string;

        }

        public static bool IsNumeric(string value)
        {
            return value.All(char.IsNumber);
        }

        public static string FormatarMoedaParaSQL(string valor)
        {
            string valorLimpo = valor.Replace("R$", "").Replace(".", "").Replace(",", ".");
             
            // Verifica se a string não está vazia e se é um número decimal válido
            if (!string.IsNullOrEmpty(valorLimpo) && decimal.TryParse(valorLimpo, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out decimal valorNumerico))
            {
                return valorNumerico.ToString("0.00", System.Globalization.CultureInfo.GetCultureInfo("pt-BR"));
            }
            else
            {
                return null;
            }
        }

        public static string FormatarDataParaSQL(string data)
        {
            if (DateTime.TryParseExact(
                data, "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None,
                out DateTime dataFormatada))
            {
                return dataFormatada.ToString("yyyyMMdd");
            }
            else
            {
                return null;
            }

        }
    }
}
