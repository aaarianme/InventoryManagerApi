using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers
{
    public static class EnumHelper
    {
        public static T ParseFromDisplayName<T>(string displayName) where T : Enum
        {
            try
            {
                T enumFromDisplayAttr = Enum.GetValues(typeof(T)).Cast<T>().Where(x => x.GetType().GetMember(x.ToString()).First().GetCustomAttribute<DisplayAttribute>().Name == displayName).Cast<T>().FirstOrDefault();
                return enumFromDisplayAttr;

            }
            catch
            {
                throw new NotSupportedException();
            }

        }
        public static bool TryParseFromDisplayName<T>(string displayName, out T result) where T : Enum
        {
            try
            {
                var res = ParseFromDisplayName<T>(displayName);
                result = res;
                return true;

            }
            catch
            {
                result = default(T);
                return false;
            }

        }
    }
}
