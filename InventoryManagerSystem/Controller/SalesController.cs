using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Models;
using InventoryManagerSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Controller
{
    [Route("api/sales/")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        ISalesServices SalesServices;
        IListingServices _ListingServices;
        public SalesController(ISalesServices salesServices,IListingServices listingServices)
        {
            SalesServices = salesServices;
            _ListingServices = listingServices;
        }
        public async Task<IActionResult> Get()
        {
            return new OkObjectResult(new { sales = await SalesServices.GetAllSales() });
        }

        [HttpPost,Route("new")]
        public async Task<IActionResult> MakeASale(SalesRecordDTO saleRec)
        {
            return new OkObjectResult(new
            {
                saleNumber = SalesServices.MakeNewSaleHandler(saleRec).Result.SaleId
            });
        }
    }
}
