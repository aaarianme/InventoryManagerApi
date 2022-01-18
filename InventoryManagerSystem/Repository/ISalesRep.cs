using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public interface ISalesRep
    {
        public Task<ISaleRecord> Get(int saleId);
        public Task<ISaleRecord> Get(string record);
        public Task<List<SaleRecord>> GetAll();
        public Task<int> Insert(ISaleRecord saleRec);


    }
}
