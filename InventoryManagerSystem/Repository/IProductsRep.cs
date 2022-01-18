using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public interface IProductstRep
    {
        Task<IProduct> Get(int id);
        Task<IProduct> Get(string webCode);
        Task<IEnumerable<IProduct>> GetAll();
        Task<int> Insert(IProduct product);
        Task Update(IProduct product);
        Task Delete(int id);

        Task<IEnumerable<IBrand>> GetAllBrands();
        Task<IBrand> GetBrand(int id);
        Task<IBrand> GetBrand(string name);
        Task<int> InsertBrand(IBrand brand);
        
    }
}
