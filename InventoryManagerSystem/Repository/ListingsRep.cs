using Dapper;
using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Helpers.ConfigureOptions;
using InventoryManagerSystem.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public class ListingsRep : IListingsRep
    {
        #region All Dependencies
        private readonly IDbConnection ListingsDb;
        public ListingsRep(IOptions<SqlConfigureOptions> options)
        {
            ListingsDb = new SqlConnection(options.Value.SqlConnectionString);
        }

        
        #endregion

        public async Task<IListing> Get(int? id)
        {
            if (id == null) return null;
            var lookup = new Dictionary<int, Sublisting>();

            var sqlcmd = @"select ls.Id,ls.Cost,ls.DateAdded,ls.DatePurchased,ls.Deadline,ls.Notes,ls.Quantity,ls.Size,
                            pr.Color,pr.DateAdded,pr.DateModified,pr.Id,pr.Image,pr.Name,pr.Notes,pr.RetailPrice,pr.SKU,pr.WebCode,
		                       br.BrandId,br.Name,sl.SubListingId,sl.ListingId,sl.SubListingRef,sl.Status,sl.SalesRecord
                          FROM Listings ls left join Products pr on ls.ProductId=pr.Id left join Brands br on pr.Brand=br.BrandId
						  left join Sublistings sl on sl.ListingId=ls.Id
                            WHERE ls.Id=@id";
            List<ISublisting> allSublistings = new List<ISublisting>();

            var res= ListingsDb.Query<Listing, Product, Brand, Sublisting, Listing>(
                                sqlcmd,
                                (listing, product, brand, sublisting) =>
                                {
                                    product.Brand = brand;
                                    listing.Product = product;
                                    if (listing.Sublistings is null)  listing.Sublistings = new List<ISublisting>();
                                    if(sublisting is not null && sublisting.SublistingId is not null)  allSublistings.Add(sublisting);
                                    return listing;
                                },
                                param: new {@id=id},
                                splitOn: "Color,BrandId,SubListingId").FirstOrDefault();
            if (res == null) return null;
            res.Sublistings = allSublistings;
            return res;
        }

        public async Task<IEnumerable<IListing>> GetAll()
        {
            var sqlcmd = @"select ls.Id,ls.Cost,ls.DateAdded,ls.DatePurchased,ls.Deadline,ls.Notes,ls.Quantity,ls.Size,
                            pr.Color,pr.DateAdded,pr.DateModified,pr.Id,pr.Image,pr.Name,pr.Notes,pr.RetailPrice,pr.SKU,pr.WebCode,
		                       br.BrandId,br.Name,sl.SubListingId,sl.ListingId,sl.SubListingRef,sl.Status,sl.SalesRecord
                          FROM Listings ls left join Products pr on ls.ProductId=pr.Id left join Brands br on pr.Brand=br.BrandId
						  left join Sublistings sl on sl.ListingId=ls.Id";
            Dictionary<int,Listing> allListings = new Dictionary<int, Listing>();
            var res = ListingsDb.Query<Listing,Product,Brand,Sublisting,Listing>(
                                sqlcmd,
                                (listing ,product, brand, sublisting) =>
                                {
                                    if (!allListings.TryGetValue(listing.Id, out Listing listingEntry))
                                    {
                                        listingEntry = listing;
                                        listingEntry.Sublistings = listingEntry.Sublistings ?? new List<ISublisting>();
                                        allListings.Add(listingEntry.Id, listingEntry);
                                    }
                                    product.Brand = brand;
                                    listingEntry.Product = product;
                                    if(sublisting is not null && sublisting.SublistingId is not null)
                                        listingEntry.Sublistings.Add(sublisting);
                                    return listingEntry;
                                },
                                splitOn: "Color,BrandId,SubListingId").Distinct().ToList();
            return res;

        }

        public async Task Update(IListing listing)
        {
            var sqlcmd = @"UPDATE Listings set Cost=@cost,Notes=@notes,Size=@size,DatePurchased=@datepurchased,Deadline=@deadline,Quantity=@quantity WHERE Listings.Id=@id";
            ListingsDb.Query(sqlcmd,new { @cost=listing.Cost,@size=listing.Size, @quantity = listing.Quantity, @datepurchased=listing.DatePurchased,@deadline=listing.Deadline,@notes=listing.Notes,@id=listing.Id });
        }


        public async Task<int> Insert(IListing listing)
        {
            var sqlcmd = @"INSERT INTO Listings(Cost,ProductId,Quantity,Size,DateAdded,DatePurchased,Deadline,Notes) 
                                    OUTPUT INSERTED.Id
                                values (@cost,@productid,@quantity,@size,@dateadded,@datepurchased,@deadline,@notes)";
            return ListingsDb.QuerySingle<int>(sqlcmd, new { @cost=listing.Cost,@productid=listing.Product.Id,@quantity=listing.Quantity,@size=listing.Size,@dateadded=DateTime.Now,@datepurchased=listing.DatePurchased,@deadline=listing.Deadline,@notes=listing.Notes });
            
        }

        public async Task Delete(int listingId)
        {
            var sqlcmd = @"DELETE FROM Listings WHERE Listings.Id=@id";
            ListingsDb.Query(sqlcmd, new { @id = listingId });
        }
    }
}
