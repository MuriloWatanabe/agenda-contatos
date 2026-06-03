# Agenda de Contatos

Sistema fullstack de gerenciamento de contatos com API REST em C#/.NET 8 e interface em Next.js 14.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | C#/.NET 8, ASP.NET Core, Entity Framework Core 8 |
| Banco de dados | PostgreSQL 16 |
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Containerização | Docker, Docker Compose |
| Testes | xUnit, Moq, FluentAssertions |

---

## Como rodar com Docker (recomendado)

**Pré-requisitos:** Docker e Docker Compose instalados.

```bash
git clone <url-do-repositorio>
cd agenda-contatos
docker compose up --build
```

Aguarde os containers subirem (o banco de dados precisa estar saudável antes da API iniciar). Em seguida acesse:

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger

---

## Como rodar localmente (sem Docker)

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/)

### 1. Banco de dados

Crie um banco PostgreSQL com as credenciais:

```
Host: localhost
Port: 5432
Database: contacts_db
User: contacts_user
Password: contacts_pass
```

Ou ajuste a connection string em `backend/src/Contacts.API/appsettings.json`.

### 2. Backend

```bash
cd backend
dotnet run --project src/Contacts.API
```

A API sobe em `http://localhost:5000`. As migrations rodam automaticamente na inicialização.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface fica disponível em `http://localhost:3000`.

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/contacts?page=1&pageSize=10` | Lista contatos paginados |
| `GET` | `/api/contacts/{id}` | Busca contato por ID |
| `POST` | `/api/contacts` | Cria novo contato |
| `PUT` | `/api/contacts/{id}` | Atualiza contato |
| `DELETE` | `/api/contacts/{id}` | Remove contato |

**Exemplo de criação:**
```json
POST /api/contacts
{
  "name": "João da Silva",
  "phone": "(11) 99999-0000"
}
```

**Resposta paginada:**
```json
{
  "items": [...],
  "page": 1,
  "pageSize": 10,
  "totalCount": 42,
  "totalPages": 5
}
```

---

## Arquitetura

O backend segue **Clean Architecture** com 4 camadas:

```
Contacts.Domain         → Entidades e interfaces de repositório (sem dependências externas)
Contacts.Application    → Casos de uso, DTOs (depende só do Domain)
Contacts.Infrastructure → EF Core, repositórios, PostgreSQL (implementa interfaces do Domain)
Contacts.API            → Controllers, middleware, DI (orquestra tudo)
```

### Por que Clean Architecture?

- **Testabilidade**: casos de uso são testados sem banco real, usando mocks
- **Independência de framework**: a lógica de negócio não sabe que existe ASP.NET Core
- **Manutenibilidade**: trocar o banco de dados exige mudança só em Infrastructure

### Por que EF Core com migrations?

Evita SQL manual, garante consistência do schema entre ambientes e simplifica o setup (as migrations rodam automaticamente na startup).

### Por que Next.js App Router?

Server Components permitem melhor performance e SEO. A página principal usa Client Components apenas onde necessário (interatividade), mantendo o bundle JS mínimo.

---

## Testes

```bash
cd backend
dotnet test
```

7 testes unitários cobrindo os casos de uso principais:
- `CreateContactUseCase`: criação válida, nome vazio, telefone vazio
- `DeleteContactUseCase`: contato existente, contato inexistente
- `UpdateContactUseCase`: atualização bem-sucedida, contato inexistente

---

## Melhorias futuras

Com mais tempo, eu implementaria:

1. **Busca por nome/telefone** — filtro no endpoint GET com índice no banco
2. **Testes de integração** — usando `WebApplicationFactory` + banco PostgreSQL em memória (Testcontainers)
3. **Validações com FluentValidation** — separar as regras de validação dos use cases
4. **Cache** — Redis para cachear listagens com muitos contatos
5. **CI/CD** — GitHub Actions para rodar testes e build em cada PR
6. **Observabilidade** — OpenTelemetry + Prometheus para métricas da API
