using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public interface ISalesServices
    {
        public Task<ISaleRecord> NewSale(SalesRecordDTO saleRecord);
        public Task<List<SaleRecord>> GetAllSales();
        public Task<ISaleRecord> MakeNewSaleHandler(SalesRecordDTO saleRecord);

    }
}
