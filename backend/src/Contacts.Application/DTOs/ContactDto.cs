namespace Contacts.Application.DTOs;

public record ContactDto(Guid Id, string Name, string Phone, DateTime CreatedAt, DateTime UpdatedAt);

public record CreateContactDto(string Name, string Phone);

public record UpdateContactDto(string Name, string Phone);

public record PagedResultDto<T>(IEnumerable<T> Items, int Page, int PageSize, int TotalCount, int TotalPages);
