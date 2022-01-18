using Dapper;
using InventoryManagerSystem.Helpers.ConfigureOptions;
using InventoryManagerSystem.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Repository
{
    public class ProductsRep : IProductstRep
    {
        #region all dependencies
        private readonly IDbConnection ProductDb;
        public ProductsRep(IOptions<SqlConfigureOptions>options)
        {
            ProductDb = new SqlConnection(options.Value.SqlConnectionString);
        }
        #endregion

        

        public async Task<IProduct> Get(int id)
        {
            var sql = @"select products.Id,products.Color,products.DateAdded,products.Image,products.DateModified,products.Name,products.Notes,products.RetailPrice,
                        products.SKU,products.WebCode, b.BrandId,b.Name from Products products inner join Brands b on products.Brand = b.BrandId where products.Id=@Id";
            return ProductDb.Query<Product, Brand, Product>(
                                sql,
                                (product, brand) =>
                                {
                                    product.Brand = brand;
                                    return product;
                                },
                                param: new {@id=id},
                                splitOn: "BrandId").FirstOrDefault();
        }

        public async Task<IProduct> Get(string webCode)
        {
            var sql = @"select products.Id,products.Color,products.DateAdded,products.Image,products.DateModified,products.Name,products.Notes,products.RetailPrice,
                        products.SKU,products.WebCode, b.BrandId,b.Name from Products products inner join Brands b on products.Brand = b.BrandId where products.WebCode=@webcode";
            return ProductDb.Query<Product, Brand, Product>(
                                sql,
                                (product, brand) =>
                                {
                                    product.Brand = brand;
                                    return product;
                                },
                                param: new { @webcode = webCode },
                                splitOn: "BrandId"

                            ).FirstOrDefault();
        }

        public async Task<IEnumerable<IProduct>> GetAll()
        {
            var sql = @"select products.Id,products.Color,products.DateAdded,products.Image,products.DateModified,products.Name,products.Notes,products.RetailPrice,
                        products.SKU,products.WebCode, b.BrandId,b.Name from Products products inner join Brands b on products.Brand = b.BrandId";
            return ProductDb.Query<Product, Brand, Product>(
                                sql,
                                (product, brand) =>
                                {
                                    product.Brand = brand;
                                    return product;
                                },
                                splitOn: "BrandId"

                            ).ToList();
        }

        public async Task Delete(int id)
        {
            var sqlcmd = "DELETE From Products where Id=@id";
            ProductDb.Query(sqlcmd, new { @id = id });
        }

        public Task Update(IProduct product)
        {
            throw new NotImplementedException();
        }

        public async Task<int> Insert(IProduct product)
        {
            var sqlcmd = "Insert INTO Products(Name,WebCode,SKU,Brand,Image,RetailPrice,Color,DateAdded,DateModified,Notes) OUTPUT INSERTED.Id values(@name,@webcode,@sku,@brand,@image,@price,@color,@dateAdded,@dateModified,@notes)";
            return ProductDb.Query<int>(sqlcmd, new { @name=product.Name,@webcode=product.WebCode,@price=product.RetailPrice,@sku=product.SKU,@brand=product.Brand.BrandId,@color=product.Color,@dateAdded=product.DateAdded,@dateModified=product.DateModified,@notes=product.Notes,@image=product.Image}).First();
        }

        //BRAND TABLE FUNCTIONS :

        public async Task<IBrand> GetBrand(int id)
        {
            var sqlcmd = "SELECT * FROM Brands where Id=@id";
            return ProductDb.Query<Brand>(sqlcmd, new { @id = id }).FirstOrDefault();
        }

        public async Task<IBrand> GetBrand(string name)
        {
            var sqlcmd = "SELECT * FROM Brands where Name=@name";
            return ProductDb.Query<Brand>(sqlcmd,new { @name = name }).FirstOrDefault();
        }

        public async Task<int> InsertBrand(IBrand brand)
        {

            var sqlcmd = @"Insert into Brands (Name) OUTPUT INSERTED.Id
                                Values(@name)";
            return ProductDb.Query<int>(sqlcmd, new { @name = brand.Name }).FirstOrDefault();
        }

        public async Task<IEnumerable<IBrand>> GetAllBrands()
        {
            var sqlcmd = "SELECT * FROM Brands";
            return ProductDb.Query<Brand>(sqlcmd).ToList();
        }

    }
}
