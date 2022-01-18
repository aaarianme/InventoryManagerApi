using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Repository;
using InventoryManagerSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Controller
{
    [Route("api/SubListings/")]
    [ApiController]
    public class SubListingController : ControllerBase
    {
        ISublistingsServices SublistingServices;
        public SubListingController(ISublistingsServices sublistingsServices)
        {
            this.SublistingServices = sublistingsServices;
        }

        public async Task<IActionResult>Get()
        {
            return Ok();
        }

        [HttpPost,Route("update")]
        public async Task<IActionResult> UpdateSublisting(SublistingDTO sublistingDto)
        {
            await SublistingServices.Update(sublistingDto);
            return Ok();
        }
    }
}
