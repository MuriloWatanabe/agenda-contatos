using Contacts.Application.DTOs;
using Contacts.Application.UseCases.Contacts;
using Contacts.Domain.Entities;
using Contacts.Domain.Repositories;
using FluentAssertions;
using Moq;

namespace Contacts.UnitTests.UseCases;

public class UpdateContactUseCaseTests
{
    private readonly Mock<IContactRepository> _repositoryMock = new();
    private readonly UpdateContactUseCase _sut;

    public UpdateContactUseCaseTests()
    {
        _sut = new UpdateContactUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task Execute_WithExistingContact_ReturnsUpdatedContact()
    {
        var contact = Contact.Create("Old Name", "11900000000");
        var dto = new UpdateContactDto("New Name", "11911111111");

        _repositoryMock.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Contact>(), default)).ReturnsAsync(contact);

        var result = await _sut.ExecuteAsync(contact.Id, dto);

        result.Should().NotBeNull();
        result!.Name.Should().Be("New Name");
        result.Phone.Should().Be("11911111111");
    }

    [Fact]
    public async Task Execute_WithNonExistingContact_ReturnsNull()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Contact?)null);

        var result = await _sut.ExecuteAsync(Guid.NewGuid(), new UpdateContactDto("Name", "Phone"));

        result.Should().BeNull();
    }
}
