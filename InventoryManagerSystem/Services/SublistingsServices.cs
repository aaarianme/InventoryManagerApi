using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Helpers;
using InventoryManagerSystem.Helpers.ErrorHelper;
using InventoryManagerSystem.Helpers.Mapper;
using InventoryManagerSystem.Models;
using InventoryManagerSystem.Repository;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Services
{
    public class SublistingsServices : ISublistingsServices
    {
        #region Dependencies
        ISublistingsRep SublistingsRep;
        public SublistingsServices(ISublistingsRep sublistingsRep)
        {
            SublistingsRep = sublistingsRep;
        }
        #endregion

        public async Task AddNewSublisting(SublistingDTO sublistingDTO)
        {
            SubListingStatus sublistingStatus;
            if (!Enum.TryParse(sublistingDTO.Status, out sublistingStatus)) sublistingStatus = SubListingStatus.NotRecieved;
            await SublistingsRep.Insert(new Sublisting()
            {
                SublistingRef = sublistingDTO.SublistingRef,
                ListingId =  (int)sublistingDTO.ListingId,
                Status = sublistingStatus
            });
        }
        public async Task<SublistingDTO> Get(int id)
        {
            var sublis = await SublistingsRep.Get(id);
            if (sublis == null) throw new BadRequestException($"SublistingId {id} doesnt exsit.");
            return await DtoMapper.MapToSublistingDTOSingle(sublis);

        }
        public async Task<SublistingDTO> Get(string sublistingRef)
        {
            var sublis = await SublistingsRep.Get(sublistingRef);
            if (sublis == null) throw new BadRequestException($"SublistingRef {sublistingRef} doesnt exsit.");
            return await DtoMapper.MapToSublistingDTOSingle(sublis);
        }
        public async Task<IEnumerable<SublistingDTO>> GetAllSublistings(int listingId)
        {
            var allSublistings = await SublistingsRep.GetAllSublistings(listingId);
            return await DtoMapper.MapToSublistingDTO(allSublistings as IEnumerable<ISublisting>);
        }
        public async Task Update(SublistingDTO sublistingDto)
        {
            await SublistingsRep.Update(new Sublisting() { ListingId = (int)sublistingDto.ListingId, SalesRecord = sublistingDto.SalesRecord, SublistingId = sublistingDto.SublistingId, Status = EnumHelper.ParseFromDisplayName<SubListingStatus>(sublistingDto.Status), SublistingRef = sublistingDto.SublistingRef });
        }
        


    }
}
