using Contacts.Domain.Repositories;

namespace Contacts.Application.UseCases.Contacts;

public class DeleteContactUseCase(IContactRepository repository)
{
    public async Task<bool> ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var contact = await repository.GetByIdAsync(id, cancellationToken);
        if (contact is null) return false;

        await repository.DeleteAsync(contact, cancellationToken);
        return true;
    }
}
