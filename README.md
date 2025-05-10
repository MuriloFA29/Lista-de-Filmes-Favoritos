# 🎬 Lista de Filmes Favoritos

Um site interativo para adicionar, visualizar, filtrar e organizar seus filmes favoritos, com informações automáticas obtidas da [OMDb API](http://www.omdbapi.com/).

## 📸 Demonstração

> ![image](https://github.com/user-attachments/assets/1909c2d1-8b7b-44ea-a3d0-d3b247209259)

---

## 🚀 Funcionalidades

- ✅ Adição de filmes com nota personalizada
- ✅ Busca automática por título usando a OMDb API
- ✅ Sugestões inteligentes conforme o usuário digita
- ✅ Exibição de informações detalhadas (ano, gênero, sinopse, direção, elenco, etc.)
- ✅ Armazenamento local (`localStorage`)
- ✅ Filtro por nome ou gênero
- ✅ Ordenação por ano ou nota
- ✅ Modo claro/escuro com salvamento de preferência
- ✅ Confirmação antes da remoção de um filme

---

## 🛠 Tecnologias Usadas

- **HTML5**
- **CSS3**
- **JavaScript**
- [OMDb API](http://www.omdbapi.com/) — Busca de dados dos filmes
- `localStorage` — Persistência de dados no navegador
- **Bootstrap Icons** — Ícones visuais no layout

---

## 🧩 Como Usar

1. Clone ou baixe este repositório:
   ```bash
   git clone https://github.com/MuriloFA29/Lista-de-Filmes-Favoritos
   ```

2. Crie uma conta gratuita na OMDb API e obtenha sua chave de API.

3. Cole sua api no config.json na raiz do projeto com este conteúdo:
```
{
  "OMDB_API_KEY": "sua_chave_api_aqui"
}
```

4. Abra o index.html no navegador.
