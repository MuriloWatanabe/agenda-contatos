using Contacts.Domain.Entities;
using Contacts.Domain.Repositories;
using Contacts.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Infrastructure.Repositories;

public class ContactRepository(AppDbContext context) : IContactRepository
{
    public async Task<(IEnumerable<Contact> Items, int TotalCount)> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = context.Contacts.OrderBy(c => c.Name).AsNoTracking();

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Contact?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await context.Contacts.FindAsync([id], cancellationToken);

    public async Task<Contact> AddAsync(Contact contact, CancellationToken cancellationToken = default)
    {
        context.Contacts.Add(contact);
        await context.SaveChangesAsync(cancellationToken);
        return contact;
    }

    public async Task<Contact> UpdateAsync(Contact contact, CancellationToken cancellationToken = default)
    {
        context.Contacts.Update(contact);
        await context.SaveChangesAsync(cancellationToken);
        return contact;
    }

    public async Task DeleteAsync(Contact contact, CancellationToken cancellationToken = default)
    {
        context.Contacts.Remove(contact);
        await context.SaveChangesAsync(cancellationToken);
    }
}
