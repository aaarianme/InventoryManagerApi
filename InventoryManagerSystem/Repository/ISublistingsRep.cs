using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public interface ISublistingsRep
    {
        public Task<ISublisting> Get(int sublistingId);
        public Task<ISublisting> Get(string sublistingRef);
        public Task Insert(ISublisting sublisting);
        public Task Update(ISublisting sublisting);


        public Task<IEnumerable<ISublisting>> GetAllSublistings(int listingId);


    }
}
