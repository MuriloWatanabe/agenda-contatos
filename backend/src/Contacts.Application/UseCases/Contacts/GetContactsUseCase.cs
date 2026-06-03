using Contacts.Application.DTOs;
using Contacts.Domain.Repositories;

namespace Contacts.Application.UseCases.Contacts;

public class GetContactsUseCase(IContactRepository repository)
{
    public async Task<PagedResultDto<ContactDto>> ExecuteAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        var (items, totalCount) = await repository.GetAllAsync(page, pageSize, cancellationToken);

        var dtos = items.Select(c => new ContactDto(c.Id, c.Name, c.Phone, c.CreatedAt, c.UpdatedAt));
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResultDto<ContactDto>(dtos, page, pageSize, totalCount, totalPages);
    }
}
