using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Controller
{
    [Route("api/listings/")]
    [ApiController]
    public class ListingController : ControllerBase
    {
        #region Dependencies 
        IListingServices ListingServices;
        ISublistingsServices SublistingServices;

        public ListingController(IListingServices listingServices, ISublistingsServices sublistingsServices)
        {
            this.ListingServices = listingServices;
            this.SublistingServices = sublistingsServices;
        }
        #endregion

        public async Task<IActionResult> Get()
        {
            var listingDTOs = await ListingServices.GetAllListings();
            return new OkObjectResult(new { listings = listingDTOs });
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var listingDTOs = await ListingServices.GetListing(id);
            return new OkObjectResult(new { listing = listingDTOs });
        }

        [HttpPost, Route("{id}/update")]
        public async Task<IActionResult> UpdateListing(int id, ListingDTO listingDto)
        {
            await ListingServices.UpdateListingInformation(id, listingDto);
            return Ok();
        }

        [HttpGet, Route("{id}/sublistings")]
        public async Task<IActionResult> GetSublistingsOfAListing(int id)
        {
            return new OkObjectResult(new
            {
                sublistings = await SublistingServices.GetAllSublistings(id)
            }
            );
        }

        [HttpPost, Route("{id}/autoCompleteSublistings")]
        public async Task<IActionResult> AutoCompleteListing(int id)
        {
            await ListingServices.AutoAddSublistings(id);
            return Ok();
        }

        [HttpPost, Route("new")]
        public async Task<IActionResult> AddNewListing(ListingDTO newListingDto)
        {
            
            var newListingId = await ListingServices.HandleNewListingAddition(newListingDto);
            if (newListingId == -1)
            {
                return new BadRequestObjectResult("There was a problem with the app. the process was reversed and no changes were made to the database.");
            }
            return new OkObjectResult(new
            {
                listingId = newListingId
            }
            );
        }

        [HttpPost, Route("{id}/delete")]
        public async Task<IActionResult> DeleteListing(int id)
        {
            await ListingServices.DeleteListing(id);
            return Ok();
        }

        

    }
}
