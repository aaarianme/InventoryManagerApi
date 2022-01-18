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
    public class SublistingsRep : ISublistingsRep
    {
        #region Dependencies
        private readonly IDbConnection SublistingsDb;
        public SublistingsRep(IOptions<SqlConfigureOptions> options)
        {
            SublistingsDb = new SqlConnection(options.Value.SqlConnectionString);
        }
        #endregion

        public async Task<ISublisting> Get(int sublistingId)
        {
            var sqlcmd = "select SublistingId,SublistingRef,ListingId,Status,SalesRecord from Sublistings where SublistingId=@id";
            return SublistingsDb.Query<Sublisting>(sqlcmd, new { @id = sublistingId }).FirstOrDefault();
        }
        public async Task<ISublisting> Get(string sublistingRef)
        {
            var sqlcmd = "select SublistingId,SublistingRef,ListingId,Status,SalesRecord from Sublistings where SublistingRef=@ref";
            return SublistingsDb.Query<Sublisting>(sqlcmd, new { @ref = sublistingRef }).FirstOrDefault();
        }
        public async Task<IEnumerable<ISublisting>> GetAllSublistings(int listingId)
        {
            var sqlcmd = "select SublistingId,SublistingRef,Status,SalesRecord from Sublistings where ListingId=@listingid";
            return SublistingsDb.Query<Sublisting>(sqlcmd, new { @listingid = listingId }).ToList();
        }

        public async Task Insert(ISublisting sublisting)
        {
            var sqlcmd = "Insert into Sublistings (SublistingRef,ListingId,Status,SalesRecord) values(@ref,@listingid,@status,@salesrecord)";
            SublistingsDb.Query<Sublisting>(sqlcmd, new { @listingid = sublisting.ListingId,@ref=sublisting.SublistingRef,@status=sublisting.Status.ToString(),@salesrecord=sublisting.SalesRecord }).ToList();
        }

        public async Task Update(ISublisting sublisting)
        {
            var sqlcmd = "update Sublistings set Status=@status,SalesRecord=@salesrecord where SublistingId=@subid";
            SublistingsDb.Query(sqlcmd, new { @status = sublisting.Status.ToString(), @salesrecord = sublisting.SalesRecord ,@subid=sublisting.SublistingId });
        }
    }
}
