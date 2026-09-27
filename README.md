# Catálogo de Países e Cidades

Projeto acadêmico para a disciplina de Desenvolvimento Web.

## Tecnologias
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Fetch API / AJAX

## API
CountriesNow / Countries & Cities API

Base: https://countriesnow.space/api/v0.1/countries

## Funcionalidades
- Listagem dinâmica de países
- Busca por nome
- Modal de detalhes
- Nova requisição AJAX para cidades e moeda
- Estado de carregamento
- Estado sem resultados
- Tratamento de erro com botão para tentar novamente
- Layout responsivo

## Como executar
Abra a pasta no Visual Studio Code e use a extensão Live Server.

Também é possível usar um servidor HTTP local com Python:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Modo de demonstração
Se você abrir o `index.html` diretamente por `file://`, ou acrescentar `?demo=1` ao endereço, o projeto usa dados de exemplo caso a API não esteja disponível. Isso existe apenas para facilitar a demonstração.

Na execução normal pelo Live Server, se a API falhar, o site mostra a mensagem de erro e o botão **Tentar novamente**, como solicitado na avaliação.
