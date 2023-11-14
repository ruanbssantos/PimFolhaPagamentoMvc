using Microsoft.AspNetCore.Mvc;

namespace PimFolhaPagamentoV2.Controllers.Holerite
{
    public class HoleriteController : Controller
    {
        private readonly string vstr_title = "Holerite";

        // GET: Holerite
        public IActionResult Consulta()
        {
            ViewBag.Title = vstr_title;
            return View();
        }
    }
}
