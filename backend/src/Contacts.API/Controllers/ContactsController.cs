using Contacts.Application.DTOs;
using Contacts.Application.UseCases.Contacts;
using Microsoft.AspNetCore.Mvc;

namespace Contacts.API.Controllers;

[ApiController]
[Route("api/contacts")]
public class ContactsController(
    GetContactsUseCase getContacts,
    GetContactByIdUseCase getContactById,
    CreateContactUseCase createContact,
    UpdateContactUseCase updateContact,
    DeleteContactUseCase deleteContact) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await getContacts.ExecuteAsync(page, pageSize, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var contact = await getContactById.ExecuteAsync(id, cancellationToken);
        return contact is null ? NotFound() : Ok(contact);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var contact = await createContact.ExecuteAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateContactDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var contact = await updateContact.ExecuteAsync(id, dto, cancellationToken);
        return contact is null ? NotFound() : Ok(contact);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await deleteContact.ExecuteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
