using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Helpers.Mapper;
using InventoryManagerSystem.Models;
using InventoryManagerSystem.Repository;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using InventoryManagerSystem.Helpers.ErrorHelper;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public class ListingServices : IListingServices
    {
        #region dependencies
        IListingsRep ListingRep;
        IProductstRep ProductsRep;
        ISublistingsRep SublistingRep;
        ISublistingsServices _SublistingServices;
        public ListingServices(IListingsRep ListingRep, IProductstRep productstRep, ISublistingsServices sublistingsServices, ISublistingsRep sublistingsRep)
        {
            this.ListingRep = ListingRep;
            this.ProductsRep = productstRep;
            this.SublistingRep = sublistingsRep;
            this._SublistingServices = sublistingsServices;
        }
        #endregion

        public async Task<ListingDTO> GetListing(int id)
        {
            var listing = await ListingRep.Get(id);
            if (listing is null) throw new NotFoundException($"Listing #{id} was not found");
            return await DtoMapper.MapToListingDTO(listing);
        }

        public async Task<IEnumerable<ListingDTO>> GetAllListings()
        {
            var allListings = await ListingRep.GetAll();
            var allListingsDtos = new List<ListingDTO>();
            foreach (IListing listing in allListings)
            {
                allListingsDtos.Add(await DtoMapper.MapToListingDTO(listing));
            }

            return allListingsDtos.OrderByDescending(x => x.DatePurchased);
        }

        public async Task UpdateListingInformation(int listingId, ListingDTO newListingDTO)
        {
            if (newListingDTO.Cost <= 0) throw new BadRequestException("Cost must be a non zero positive value.");
            if (newListingDTO.Quantity <= 0) throw new BadRequestException("Quantity must be a non zero positive value.");
            DateTime? _deadline = null;
            if (!DateTime.TryParse(newListingDTO.DatePurchased, out DateTime _datePurchased)) throw new BadRequestException("Date Added is not in correct format.");
            if (newListingDTO.Deadline == null) _deadline = null;
            else
            {
                if(!DateTime.TryParse(newListingDTO.Deadline, out DateTime _deadlineRes)) throw new BadRequestException("Deadline is not in correct format.");
                _deadline = _deadlineRes;
            }
            var listing = await ListingRep.Get(listingId);
            if (listingId != newListingDTO.ListingId) throw new BadRequestException("Listing Id does not match the info posted.");
            listing.Cost = (double)newListingDTO.Cost;
            listing.Size = newListingDTO.Size ?? listing.Size;
            listing.DatePurchased = _datePurchased;
            listing.Deadline = _deadline;
            listing.Notes = newListingDTO.Notes;
            listing.Quantity = newListingDTO.Quantity;
            await ListingRep.Update(listing);
        }

        public async Task<int> HandleNewListingAddition(ListingDTO listingDTO)
        {
            var insertedId = await AddNewListing(listingDTO);
            try
            {
                await AutoAddSublistings(insertedId);
                return insertedId;
            }
            catch
            {
                await DeleteListing(insertedId);
                return -1;
            }
        }

        public async Task<int> AddNewListing(ListingDTO newListing)
        {
            var requestedProduct = await ProductsRep.Get(newListing.Product?.WebCode);
            if (requestedProduct is null) throw new BadRequestException($"The product provided in the request was not found. Try looking up the WebCode '{newListing.Product.WebCode}' to see if it exsits.");
            if (string.IsNullOrWhiteSpace(newListing.Size)) throw new BadRequestException("Size must be provided");

            var insertedListingId = await ListingRep.Insert(new Listing()
            {
                Cost = (double)newListing.Cost,
                DateAdded = null,
                DatePurchased = !string.IsNullOrWhiteSpace(newListing.DatePurchased) ? DateTime.Parse(newListing.DatePurchased) : DateTime.Now,
                Deadline = !string.IsNullOrWhiteSpace(newListing.Deadline) ? DateTime.Parse(newListing.Deadline) : null,
                Notes = newListing.Notes,
                Product = requestedProduct,
                Quantity = (newListing.Quantity == 0  ? 1 : newListing.Quantity),
                Size = newListing.Size,
                Sublistings = null
            });
            return insertedListingId;
        }

        public async Task<bool> AutoAddSublistings(int listingId)
        {
            var listing = await ListingRep.Get(listingId);
            if (listing is null) throw new BadRequestException("Listing was not found.");
            var allCurrentSublistings = await SublistingRep.GetAllSublistings(listingId);
            if (allCurrentSublistings.Count() == listing.Quantity) return false;

            int? startIndex = (allCurrentSublistings.Count() == 0 ? 1 : allCurrentSublistings.Last().GetInternalListingCode() + 1);
            if (!startIndex.HasValue) return false;

            for (int i = (int)startIndex; i <= listing.Quantity; i++)
            {
                await _SublistingServices.AddNewSublisting(new SublistingDTO()
                {
                    ListingId = listing.Id,
                    SublistingRef = $"{listingId}-S{i}",
                    SalesRecord = null
                });
            }
            return true;

        }

        public async Task DeleteListing(int listingId)
        {
            await ListingRep.Delete(listingId);
        }

    }
}
