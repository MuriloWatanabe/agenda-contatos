using Contacts.Application.DTOs;
using Contacts.Domain.Repositories;

namespace Contacts.Application.UseCases.Contacts;

public class UpdateContactUseCase(IContactRepository repository)
{
    public async Task<ContactDto?> ExecuteAsync(Guid id, UpdateContactDto dto, CancellationToken cancellationToken = default)
    {
        var contact = await repository.GetByIdAsync(id, cancellationToken);
        if (contact is null) return null;

        contact.Update(dto.Name, dto.Phone);
        await repository.UpdateAsync(contact, cancellationToken);

        return new ContactDto(contact.Id, contact.Name, contact.Phone, contact.CreatedAt, contact.UpdatedAt);
    }
}
