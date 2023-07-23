# Requisitos

    1. Sistema deve ser escrito em NodeJS
    2. Deve conter testes unitários
    3. Deve conter testes de sistema
    4. Cada usuário deve conter os seguintes atributos: 
        4.1. _id
        4.2. name
        4.3. email
        4.4. password


## Contrato da API

PATH: 
- GET /users

DESCRIÇÃO: 	
- Listar todos os usuários

CENÁRIOS DE TESTE: 
1. Status Code = 200 (OK)

PATH: 
- POST /users

DESCRIÇÃO: 	
- Criar um novo usuário

CENÁRIOS DE TESTE: 
1. Status Code = 201 (Created)

PATH: 
- GET /users/:id

DESCRIÇÃO: 	
- Detalhar um usuário

CENÁRIOS DE TESTE: 
1. Status Code = 200 (OK)
2. Status Code = 404 (Not Found)

PATH: 
- PUT /users/:id

DESCRIÇÃO: 	
- Detalhar um usuário

CENÁRIOS DE TESTE: 
1. Status Code = 200 (OK)
2. Status Code = 404 (Not Found)

PATH: 
- DELETE /users/:id

DESCRIÇÃO: 	
- Detalhar um usuário

CENÁRIOS DE TESTE: 
1. Status Code = 200 (OK)
2. Status Code = 404 (Not Found)