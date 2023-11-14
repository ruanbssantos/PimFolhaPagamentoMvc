using Microsoft.AspNetCore.Mvc;
using PimFolhaPagamentoV2.Models;
using System.Diagnostics;

namespace PimFolhaPagamentoV2.Controllers
{
    public class HomeController : Controller
    {
       
        public IActionResult Index()
        {

            ViewBag.Title = "Home";
            return View();
        }
         
    }
}