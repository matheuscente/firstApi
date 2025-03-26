# Detalhamento

Uma empresa XPTO, está precisando de uma solução para auxiliar no controle de estoque.

Em conversas com o cliente, foi possivel entender que eles possuem vários estoques separados pelo Brasil.

Que necessitam de um controle de entrada e saida deste produtos, registrando a quantidade desta movimentação.

Todos os estoques fazem uso dos mesmos tipos de produtos.

Este cliente quer um desconto no desenvolvimento e para obtê-lo, abriu mão da fidelidade, ou seja, este SaaS será vendido também para outras organizações que necessitam de um controle de estoque.

## 1. **Classe `Organizacao`**
   - **Descrição**: Representa uma organização que possui estoques, usuários e produtos.
   - **Atributos**:
     - `id`: Identificador único da organização.
     - `nome`: Nome da organização.
     - `endereco`: Endereço da organização.
     - `telefone`: Telefone de contato da organização.
     - `email`: Email de contato.
     - `estoques`: Lista de estoques associados à organização.
     - `usuarios`: Lista de usuários associados à organização.
     - `produtos`: Lista de produtos cadastrados pela organização.
   - **Métodos**:
     - `adicionarEstoque(estoque: Estoque)`: Adiciona um novo estoque à organização.
     - `adicionarUsuario(usuario: Usuario)`: Adiciona um novo usuário à organização.
     - `adicionarProduto(produto: Produto)`: Adiciona um novo produto ao catálogo da organização.

## 2. **Classe `Estoque`**
   - **Descrição**: Representa um estoque específico dentro de uma organização.
   - **Atributos**:
     - `id`: Identificador único do estoque.
     - `nome`: Nome do estoque.
     - `itens`: Lista de itens (produtos com quantidade) armazenados no estoque.
     - `organizacaoId`: Referência à organização proprietária do estoque.
   - **Métodos**:
     - `adicionarItem(produto: Produto, quantidade: number)`: Adiciona um novo item (produto) ao estoque.
     - `removerItem(produto: Produto, quantidade: number)`: Remove um item (produto) do estoque.
     - `consultarItem(produto: Produto)`: Retorna a quantidade disponível de um produto no estoque.
  
## 3. **Classe `Usuario`**
   - **Descrição**: Representa um usuário que pertence a uma organização e pode movimentar estoques.
   - **Atributos**:
     - `id`: Identificador único do usuário.
     - `nome`: Nome do usuário.
     - `email`: Email do usuário.
     - `senha`: Senha de acesso.
     - `organizacaoId`: Referência à organização à qual o usuário pertence.
     - `role`: Definição do papel do usuário (ex.: administrador, operador de estoque).
   - **Métodos**:
     - `movimentarEstoque(estoque: Estoque, produto: Produto, quantidade: number, tipoMovimentacao: string)`: Movimenta o estoque, adicionando ou removendo itens.
     - `visualizarEstoque(estoque: Estoque)`: Permite que o usuário visualize os itens disponíveis em um estoque.

## 4. **Classe `Produto`**
   - **Descrição**: Representa um produto que pode ser armazenado e movimentado nos estoques.
   - **Atributos**:
     - `id`: Identificador único do produto.
     - `nome`: Nome do produto.
     - `descricao`: Descrição do produto.
     - `organizacaoId`: Referência à organização que cadastrou o produto.
   - **Métodos**:
     - `atualizarInformacoes(nome: string, descricao: string)`: Atualiza as informações do produto.

## 5. **Classe `MovimentacaoEstoque`**
   - **Descrição**: Representa uma movimentação de estoque, seja de entrada ou saída de produtos.
   - **Atributos**:
     - `id`: Identificador único da movimentação.
     - `usuarioId`: Referência ao usuário que realizou a movimentação.
     - `estoqueId`: Referência ao estoque onde a movimentação foi realizada.
     - `produtoId`: Referência ao produto que foi movimentado.
     - `quantidade`: Quantidade de itens movimentados.
     - `tipo`: Tipo da movimentação (entrada ou saída).
     - `data`: Data e hora da movimentação.
   - **Métodos**:
     - `registrarMovimentacao()`: Registra a movimentação no sistema.

## Considerações Adicionais
- A criação de uma organização deverá criar automaticamente o usuário com role de administrador da organização;
- Somente usuário com role de administrador poderá alterar/deletar a organização;
- Somente usuário com role de administrador poderá criar/alterar/deletar outros usuários para a organização;
- Cada usuário só pode acessar e movimentar o estoque da sua própria organização;
