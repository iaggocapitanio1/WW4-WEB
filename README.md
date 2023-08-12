
# Wood Work 4.0

Objetivos

O projeto WW4.0 compreende o desenvolvimento de uma solução tecnológica
que permita rastrear, em tempo real e de forma facilitada, os diversos produtos
e matérias-primas existentes no chão de fábrica, utilizando, para isso, conceitos
de IoT, de análise avançada de dados e de ciências de computação.
# 
Atividades

- Requisitos funcionais e técnicos
- Plataforma de agregação e apresentação de informação
- Produto inteligente
- Rastreamento em tempo real de componentes de mobiliário
- Implementação, testes e validação da solução
- Disseminação, comunicação e exploração de resultados
- Gestão técnica do projeto
# 
Resultados esperados/atingidos
Com o projeto ww4.0, pretende-se dotar o mercado de soluções de
monitorização, em tempo real e online, do estado da encomenda.


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`NEXT_PUBLIC_FRONT_API_URL` http://193.136.195.25/ww4

`NEXT_PUBLIC_CLIENT_ID` rL8g3uUXRKRbmIdzGjSkdEZPLqyXKHDFl1hkyD65

`NEXT_PUBLIC_CLIENT_SECRET` RNWwLruu04dERd4PB0JJtudAAsTHWcjGDTLofsa2Pr1LZU2diFmyBDIZaIwXaWNZeZB1lDsvyvmKl1hV42s6utb8DZpFgXrTWV2LZ6MzZYxhBtTeoIjTrFoe3hk6spd

## Instalação

Instale com yarn

```bash
  yarn
```
  
Para correr o website, corra
```bash
  yarn dev
```

O projeto ficará disponivel em [http://localhost:3000](http://localhost:3000) no browser.

## Stack utilizada

**Front-end:** Next.js, React, Redux, Material Ui, Docker



## Funcionalidades

- Variados Temas 
- Preview em tempo real
- Modo tela cheia
- Multiplataforma
- Responsivo


## Páginas

- Páginas Publicas
    - **Login portal Cliente**: '/'
    - **Esqueci Senha**: '/forgot-password'
    - **Redefinição Senha**: '/reset-password'
    - **Login portal Interno**: '/signin'


- Páginas Portal Cliente
    - **Termos de serviço**: '/terms'
    - **Privacidade**: '/privacy'
    - **Aceitação de Termos de serviço**: '/tos'
    - **Projetos**: '/projects'
    - **Projeto**: '/project/'
    - **Orçamento**: '/budget/'
    - **Conta**: '/account'
    - **Mensagens**: '/messages'

- Páginas Portal Interno
    - **Clientes**: '/internal/clients'
    - **Cliente**: '/internal/client/'
    - **Editar Cliente**: '/internal/edit-client/'
    - **Novo Cliente**: '/internal/new-client'
    - **Utilizadores**: '/internal/workers'
    - **Utilizador**: '/internal/worker/'
    - **Novo Utilizador**: '/internal/new-worker'
    - **Editar Utilizador**: '/internal/edit-worker/'
    - **Stocks**: '/internal/stocks'
    - **Stock**: '/internal/stock/'
    - **Editar Stock**: '/internal/edit-stock/'
    - **Novo Stock**: '/internal/new-stock'
    - **Projetos** Similares: '/internal/projects-similar'
    - **Projetos**: '/internal/projects'
    - **Projeto**: '/internal/project/'
    - **Orçamento**: '/internal/budget/'
    - **Editar Orçamento**: '/internal/edit-budget/'
    - **Novo Projeto**: '/internal/new-project'
    - **Conta**: '/internal/account'
    - **Embalamentos**: '/internal/packing'
    - **Embalamento** de Projeto: '/internal/project-packages/'
    - **Novo Embalamento**: '/internal/new-package/'
    - **Novo Sobrante**: '/internal/new-leftover'
    - **Chão de Fábrica** Produção: '/internal/factory'
    - **Chão de Fábrica**: '/internal/factory-ground/'
    - **Montagens**: '/internal/assemblys'
    - **Perfis**: '/internal/profiles'
    - **Perfil**: '/internal/profile/'
    - **Editar Perfil**: '/internal/edit-profile/'
    - **Novo Perfil**: '/internal/new-profile'
    - **Máquinas**: '/internal/machines'
    - **Máquina**: '/internal/machine/'
    - **Nova Máquina**: '/internal/new-machine'
    - **Editar Máquina**: '/internal/edit-machine/'