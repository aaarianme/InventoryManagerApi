using InventoryManagerSystem.Helpers.ConfigureOptions;
using InventoryManagerSystem.Helpers.ErrorHelper;
using InventoryManagerSystem.Models;
using InventoryManagerSystem.Repository;
using InventoryManagerSystem.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace InventoryManagerSystem
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            #region all app dependencies

            services.AddScoped<IListingsRep, ListingsRep>();
            services.AddScoped<IListingServices, ListingServices>();
            services.AddScoped<IProductServices, ProductServices>();
            services.AddScoped<ISublistingsServices, SublistingsServices>();
            services.AddScoped<ISalesServices, SalesServices>();



            services.AddScoped<IListing, Listing>();
            services.AddScoped<IProduct, Product>();
            services.AddScoped<ISublisting, Sublisting>();
            services.AddScoped<ISaleRecord, SaleRecord>();




            services.AddScoped<IProductstRep, ProductsRep>();
            services.AddScoped<IListingsRep, ListingsRep>();
            services.AddScoped<ISublistingsRep, SublistingsRep>();
            services.AddScoped<ISalesRep, SalesRep>();




            services.AddControllers(options =>
                    options.Filters.Add(new ServicesExceptionHandler()));

            services.Configure<SqlConfigureOptions>(Configuration.GetSection("SqlConnectionSettings"));

            #endregion



            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowAnyMethod());

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer("start");
                }
            });
        }
    }
}
