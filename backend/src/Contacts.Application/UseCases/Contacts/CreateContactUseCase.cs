using Contacts.Application.DTOs;
using Contacts.Domain.Entities;
using Contacts.Domain.Repositories;

namespace Contacts.Application.UseCases.Contacts;

public class CreateContactUseCase(IContactRepository repository)
{
    public async Task<ContactDto> ExecuteAsync(CreateContactDto dto, CancellationToken cancellationToken = default)
    {
        var contact = Contact.Create(dto.Name, dto.Phone);
        await repository.AddAsync(contact, cancellationToken);

        return new ContactDto(contact.Id, contact.Name, contact.Phone, contact.CreatedAt, contact.UpdatedAt);
    }
}
