using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryManagerSystem.Helpers.ErrorHelper;

namespace InventoryManagerSystem.Services
{
    public interface IListingServices
    {
        /// <summary>
        /// Returns all listing DTO's available. In order of their dateAdded
        /// </summary>
        /// <returns></returns>
        public Task<IEnumerable<ListingDTO>> GetAllListings();

        /// <summary>
        /// Get a listing from its Id
        /// </summary>
        /// <param name="id">Id of the lsiting</param>
        /// <exception cref="BadRequestException" If no listing is found.
        /// <returns>A listing DTO</returns>
        public Task<ListingDTO> GetListing(int id);

        /// <summary>
        /// Update the following dat of a listings: Notes,Cost,Size,DatePurchased,Deadline,Quantity
        /// </summary>
        /// <param name="listingId"></param>
        /// <param name="newListingDTO"></param>
        /// <returns></returns>
        public Task UpdateListingInformation(int listingId,ListingDTO newListingDTO);

        public Task<int> HandleNewListingAddition(ListingDTO listingDTO);

        /// <summary>
        /// Add a new listing. checks for valid inputs. Calls AutoAddSublisting to add the sublistings automatically.
        /// </summary>
        /// <param name="newListing"></param>
        /// <returns>The Id of the new listing</returns>
        public Task<int> AddNewListing(ListingDTO newListing);

        /// <summary>
        /// Deletes a listing Id, if found.
        /// </summary>
        /// <param name="listingId"></param>
        /// <returns></returns>
        public Task DeleteListing(int listingId);

        /// <summary>
        /// Automatically add sublistings with status NotRecieved for a listing
        /// </summary>
        /// <param name="listingId">listingId. if not found it will throw an exeption</param>
        /// <returns>Returns true if inserting data was needed and the operation took place. if there is already sublistings in place it will try to max out the quantity. if already maxed out it return false</returns>
        public Task<bool> AutoAddSublistings(int listingId);


      
    }
}
