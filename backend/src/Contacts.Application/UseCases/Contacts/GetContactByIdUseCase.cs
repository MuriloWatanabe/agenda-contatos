using Contacts.Application.DTOs;
using Contacts.Domain.Repositories;

namespace Contacts.Application.UseCases.Contacts;

public class GetContactByIdUseCase(IContactRepository repository)
{
    public async Task<ContactDto?> ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var contact = await repository.GetByIdAsync(id, cancellationToken);
        if (contact is null) return null;

        return new ContactDto(contact.Id, contact.Name, contact.Phone, contact.CreatedAt, contact.UpdatedAt);
    }
}
