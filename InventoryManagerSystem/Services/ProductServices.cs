using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Helpers.ErrorHelper;
using InventoryManagerSystem.Helpers.Mapper;
using InventoryManagerSystem.Models;
using InventoryManagerSystem.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public class ProductServices : IProductServices
    {
        #region Dependencies
        private readonly IProductstRep ProductsRep;
        public ProductServices(IProductstRep productstRep)
        {
            ProductsRep = productstRep;
        }
        #endregion

        public async Task<ProductDTO> GetProduct(string webCode)
        {
            var product = await ProductsRep.Get(webCode);
            return await DtoMapper.MapToProductDTO(product);
        }

        public async Task<IEnumerable<ProductDTO>> GetAllProducts()
        {
            var result = await ProductsRep.GetAll();
            var dto=new List<ProductDTO>();
            foreach(IProduct product in result)
            {
                dto.Add(await DtoMapper.MapToProductDTO(product));
            }
            return dto;
        }

        private async Task<IEnumerable<ProductDTO>> FilterProducts(IEnumerable<ProductDTO> givenProducts, string searchFor)
        {
            if (string.IsNullOrEmpty(searchFor)) return givenProducts;
            return givenProducts.Where(x => x.WebCode.ToLower().Contains(searchFor) || x.Brand.Name.ToLower()==searchFor.ToLower() || x.Brand.Name.ToLower().Contains(searchFor.ToLower())|| x.WebCode.ToLower()==searchFor.ToLower() || x.Name.ToLower()==searchFor.ToLower() || x.Name.ToLower().Contains(searchFor.ToLower()) || (x.SKU ?? string.Empty).ToLower().Contains(searchFor.ToLower()) || (x.Color?? string.Empty).ToLower().Contains(searchFor)).ToList();
        }

        public async Task<IEnumerable<ProductDTO>> FilterProducts(IEnumerable<ProductDTO> givenProducts, string searchFor, string brand)
        {
            if (string.IsNullOrWhiteSpace(brand)) return (await FilterProducts(givenProducts, searchFor));

            var filtered = await FilterProducts(givenProducts, searchFor);
            return givenProducts.Where(x => x.Brand.Name==brand);
        }
        
        /// <summary>
        /// Get all Brands available in the database. in form of {displayName: , value:
        /// </summary>
        /// <returns></returns>
        public async Task<List<object>> GetAllBrands()
        {
            var res = new List<object>();
            var allBrands = await ProductsRep.GetAllBrands();
            foreach(IBrand Brand in allBrands)
            {
                res.Add(new
                {
                    DisplayName = Brand.Name,
                    Value = Brand.Name
                }); 
            }
            return res;

        }

        public async Task<string> AddProduct(ProductDTO productDto)
        {
            if (string.IsNullOrWhiteSpace(productDto.Name)) throw new BadRequestException("Name of the product must be provided.");
            if (string.IsNullOrWhiteSpace(productDto.Brand.Name)) throw new BadRequestException("Name of the brand of the product must be provided.");
            var brand = await ProductsRep.GetBrand(productDto.Brand.Name);
            if (brand is null) throw new BadRequestException($"Unable to find the brand {productDto.Brand.Name}.");
            if (productDto.RetailPrice is null) productDto.RetailPrice = 0;

            var webCode = await GenerateUniqueWebCode();
            var insertedId= await ProductsRep.Insert(new Product()
            {
                Name = Regex.Replace(productDto.Name, @"(^\w)|(\s\w)", m => m.Value.ToUpper()),
                Brand =brand,
                Color=await DtoMapper.ConvertToColorway(productDto.Color),
                Notes= productDto.Notes,
                DateAdded=DateTime.Now.Date,
                DateModified=DateTime.Now.Date,
                RetailPrice=(double)productDto.RetailPrice,
                SKU=productDto.SKU?.ToUpper(),
                WebCode=webCode.ToUpper(),
                Image=productDto.Image
            });
            return webCode;

        }

        private async Task<string> GenerateUniqueWebCode()
        {
            string res = "";
            while (1 > 0)
            {
                int totalLetters = 3;
                int totalNumbers = 3;
                Random rand = new Random();
                if (rand.Next(0, 2) == 2) totalLetters++; else totalNumbers++;
                for (int i = 1; i <= totalLetters; i++)
                {
                    char newChar = (char)rand.Next(65, 90);
                    res += newChar;
                }
                for (int i = 1; i <= totalNumbers; i++)
                {
                    string newNum = rand.Next(0, 9).ToString();
                    res += newNum;
                }
                if (await ProductsRep.Get(res) is null) break;
                else res = "";
            }
            return res;
        }
    }
}
