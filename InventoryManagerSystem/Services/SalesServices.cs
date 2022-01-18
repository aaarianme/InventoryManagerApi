using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Helpers.ErrorHelper;
using InventoryManagerSystem.Models;
using InventoryManagerSystem.Repository;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public class SalesServices : ISalesServices
    {
        ISalesRep SalesRep;
        ISublistingsServices _SublistingServices;
        ISublistingsRep SublistingsRep;
        IListingServices _ListingServies;


        public SalesServices(ISalesRep salesRep, ISublistingsServices sublistingsServices, ISublistingsRep sublistingsRep, IListingServices listingServices)
        {
            SalesRep = salesRep;
            _SublistingServices = sublistingsServices;
            this.SublistingsRep = sublistingsRep;
            _ListingServies = listingServices;
        }

        public async Task<ISaleRecord> MakeNewSaleHandler(SalesRecordDTO saleRecord)
        {
            var saleRecFinalized = await NewSale(saleRecord);
            await _SublistingServices.Update(new SublistingDTO()
            {
                ListingId = saleRecFinalized.Listing.Id,
                SalesRecord = saleRecFinalized.SaleId,
                Status = "SOLD",
                SublistingId = saleRecFinalized.Sublisting.SublistingId,
                SublistingRef = saleRecFinalized.Sublisting.SublistingRef
            });
            return saleRecFinalized;
        }

        public async Task<ISaleRecord> NewSale(SalesRecordDTO saleRecordDTO)
        {
            var saleRecord = await ClassFactory.ConvertToSaleRecordObject(saleRecordDTO);
            if (saleRecord.Cost < 0) throw new BadRequestException("Cost must be a positive value");
            if (saleRecord.SoldPrice < 0) throw new BadRequestException("Sold Price must be a positive value");
            if (String.IsNullOrWhiteSpace(saleRecord.Sublisting.SublistingRef) && saleRecord.Sublisting.SublistingId == null) throw new BadRequestException("A sublisting must be provided in order to make the sale.");
            ISublisting sublis;
            if (saleRecord.Sublisting.SublistingId != null) sublis = await SublistingsRep.Get((int)saleRecord.Sublisting.SublistingId);
            else sublis = await SublistingsRep.Get(saleRecord.Sublisting.SublistingRef);
            if (sublis == null) throw new BadRequestException("Sublisting was not found.");
            if (sublis.ListingId != saleRecord.Listing.Id) throw new BadRequestException("This Sublisting does not belong to the listing provided.");
            var _listing = await _ListingServies.GetListing((int)saleRecord.Listing.Id);
            
            var insertedId = await SalesRep.Insert(saleRecord);
            saleRecord.SaleId = insertedId;
            return saleRecord;
        }

        public async Task<List<SaleRecord>> GetAllSales()
        {
            return await SalesRep.GetAll();
        }

    }
}
