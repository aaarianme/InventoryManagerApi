﻿using InventoryManagerSystem.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Models
{
    public interface ISublisting
    {
        public int? SublistingId { get; set; }
        public int ListingId { get; set; }
        public string SublistingRef { get; set; }
        public SubListingStatus? Status { get; set; }
        public int? SalesRecord { get; set; }

        /// <summary>
        /// This Method is shared between ISublisting,Sublisting and SublistingDTO. A SublistingRef is like the following #-S# . This returns the number after S, stating what number of internal sublisting it is.
        /// </summary>
        /// <returns>an int, if This.SubListing is null or empty it return null</returns>
        public int? GetInternalListingCode();
       



    }
}