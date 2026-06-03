using Contacts.Domain.Entities;

namespace Contacts.Domain.Repositories;

public interface IContactRepository
{
    Task<(IEnumerable<Contact> Items, int TotalCount)> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<Contact?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Contact> AddAsync(Contact contact, CancellationToken cancellationToken = default);
    Task<Contact> UpdateAsync(Contact contact, CancellationToken cancellationToken = default);
    Task DeleteAsync(Contact contact, CancellationToken cancellationToken = default);
}
