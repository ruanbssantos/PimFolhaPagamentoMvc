using Microsoft.AspNetCore.Mvc;

namespace PimFolhaPagamentoV2.Controllers.Cbo
{
    public class CboController : Controller
    {
        private readonly string vstr_title = "CBO";

        public IActionResult Consulta()
        {
            ViewBag.Title = "CBO";
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
