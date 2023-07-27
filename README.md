# Sistema de vendas online

Um sistema com a possibilidade de realizar pedidos com múltiplos itens, cada um deles com uma quantidade variável, calculando o frete, os impostos, aplicando um cupom de desconto e ainda interagindo com o estoque. Além disso teremos ainda fluxos de pagamento e cancelamento do pedido realizado.


### 🎲 Rodando o Projeto 
```bash
# Clone este repositório
$ git clone git@github.com:mendesrl/sistema-de-vendas-online.git

# Acesse a pasta do projeto no terminal/cmd
$ cd sistema-de-vendas-online

# Instale as dependências
$ pnpm install

# Para executar os testes
$  npx jest
```

## Testes
### Projeto - Parte 1
- [x] Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total
- [x] Deve criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido)
- [x] Não deve criar um pedido com cpf inválido (lançar algum tipo de erro)
- [x] Utilizar e refatorar o algoritmo de validação de cpf: https://github.com/rodrigobranas/cccat7_refactoring/blob/master/src/example2/cpfBefore.ts
### Projeto - Parte 2
- [x] Não deve aplicar cupom de desconto expirado
- [x] Não deve aplicar cupom inexistente
- [x] Ao fazer um pedido, a quantidade de um item não pode ser negativa
- [x] Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez
- [x] Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)
- [x] Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado
- [x] Nenhuma dimensão do item pode ser negativa
- [x] O peso do item não pode ser negativo
### Projeto - Parte 3
- [x] Deve gerar o número de série do pedido
- [x] Deve fazer um pedido, salvando no banco de dados
- [x] Deve simular o frete, retornando o frete previsto para o pedido
- [x] Deve validar o cupom de desconto, indicando em um boolean se o cupom é válido
### Projeto - Parte 4
- [x] Deve retornar um pedido com base no código (caso de uso)
- [x] Deve retornar a lista de pedidos (caso de uso)
- [x] Calcule a distância entre dois CEPs e utilize no algoritmo de cálculo do frete
- [x] Calcular frete (caso de uso)
### Projeto - Parte 5
- [x] Extraia o catalogo de itens para um bounded context
- [x] Extraia o checkout para um bounded context
- [ ] Extraia o frete para um bounded context
### Autora
---

<a href="https://larissamendes.hashnode.dev/">
 <img src="https://github.com/mendesrl.png" width="80px;" alt=""/>
 <br />
 <sub><b>Larissa Mendes</b></sub></a> <a href="https://larissamendes.hashnode.dev/">🚀</a>


Feito com ❤️ por Larissa Mendes 👋🏽 Entre em contato!

[![Linkedin Badge](https://img.shields.io/badge/-Larissa-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/larissamendesribeiro/)](https://www.linkedin.com/in/larissamendesribeiro/) 
