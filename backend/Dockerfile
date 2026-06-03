FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY Contacts.sln .
COPY src/Contacts.Domain/Contacts.Domain.csproj src/Contacts.Domain/
COPY src/Contacts.Application/Contacts.Application.csproj src/Contacts.Application/
COPY src/Contacts.Infrastructure/Contacts.Infrastructure.csproj src/Contacts.Infrastructure/
COPY src/Contacts.API/Contacts.API.csproj src/Contacts.API/
COPY tests/Contacts.UnitTests/Contacts.UnitTests.csproj tests/Contacts.UnitTests/

RUN dotnet restore

COPY . .

RUN dotnet publish src/Contacts.API/Contacts.API.csproj -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "Contacts.API.dll"]
