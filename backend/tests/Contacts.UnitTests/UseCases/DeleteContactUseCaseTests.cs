using Contacts.Application.UseCases.Contacts;
using Contacts.Domain.Entities;
using Contacts.Domain.Repositories;
using FluentAssertions;
using Moq;

namespace Contacts.UnitTests.UseCases;

public class DeleteContactUseCaseTests
{
    private readonly Mock<IContactRepository> _repositoryMock = new();
    private readonly DeleteContactUseCase _sut;

    public DeleteContactUseCaseTests()
    {
        _sut = new DeleteContactUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task Execute_WithExistingContact_ReturnsTrue()
    {
        var contact = Contact.Create("Jane Doe", "11988887777");
        _repositoryMock.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);
        _repositoryMock.Setup(r => r.DeleteAsync(contact, default)).Returns(Task.CompletedTask);

        var result = await _sut.ExecuteAsync(contact.Id);

        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.DeleteAsync(contact, default), Times.Once);
    }

    [Fact]
    public async Task Execute_WithNonExistingContact_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Contact?)null);

        var result = await _sut.ExecuteAsync(Guid.NewGuid());

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Contact>(), default), Times.Never);
    }
}
