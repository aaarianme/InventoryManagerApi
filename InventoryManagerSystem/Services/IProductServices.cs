using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public interface IProductServices
    {
        public Task<ProductDTO> GetProduct(string webCode);
        public Task<IEnumerable<ProductDTO>> GetAllProducts();
        public Task<IEnumerable<ProductDTO>> FilterProducts(IEnumerable<ProductDTO> givenProducts, string searchFor, string brand);
        public Task<List<object>> GetAllBrands();
        public Task<string> AddProduct(ProductDTO productDto);

    }
}
