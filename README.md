"# reserves-back" 
Desafio: Sistema de Reserva Simplificado
Objetivo Geral:
Criar um sistema de reserva de mesas com duas interfaces: uma para o usuário (reservas) e outra para o administrador (gerenciamento de reservas e lista de espera). As reservas seguem o modelo de assentos em um cinema, onde os usuários escolhem suas mesas a partir de uma visualização gráfica. O sistema também inclui autenticação de administrador usando JWT e a integração com o banco de dados PostgreSQL.
Funcionalidades
Tela de reserva: Usuários podem reservar mesas informando nome, telefone, número de pessoas, data e horário.
Tela de admin: Administradores podem gerenciar reservas, adicionar ou mover reservas para a lista de espera.
Escolha de mesa: As mesas disponíveis são exibidas como assentos em um cinema, e os usuários escolhem suas mesas.
Lista de espera: Quando a capacidade de reservas está cheia, os usuários podem ser colocados em uma lista de espera.
Login de admin: Autenticação JWT, autentificação, Google, meta, apple, para proteger a interface de administração.
Conexão com banco de dados via API REST.

Checkpoints em Ordem de Implementação:
1. Executar a Reserva de Forma Simples (Tela de Reserva)
Criar uma tela simples onde o usuário pode fazer uma reserva informando:
Nome
Telefone
Número de pessoas
Data e horário
As reservas são armazenadas no banco de dados via API.
Não há ainda a seleção de mesas, apenas o armazenamento básico da reserva.
Detalhes:
Front-end: React + TypeScript
Back-end: Node.js/Express ou Python/Flask
Banco de Dados: PostgreSQL
API: Criar uma rota POST /reservations para receber as reservas e salvá-las no banco.

2. Executar a Reserva com Tela Admin
Adicionar uma tela de administração para visualizar as reservas existentes.
O administrador pode:
Marcar uma reserva como confirmada (status "reserva").
Mover uma reserva para a lista de espera (status "lista de espera").
Detalhes:
Front-end Admin: Criar uma página protegida por autenticação (ex.: /admin) onde o administrador vê uma lista de reservas.
API Admin: Criar rotas para listar, atualizar e mover reservas entre estados:
GET /reservations: Para listar todas as reservas.
PUT /reservations/:id: Para atualizar o status da reserva (ex.: de lista de espera para confirmada).

3. Executar Lista de Espera
Implementar a lógica de lista de espera no back-end. Quando o número máximo de mesas for atingido, a reserva vai automaticamente para a lista de espera.
Administradores podem mover manualmente reservas da lista de espera para a confirmação de reserva, e vice-versa.
Detalhes:
Banco de Dados: Adicionar uma coluna status na tabela de reservas para indicar se a reserva está confirmada ou na lista de espera.
API: Atualizar a lógica da rota POST /reservations para colocar reservas na lista de espera se a capacidade máxima for atingida.

4. Executar Reserva como Se Reserva Cadeira de um Cinema
Criar uma interface gráfica para os usuários escolherem suas mesas como se estivessem reservando cadeiras em um cinema.
Cada mesa deve ter um número limitado de assentos e deve ser visualmente representada como um bloco clicável na interface.
As mesas escolhidas devem ser bloqueadas em tempo real para outros usuários (uso de WebSockets ou atualizações frequentes via API).
Detalhes:
Front-end: Criar uma visualização de mesas na tela de reservas. As mesas já reservadas devem aparecer bloqueadas.
API: Criar uma rota GET /seats que retorna o estado atual de todas as mesas (reservadas ou disponíveis).
Banco de Dados: Criar uma tabela seats para armazenar a posição e estado das mesas.

5. Login Admin com JWT
Implementar um sistema de login para os administradores, utilizando autenticação JWT.
Somente administradores logados podem acessar a página /admin.
Detalhes:
Front-end: Criar uma tela de login para o administrador e proteger a rota /admin.
API: Criar uma rota POST /login que autentica o administrador e retorna um JWT.
Proteção JWT: Proteger todas as rotas administrativas com verificação do token JWT.

Extra Checkpoints (Bonus):
1. API REST Completa
Desenvolver uma API completa e documentada, seguindo as melhores práticas de RESTful.
Documentar as rotas e suas funcionalidades com ferramentas como Swagger ou Postman.
2. Designer do Front-End
Melhorar a experiência do usuário com um design moderno e responsivo.
Utilizar bibliotecas como Material UI ou Styled Components para estilizar a aplicação.
3. Clareza no Código
Manter a organização do código e seguir boas práticas de desenvolvimento (naming conventions, modularização, etc).
Incluir comentários explicativos e uma documentação breve do projeto.
4. Criptografia de Dados Sensíveis
Implementar a criptografia de dados sensíveis como senhas de administradores no banco de dados (ex.: uso de bcrypt para hashear senhas).
5. Escalabilidade
Implementar a estrutura de código e banco de dados pensando em escalabilidade, permitindo que mais mesas e reservas possam ser adicionadas no futuro sem grandes mudanças estruturais.
Considerar a utilização de cache (ex.: Redis) para otimizar o carregamento de dados de mesas.

Stack Recomendada:
Front-end: React + TypeScript
Back-end: Node.js (Express) ou Python (Flask/Django)
Banco de Dados: PostgreSQL
Autenticação: JWT para admin
Hospedagem: Render (free tier)

Entregáveis:
Código fonte do projeto no GitHub.
Instruções detalhadas de instalação e execução do projeto.
Scripts para criar e popular o banco de dados.
Testes básicos de API (opcional).
Documentação de API e da estrutura geral do sistema.
