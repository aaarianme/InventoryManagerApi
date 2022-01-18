using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers
{
    //public enum ListingStatus
    //{
    //    [Display(Name ="Ordered")]
    //    Ordered,
    //    [Display(Name = "Sent Out")]
    //    SentOut,
    //    [Display(Name = "In Stock")]
    //    InStock,
    //    [Display(Name = "Partially In Stock")]
    //    PartiallyInStock,
    //    [Display(Name = "To be Returned")]
    //    ToBeReturned,
    //    [Display(Name = "Return Pending")]
    //    ReturnPending,
    //    [Display(Name = "Returned")]
    //    Returned,
    //    [Display(Name = "CANCELED")]
    //    Canceled,
    //    [Display(Name = "SOLD")]
    //    Sold
    //}

    public enum SubListingStatus
    {
        [Display(Name = "Not Recieved")]
        NotRecieved,
        [Display(Name = "Recieved")]
        Recieved,
        [Display(Name = "Return Pending")]
        ReturnPending,
        [Display(Name = "Returned")]
        Returned,
        [Display(Name = "SOLD")]
        Sold,
        [Display(Name = "CANCELED")]
        Canceled
    }
}
