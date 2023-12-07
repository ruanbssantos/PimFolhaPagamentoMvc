using System.ComponentModel.DataAnnotations;

namespace PimFolhaPagamentoV2.Models.Empresa
{
    public class EmpresaDados
    {
        public string? hdn_idEmpresa {  get; set; } 
        public string? txt_cnpj { get; set; } 
        public string? txt_razaoSocial { get; set; }
        public string? txt_nomeFantasia { get; set; }
        public string? cmb_status { get; set; }
    }
}
