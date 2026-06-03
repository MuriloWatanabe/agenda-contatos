using Contacts.Application.UseCases.Contacts;
using Microsoft.Extensions.DependencyInjection;

namespace Contacts.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetContactsUseCase>();
        services.AddScoped<GetContactByIdUseCase>();
        services.AddScoped<CreateContactUseCase>();
        services.AddScoped<UpdateContactUseCase>();
        services.AddScoped<DeleteContactUseCase>();

        return services;
    }
}
