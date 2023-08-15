
# Documentação da API Labook-backend

A API Labook-backend oferece recursos para gerenciar usuários e postagens de usuários. A documentação inclui endpoints para realizar operações como signups, logins, criar, obter e excluir registros, além de contar com a opção dos usuários darem likes e dislikes nas postagens.

## Documentação

[Documentação](https://documenter.getpostman.com/view/27685885/2s9Xy6ppo8)


# POST Signup

```http
  POST /users/signup
```

### Criar um usuário

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Nome do usuário. |
| `email` | `string` | **Obrigatório**. E-mail do usuário |
| `password` | `string` | **Obrigatório**. Senha do usuário |

## Body:
```json
{
    "name": "José",
    "email": "jose@gmail.com",
    "password": "Jose1234"
}
```

## Exemplo de resposta:
```json
{
    "messege": "Cadastro realizado com sucesso!",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWE1OTU0LTVmNTQtNDhhMy05M2Q4LWI3NzJmNGUwNjRkNSIsIm5hbWUiOiJKb3PDqSIsInJvbGUiOiJOT1JNQUwiLCJpYXQiOjE2OTIxMDM5NDgsImV4cCI6MTY5MjcwODc0OH0.qtJdwHeHVAZSuWMCqjlZ1VRoLk-QGdSk6TDVleQOw4k"
    }
}
```

# POST Login

```http
  POST /users/login
```

### Logar um usuário

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário. 
| `password` | `string` | **Obrigatório**. Senha do usuário |

## Body:
```json
{
    "email": "jose@gmail.com",
    "password": "Jose1234"
}
```

## Exemplo de resposta:
```json
{
    "messege": "Login realizado com sucesso!",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWE1OTU0LTVmNTQtNDhhMy05M2Q4LWI3NzJmNGUwNjRkNSIsIm5hbWUiOiJKb3PDqSIsInJvbGUiOiJOT1JNQUwiLCJpYXQiOjE2OTIxMDQwMDQsImV4cCI6MTY5MjcwODgwNH0.3fum0Z5LgZ9y7yTi4UNgmJS34m5tfhQBv7uxKUUcCgs"
    }
}
```

# POST CreatePost

```http
  POST /posts/
```

### Parâmetros de consulta:

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization`      | `key` | **Obrigatório**. A autorização do usuário será gerada no signup ou login |

## Body:
```json
{
    "content": "Ouvindo música"
}
```

## Exemplo de resposta:
```json
{
    "message": "Postagem realizada com sucesso!"
}
```

# GET Posts

```http
  GET /posts/
```

### Parâmetros de caminho:

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorizaçãodo usuário |

## Exemplo de resposta:
```json
[
    {
        "id": "76e20248-44ae-47d9-821c-24e5f2fa55b7",
        "content": "HOJE É FESTA LÁ NO MEU APÉ",
        "likes": 1,
        "dislikes": 1,
        "createdAt": "2023-08-08T18:24:10.511Z",
        "updatedAt": "2023-08-08T18:24:10.511Z",
        "creator": {
            "id": "9a08601e-c77b-4463-bffc-e9f29bba564f",
            "name": "Micaeli"
        }
    },
    {
        "id": "c52eb64e-89cb-463c-bdf1-d947d703dd33",
        "content": "Ouvindo música",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-15T12:54:39.485Z",
        "updatedAt": "2023-08-15T12:54:39.485Z",
        "creator": {
            "id": "64ea5954-5f54-48a3-93d8-b772f4e064d5",
            "name": "José"
        }
    }
]
```

# PUT Edit Post
```http
  PUT /posts/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id da postagem que será editada |

## Body:

```json
{
    "content": "VAMOS SEXTAR!! QUAL A BOA DE HOJE?"
}
```

### Exemplo de resposta:

```json
{
    "message": "Postagem editada com sucesso!"
}

```

# DELETE Delete Post
```http
   DELETE /posts/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id da postagem que será deletada |

### Exemplo de resposta:

```json
{
    "messege": "Postagem deletada com sucesso!"
}
```

# PUT LikeOrDislike
```http
  POST /posts/:id/like
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Authorization` | `key` | **Obrigatório**. A autorização do usuário |
| `id` | `Path Variables` | **Obrigatório**. O Id da postagem que receberá o like ou o dislike |

## Body:
Para dar like:
```json
{
    "like": true
}
```

para tirar o like:
```json
{
    "like": false
}
```
