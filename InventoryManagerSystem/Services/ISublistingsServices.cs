using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public interface ISublistingsServices
    {
        public Task AddNewSublisting(SublistingDTO sublistingDTO);
        public Task<IEnumerable<SublistingDTO>> GetAllSublistings(int listingId);
        public Task<SublistingDTO> Get(int id);
        public Task<SublistingDTO> Get(string sublistingRef);
        public Task Update(SublistingDTO sublistingDto);


    }
}
