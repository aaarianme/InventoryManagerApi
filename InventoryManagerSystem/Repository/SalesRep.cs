using Dapper;
using InventoryManagerSystem.Helpers.ConfigureOptions;
using InventoryManagerSystem.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public class SalesRep : ISalesRep
    {
        IDbConnection SalesDB;
        public SalesRep(IOptions<SqlConfigureOptions> options)
        {
            SalesDB = new SqlConnection(options.Value.SqlConnectionString);
        }

        public async Task<ISaleRecord> Get(int saleId)
        {
            var lookup = new Dictionary<int, Sublisting>();

            var sqlcmd = @"select sal.SaleId,sal.SublistingId,sal.Notes,sal.Date,sal.Cost,sal.SoldPrice,ls.DatePurchased,ls.Id,ls.Cost,ls.DateAdded,ls.Deadline,ls.Notes,ls.Quantity,ls.Size,ls.Status,
                            pr.Color,pr.DateAdded,pr.DateModified,pr.Id,pr.Image,pr.Name,pr.Notes,pr.RetailPrice,pr.SKU,pr.WebCode,
		                       br.BrandId,br.Name,sl.SubListingId,sl.ListingId,sl.SubListingRef,sl.Status,sl.SalesRecord
                          FROM Sales sal inner join Listings ls on sal.ListingId=ls.Id left join Products pr on ls.ProductId=pr.Id left join Brands br on pr.Brand=br.BrandId
						  left join Sublistings sl on sl.ListingId=ls.Id where sal.SaleId=@id";
            List<ISublisting> allSublistings = new List<ISublisting>();

            var res = SalesDB.Query<SaleRecord, Listing, Product, Brand, Sublisting, SaleRecord>(
                                sqlcmd,
                                (saleRec,listing, product, brand, sublisting) =>
                                {
                                    product.Brand = brand;
                                    listing.Product = product;
                                    if (listing.Sublistings is null) listing.Sublistings = new List<ISublisting>();
                                    if (sublisting is not null && sublisting.SublistingId is not null) allSublistings.Add(sublisting);
                                    saleRec.Listing = listing;
                                    return saleRec;
                                },
                                param: new { @id = saleId },
                                splitOn: "DatePurchased,Color,BrandId,SubListingId").FirstOrDefault();
            if (res == null) return null;
            res.Listing.Sublistings = allSublistings;
            return res;
        }
        public async Task<ISaleRecord> Get(string record)
        {
            var lookup = new Dictionary<int, Sublisting>();

            var sqlcmd = @"select sal.SaleId,sal.SublistingId,sal.Notes,sal.Date,sal.Cost,sal.SoldPrice,ls.DatePurchased,ls.Id,ls.Cost,ls.DateAdded,ls.Deadline,ls.Notes,ls.Quantity,ls.Size,ls.Status,
                            pr.Color,pr.DateAdded,pr.DateModified,pr.Id,pr.Image,pr.Name,pr.Notes,pr.RetailPrice,pr.SKU,pr.WebCode,
		                       br.BrandId,br.Name,sl.SubListingId,sl.ListingId,sl.SubListingRef,sl.Status,sl.SalesRecord
                          FROM Sales sal inner join Listings ls on sal.ListingId=ls.Id left join Products pr on ls.ProductId=pr.Id left join Brands br on pr.Brand=br.BrandId
						  left join Sublistings sl on sl.ListingId=ls.Id where sal.Record=@record";
            List<ISublisting> allSublistings = new List<ISublisting>();

            var res = SalesDB.Query<SaleRecord, Listing, Product, Brand, Sublisting, SaleRecord>(
                                sqlcmd,
                                (saleRec, listing, product, brand, sublisting) =>
                                {
                                    product.Brand = brand;
                                    listing.Product = product;
                                    if (listing.Sublistings is null) listing.Sublistings = new List<ISublisting>();
                                    if (sublisting is not null && sublisting.SublistingId is not null) allSublistings.Add(sublisting);
                                    saleRec.Listing = listing;
                                    return saleRec;
                                },
                                param: new { @record = record },
                                splitOn: "DatePurchased,Color,BrandId,SubListingId").FirstOrDefault();
            if (res == null) return null;
            res.Listing.Sublistings = allSublistings;
            return res;
        }
        public async Task<List<SaleRecord>> GetAll()
        {
            var lookup = new Dictionary<int, Sublisting>();

            var sqlcmd = @"select sal.SaleId,sal.SublistingId,sal.Notes,sal.Date,sal.Cost,sal.SoldPrice,ls.DatePurchased,ls.Id,ls.Cost,ls.DateAdded,ls.Deadline,ls.Notes,ls.Quantity,ls.Size,ls.Status,
                            pr.Color,pr.DateAdded,pr.DateModified,pr.Id,pr.Image,pr.Name,pr.Notes,pr.RetailPrice,pr.SKU,pr.WebCode,
		                       br.BrandId,br.Name,sl.SubListingId,sl.ListingId,sl.SubListingRef,sl.Status,sl.SalesRecord
                          FROM Sales sal inner join Listings ls on sal.ListingId=ls.Id left join Products pr on ls.ProductId=pr.Id left join Brands br on pr.Brand=br.BrandId
						  left join Sublistings sl on sl.ListingId=ls.Id";
            List<ISublisting> allSublistings = new List<ISublisting>();

            var res = SalesDB.Query<SaleRecord, Listing, Product, Brand, Sublisting, SaleRecord>(
                                sqlcmd,
                                (saleRec, listing, product, brand, sublisting) =>
                                {
                                    product.Brand = brand;
                                    listing.Product = product;
                                    if (listing.Sublistings is null) listing.Sublistings = new List<ISublisting>();
                                    if (sublisting is not null && sublisting.SublistingId is not null) allSublistings.Add(sublisting);
                                    saleRec.Listing = listing;
                                    return saleRec;
                                },
                                splitOn: "DatePurchased,Color,BrandId,SubListingId").ToList();
            if (res == null) return null;
            return res;
        }

        public async Task<int> Insert(ISaleRecord saleRec)
        {
            var sqlcmd = "INSERT INTO Sales (SoldPrice,SublistingId,ListingId,Cost,Date,Notes) OUTPUT INSERTED.SaleId values(@soldp,@sublistingid,@listingid,@cost,@date,@notes)";
            return SalesDB.Query<int>(sqlcmd, new
            { @soldp=saleRec.SoldPrice,@notes=saleRec.Notes,@sublistingid=saleRec.Sublisting.SublistingId,@listingid=saleRec.Listing.Id,@cost=saleRec.Cost,@date=saleRec.Date}).FirstOrDefault();
        }

       
    }
}
