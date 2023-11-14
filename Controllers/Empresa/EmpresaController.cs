using Microsoft.AspNetCore.Mvc;

namespace PimFolhaPagamentoV2.Controllers.Empresa
{
    public class EmpresaController : Controller
    {
        private readonly string vstr_title = "Empresa";

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
