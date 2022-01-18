using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers.Mapper
{
    public static class DtoMapper
    {
        public static T GetValueFromDescription<T>(string name) where T : Enum
        {
            foreach (var field in typeof(T).GetFields())
            {

                var e = (Enum)field.GetValue(null);
                //if (e.GetType() .GetCustomAttribute<DisplayAttribute>() != null && field.GetCustomAttribute<DisplayAttribute>().Name == name) return (T)field.GetValue(null);
            }
            return default;
        }

        public static async Task<ProductDTO> MapToProductDTO(IProduct productModel)
        {
            return new ProductDTO()
            {
                Brand = new BrandDTO(productModel.Brand.BrandId, productModel.Brand.Name),
                Color =productModel.Color,
                DateAdded = productModel.DateAdded.ToString("MMMM dd, yyyy"),
                DateModified = productModel.DateModified.ToString("MMMM dd, yyyy"),
                Name = productModel.Name,
                Notes = productModel.Notes,
                SKU = productModel.SKU,
                RetailPrice = productModel.RetailPrice,
                WebCode = productModel.WebCode,
                Image = productModel.Image
            };
        }

        public static async Task<ListingDTO> MapToListingDTO(IListing listingModel)
        {
            return new ListingDTO()
            {
                Cost = listingModel.Cost,
                DateAdded = listingModel.DateAdded?.ToString("MMMM dd, yyyy") ?? null,
                DatePurchased = listingModel.DatePurchased.ToString("MMMM dd, yyyy"),
                Deadline = listingModel.Deadline?.ToString("MMMM dd, yyyy") ?? null,
                ListingId = listingModel.Id,
                Notes = listingModel.Notes,
                Size = listingModel.Size.ToString(),
                Quantity = listingModel.Quantity,
                Product = await MapToProductDTO(listingModel.Product),
                DaysLeftToDeadline = listingModel.Deadline is not null ? (listingModel.Deadline.Value.Date - DateTime.Now.Date).Days : null,
                Sublistings = await MapToSublistingDTO(listingModel.Sublistings)

            };
        }

        public static async Task<IList<SublistingDTO>> MapToSublistingDTO(IEnumerable<ISublisting> sublistingModels)
        {
            if (sublistingModels == null) return null;
            List<SublistingDTO> result = new List<SublistingDTO>();
            foreach (ISublisting sublistingModel in sublistingModels)
            {
                result.Add(new SublistingDTO()
                {

                    SalesRecord = sublistingModel.SalesRecord,
                    Status = sublistingModel.Status is not null ? sublistingModel.Status.GetType().GetMember(sublistingModel.Status.ToString()).First().GetCustomAttribute<DisplayAttribute>().Name.ToString() : null,
                    SublistingId = sublistingModel.SublistingId,
                    SublistingRef = sublistingModel.SublistingRef,
                    ListingId = sublistingModel.ListingId
                });
            }
            return result;
        }

        public static async Task<SublistingDTO> MapToSublistingDTOSingle(ISublisting sublisting)
        {
            return MapToSublistingDTO(new List<ISublisting>() { sublisting }).Result.First();
        }

        public static async Task<string> ConvertToColorway(string colors)
        {
            if (colors is null) return string.Empty;
            string finalRes = "";
            int index = colors.IndexOf("  ");
            while (index >= 0)
            {
                var selectedColor = colors.Substring(0, index);
                colors = colors.Remove(0, selectedColor.Length + 2);
                finalRes += $"{selectedColor}/";
                index = colors.IndexOf("  ");

            }
            if (string.IsNullOrEmpty(finalRes))
                return colors;
            return $"{finalRes}{colors}";
        }

        #region All Unmap functions
        //public static async Task<IListing> UnMapListingDTO(ListingDTO listingDto)
        //{
        //    return new Listing()
        //    {
        //        Id=listingDto.ListingId,
        //        Cost=(double) listingDto.Cost,
        //        DateAdded= DateTime.ParseExact(listingDto.DateAdded, "d", null),
        //        DatePurchased = DateTime.ParseExact(listingDto.DatePurchased, "d", null),
        //        Deadline = DateTime.ParseExact(listingDto.Deadline, "d", null),
        //        Notes=listingDto.Notes,
        //        Quantity=listingDto.Quantity,
        //        Size=listingDto.Size,
        //        Status=
        //    }
        //}


        //private ListingStatus GetListingStatusFromDisplayName(string displayName)
        //{
        //    foreach (Enum status in Enum.GetValues(typeof(ListingStatus)))
        //    {
        //            DisplayName = status.GetType().GetMember(status.ToString()).First().GetCustomAttribute<DisplayAttribute>().Name.ToString()
        //    }
        //}
        #endregion
    }
}
