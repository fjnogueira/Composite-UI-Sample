﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Castle.Windsor;
using NServiceBus;
using Castle.MicroKernel.Registration;

namespace Sales.API
{
    public class NServiceBusConfig
    {
        internal static void Configure(IWindsorContainer container)
        {
            var config = new EndpointConfiguration("Sales.API");

            config.SendOnly();

            config.UseTransport<MsmqTransport>().ConnectionString("deadLetter=false;journal=false");
            config.UseSerialization<JsonSerializer>();
            config.UsePersistence<InMemoryPersistence>();

            config.SendFailedMessagesTo("error");

            config.Conventions()
                .DefiningCommandsAs(t => t.Namespace != null && t.Namespace == "Messages" || t.Name.EndsWith("Command"))
                .DefiningEventsAs(t => t.Namespace != null && t.Namespace == "Messages" || t.Name.EndsWith("Event"));

            var endpoint = Endpoint.Start(config).GetAwaiter().GetResult();

            container.Register(Component.For<IEndpointInstance>()
                .Instance(endpoint)
                .LifestyleSingleton());
        }
    }
}