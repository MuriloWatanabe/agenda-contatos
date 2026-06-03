using Contacts.Application.DTOs;
using Contacts.Application.UseCases.Contacts;
using Contacts.Domain.Entities;
using Contacts.Domain.Repositories;
using FluentAssertions;
using Moq;

namespace Contacts.UnitTests.UseCases;

public class CreateContactUseCaseTests
{
    private readonly Mock<IContactRepository> _repositoryMock = new();
    private readonly CreateContactUseCase _sut;

    public CreateContactUseCaseTests()
    {
        _sut = new CreateContactUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task Execute_WithValidData_ReturnsCreatedContact()
    {
        var dto = new CreateContactDto("John Doe", "+55 11 99999-0000");

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Contact>(), default))
            .ReturnsAsync((Contact c, CancellationToken _) => c);

        var result = await _sut.ExecuteAsync(dto);

        result.Should().NotBeNull();
        result.Name.Should().Be("John Doe");
        result.Phone.Should().Be("+55 11 99999-0000");
        result.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Execute_WithEmptyName_ThrowsArgumentException()
    {
        var dto = new CreateContactDto("", "+55 11 99999-0000");

        await _sut.Invoking(s => s.ExecuteAsync(dto))
            .Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task Execute_WithEmptyPhone_ThrowsArgumentException()
    {
        var dto = new CreateContactDto("John Doe", "");

        await _sut.Invoking(s => s.ExecuteAsync(dto))
            .Should().ThrowAsync<ArgumentException>();
    }
}
