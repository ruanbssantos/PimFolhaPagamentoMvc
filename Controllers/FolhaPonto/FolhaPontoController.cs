using Microsoft.AspNetCore.Mvc;

namespace PimFolhaPagamentoV2.Controllers.FolhaPonto
{
    public class FolhaPontoController : Controller
    {

        private readonly string vstr_title = "Folha de Ponto";

        // GET: Horas
        public IActionResult Consulta()
        {
            ViewBag.Title = vstr_title;
            return View();
        }

    }
}
