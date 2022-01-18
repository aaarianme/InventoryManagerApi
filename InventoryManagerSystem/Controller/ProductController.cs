using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Controller
{
    [Route("api/products/")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        #region all dependencies
        private readonly IProductServices ProductServices;
        public ProductController(IProductServices productServices)
        {
            this.ProductServices = productServices;
        }
        #endregion

        [HttpGet]
        public async Task<IActionResult> Get(string searchFor,string brand)
        {
            var ProductDtos = await ProductServices.GetAllProducts();
            ProductDtos = await ProductServices.FilterProducts(ProductDtos,searchFor, brand);
            return new OkObjectResult(new { Products = ProductDtos });
        }
        [HttpGet]
        [Route("fetch/allBrands")]
        public async Task<IActionResult> GetAllBrands()
        {
            return new OkObjectResult(new
            {
                items = await ProductServices.GetAllBrands()
            });
        }

        [HttpGet, Route("get/{webCode}")]
        public async Task<IActionResult> GetProduct(string webCode)
        {
            var productDto = await ProductServices.GetProduct(webCode);
            return new OkObjectResult(new { product = productDto });
        }

        [HttpPost]
        [Route("new")]
        public async Task<IActionResult> AddNewProduct(ProductDTO productDto)
        {
            var res = await ProductServices.AddProduct(productDto);
            return new OkObjectResult(new
            {
                webCode=res
            });
        }


    }
}
