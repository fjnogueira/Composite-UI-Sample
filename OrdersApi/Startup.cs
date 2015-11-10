﻿using System;
using System.Linq;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Routing;
using Microsoft.Framework.DependencyInjection;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json.Serialization;
using Microsoft.Framework.Runtime;

namespace OrdersApi
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
        }

        // This method gets called by a runtime.
        // Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().Configure<MvcOptions>( options =>
			{
				options.OutputFormatters
					.OfType<JsonOutputFormatter>()
					.First()
					.SerializerSettings
					.ContractResolver = new CamelCasePropertyNamesContractResolver();
			} );

			services.AddSingleton(typeof(Shared.DataManager), c =>
			{
				var env = (IApplicationEnvironment)c.GetService(typeof(IApplicationEnvironment));
				return new Shared.DataManager(env.ApplicationBasePath);
			});
		}

        // Configure is called after ConfigureServices is called.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
			app.Use( async ( context, next ) =>
			{
				context.Response.Headers.Append( "Access-Control-Allow-Origin", "*" );
				context.Response.Headers.Add( "Access-Control-Allow-Headers", new[ ] { "Content-Type, x-xsrf-token" } );
				await next();
			} );

			app.UseStaticFiles();
            // Add MVC to the request pipeline.
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
