using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public interface IListingsRep
    {
        /// <summary>
        /// Get a listing model from id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>if nothing found returns null</returns>
        public Task<IListing> Get(int? id);
        /// <summary>
        /// Get all available listing models in the database. ALL!
        /// </summary>
        /// <returns></returns>
        public Task<IEnumerable<IListing>> GetAll();
        /// <summary>
        /// Update certain info, this func has an overload.
        /// </summary>
        /// <param name="listingId">id of the listing</param>
        /// <param name="cost">double</param>
        /// <param name="size">string</param>
        /// <param name="datePurchased">must be datetime</param>
        /// <param name="deadline">must be datetime</param>
        /// <param name="notes">string</param>
        /// <returns></returns>
        public Task Update(IListing listing);

        public Task<int> Insert(IListing listing);

        /// <summary>
        /// Delete a listingId record from the database.
        /// </summary>
        /// <param name="listingId">id</param>
        /// <returns></returns>
        public Task Delete(int listingId);



    }
}
