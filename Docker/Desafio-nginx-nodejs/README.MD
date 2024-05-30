# Desafio-nginx-nodejs

Desafio de criar uma página web (Utilizando o Node.js) com o título "Full Cycle Rocks!" que liste os nomes cadastrados no banco de dados (mysql), e que utilize o nginx como proxy reverso.

Sempre que a página é recarregada, é inserido um novo nome aleatório no banco de dados.

## Execução
Suba o sistema executando o seguinte comando (Necessário possuir o docker instalado na sua máquina):

```bash
docker compose up -d
```

Em seguida, aguarde alguns segundos até que o sistema suba e acesse a página colocando o link http://localhost:8080/ no seu navegador.