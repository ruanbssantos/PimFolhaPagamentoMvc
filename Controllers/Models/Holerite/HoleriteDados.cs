namespace PimFolhaPagamentoV2.Models.Holerite
{
    public class HoleriteDados
    {
        public string nomeEmpresa { get; set; }
        public string cnpjEmpresa { get; set; }
        public string mesAnoReferencia { get; set; }
        public string nomeFuncionario { get; set; }
        public string codigoCBO { get; set; }
        public string tituloCBO { get; set; }
        public string dt_admissao { get; set; }
        public string nr_salarioBase { get; set; }
        public string nr_baseINSS { get; set; }
        public string nr_baseFGTS { get; set; }
        public string nr_valorFGTS { get; set; }
        public string nr_valorIRRF { get; set; }
        public string nr_totalProvento { get; set; }
        public string nr_totalDesconto { get; set; }
        public string nr_salarioLiquido { get; set; }
         
        public List<HoleriteLancamentos> lancamentos { get; set; }

        public HoleriteDados() {
            lancamentos = new List<HoleriteLancamentos>();
        }
    }

    public class HoleriteLancamentos
    {
        public string descricao { get; set; }
        public string referencia { get; set; }
        public string provento { get; set; }
        public string desconto { get; set; }
    }
}
