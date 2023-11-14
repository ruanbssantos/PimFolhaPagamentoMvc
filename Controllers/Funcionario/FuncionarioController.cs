using Microsoft.AspNetCore.Mvc;

namespace PimFolhaPagamentoV2.Controllers.Funcionario
{
    public class FuncionarioController : Controller
    {
        private readonly string vstr_title = "Funcionário";

        public IActionResult Consulta()
        {
            ViewBag.Title = vstr_title;
            return View();
        }

        public IActionResult Cadastro()
        {
            ViewBag.Title = vstr_title + " - Cadastro";
            return View("Formulario");
        }

        public IActionResult Alteracao()
        {
            ViewBag.Title = vstr_title + " - Alteração";
            return View("Formulario");
        }
    }
}
