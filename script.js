let filmes = [];

let debounceTimer;
let ordemAnoAsc = true;
let ordemNotaAsc = true;

const form = document.getElementById('form-filme');
const nomeInput = document.getElementById('nome');
const notaInput = document.getElementById('nota');
const sugestoesDiv = document.getElementById('sugestoes');

const toggleBtn = document.getElementById('toggle-theme');

toggleBtn.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    // Armazemar preferências
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Aplicar preferência
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const filmesSalvos = JSON.parse(localStorage.getItem('filmes'));
    if (filmesSalvos) {
        filmes = filmesSalvos;
        renderizarFilmes();
    }
});

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const nota = parseFloat(notaInput.value);

    if (!nome || isNaN(nota) || nota < 0 || nota > 10) {
        alert("Preencha corretamente os campos.");
        return;
    }

    const config = await fetch('config.json').then(res => res.json());
    const apiKey = config.OMDB_API_KEY;

    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(nome)}&apikey=${apiKey}`);
    const data = await response.json();

    // console.log(data); // Ajuda a ver se o filme veio mesmo

    if (data.Response === 'False') {
        alert("Filme não encontrado. Verifique se o nome está correto e em inglês.");
        return;
    }

    const filme = {
        nome: data.Title,
        nota: nota,
        ano: data.Year,
        genero: data.Genre,
        imagem: data.Poster !== "N/A" ? data.Poster : "default.jpg",
        diretor: data.Director || 'Desconhecido',
        atores: data.Actors || 'Desconhecido',
        duracao: data.Runtime || 'Desconhecido',
        sinopse: data.Plot || 'Sinopse não disponível.',
        idioma: data.Language || 'Desconhecido',
        pais: data.Country || 'Desconhecido',
        premios: data.Awards || 'Nenhum',
        imdbNota: data.imdbRating || 'N/A',
        estudio: data.Production || 'Desconhecido',
        bilheteria: data.BoxOffice || 'N/A'
    };

    filmes.push(filme);
    localStorage.setItem('filmes', JSON.stringify(filmes));
    form.reset();
    renderizarFilmes();
})

function renderizarFilmes(lista = filmes) {
    const filmesContainer = document.getElementById('filmeContainer');

    // Remove filmes fora da busca -- com fade-out
    const filmesAtuais = Array.from(filmesContainer.children);
    filmesAtuais.forEach(filme => {
        filme.classList.remove('mostrar');
        filme.classList.add('ocultar');
    });

    setTimeout(() => {
        filmesContainer.innerHTML = ''; // Limpa o contêiner

        const mensagemVazio = document.getElementById('mensagem-vazio');
        if (lista.length === 0) {
            mensagemVazio.classList.remove('oculto');
        } else {
            mensagemVazio.classList.add('oculto');
        }

        lista.forEach(filme => {
            const filmeDiv = document.createElement('div');
            filmeDiv.classList.add('filme');

            filmeDiv.innerHTML = `
                <img src="${filme.imagem}" alt="Poster de ${filme.nome}">
                <h3>${filme.nome}</h3>
                <p>Ano: ${filme.ano}</p>
                <p>Gênero: ${filme.genero}</p>
                <p>${gerarEstrelas(filme.nota)} <span class="nota-numero">${filme.nota}</span></p>
            `;


            const removerBtn = document.createElement('button');
            removerBtn.innerHTML = '<i class="bi bi-trash"></i> Remover';
            removerBtn.classList.add('remover');
            removerBtn.onclick = () => removerFilmeConfirmacao(filme.nome);

            filmeDiv.appendChild(removerBtn);
            filmesContainer.appendChild(filmeDiv);

            // complemento

            const maisInfoBtn = document.createElement('button');
            maisInfoBtn.innerHTML = '<i class="bi bi-info-circle"></i>'
            maisInfoBtn.classList.add('mais-info');
            maisInfoBtn.title = 'Mais informações';

            const infoExtra = document.createElement('div');
            infoExtra.classList.add('info-extra');
            infoExtra.innerHTML = `
                <p><strong>Diretor:</strong> ${filme.diretor}</p>
                <p><strong>Atores:</strong> ${filme.atores}</p>
                <p><strong>Duração:</strong> ${filme.duracao}</p>
                <p><strong>Idioma:</strong> ${filme.idioma}</p>
                <p><strong>País:</strong> ${filme.pais}</p>
                <p><strong>Prêmios:</strong> ${filme.premios}</p>
                <p><strong>Estúdio:</strong> ${filme.estudio}</p>
                <p><strong>Bilheteria:</strong> ${filme.bilheteria}</p>
                <p><strong>Nota IMDb:</strong> ${filme.imdbNota}</p>
                <p><strong>Sinopse:</strong> ${filme.sinopse}</p>
            `;
            infoExtra.style.display = 'none';

            maisInfoBtn.onclick = () => {
                infoExtra.style.display = infoExtra.style.display === 'none' ? 'block' : 'none';
            };

            filmeDiv.appendChild(maisInfoBtn);
            filmeDiv.appendChild(infoExtra);

            // FADE-IN
            requestAnimationFrame(() => {
                filmeDiv.classList.add('mostrar');
            });
        });
    }, 50);
}

function removerFilme(nome) {
    filmes = filmes.filter(filme => filme.nome !== nome); // Filtra os filmes
    renderizarFilmes(); // Re=renderiza a lista
};

nomeInput.addEventListener('input', async () => {
    const termo = nomeInput.value.trim();

    if (termo.length < 3) {
        sugestoesDiv.innerHTML = '';
        return;
    }

    const resultados = await buscarSugestoes(termo);
    mostrarSugestoes(resultados);
});

async function buscarSugestoes(nome) {
    const config = await fetch('config.json').then(res => res.json());
    const apiKey = config.OMDB_API_KEY;

    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(nome)}&type=movie&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'False') {
        return;
    }

    return data.Search.slice(0, 5); // mostra até 5 sugestões
}

function mostrarSugestoes(filmes) {
    sugestoesDiv.innerHTML = '';

    filmes.forEach(filme => {
        const item = document.createElement('div');
        item.classList.add('sugestao');
        item.textContent = `${filme.Title} (${filme.Year})`;

        item.addEventListener('mousedown', async (e) => {
            e.preventDefault();

            nomeInput.value = filme.Title;
            sugestoesDiv.innerHTML = '';

            // Buscar dados detalhados com o imdbID e salvar
            const config = await fetch('config.json').then(res => res.json());
            const apiKey = config.OMDB_API_KEY;

            const res = await fetch(`https://www.omdbapi.com/?i=${filme.imdbID}&apikey=${apiKey}`);
            const data = await res.json();

            if (data.Response === 'False') {
                alert("Erro ao buscar dados do filme.");
                return;
            }

            const nota = parseFloat(notaInput.value);

            const filmeCompleto = {
                nome: data.Title,
                nota,
                ano: data.Year,
                genero: data.Genre,
                imagem: data.Poster !== "N/A" ? data.Poster : "default.jpg"
            };

            filmes.push(filmeCompleto);
            localStorage.setItem('filmes', JSON.stringify(filmes));
            renderizarFilmes();
        });

        sugestoesDiv.appendChild(item);
    });
}

const buscaInput = document.getElementById('busca');

document.getElementById('busca').addEventListener('input', (e) => {
    clearTimeout(debounceTimer); // Limpa o anterior

    debounceTimer = setTimeout(() => {
        const termo = buscaInput.value.trim().toLowerCase();

        const filmeFiltrados = filmes.filter(filme =>
            filme.nome.toLowerCase().includes(termo) ||
            filme.genero.toLowerCase().includes(termo)
        );

        renderizarFilmes(filmeFiltrados); // Renderiza apenas os filtrados 
    }, 200); // Espera 200ms após último caractere digitado
});

const btnAno = document.getElementById('ordenar-ano');

btnAno.addEventListener('click', () => {
    const ordenados = [...filmes].sort((a, b) => {
        const anoA = parseInt(a.ano);
        const anoB = parseInt(b.ano);
        return ordemAnoAsc ? anoA - anoB : anoB - anoA;
    });
    ordemAnoAsc = !ordemAnoAsc;
    btnAno.textContent = `Ordenar por Ano ${ordemAnoAsc ? '⬇️' : '⬆️'}`;
    renderizarFilmes(ordenados);
});

const btnNota = document.getElementById('ordenar-nota')

btnNota.addEventListener('click', () => {
    const ordenados = [...filmes].sort((a, b) => {
        return ordemNotaAsc ? a.nota - b.nota : b.nota - a.nota;
    });
    ordemNotaAsc = !ordemNotaAsc;
    btnNota.textContent = `Ordenar por Nota ${ordemNotaAsc ? '⬇️' : '⬆️'}`;
    renderizarFilmes(ordenados);
});

function gerarEstrelas(nota) {
    const estrelas = [];

    if (nota === 10) {
        estrelas.push('<i class="bi bi-star-fill"></i>');
    } else if (nota > 0 && nota < 10) {
        estrelas.push('<i class="bi bi-star-half"></i>');
    } else {
        estrelas.push('<i class="bi bi-star"></i>');
    }

    return estrelas.join('');
}

let nomeParaRemover = null;

function removerFilmeConfirmacao(nome) {
    nomeParaRemover = nome;
    document.getElementById('alerta-confirmacao').classList.remove('oculto');
    document.getElementById('alerta-confirmacao').classList.add('visivel');
}

document.getElementById('confirmar-remocao').onclick = () => {
    removerFilme(nomeParaRemover);
    document.getElementById('alerta-confirmacao').classList.add('oculto');
    document.getElementById('alerta-confirmacao').classList.remove('visivel');
};

document.getElementById('cancelar-remocao').onclick = () => {
    nomeParaRemover = null;
    document.getElementById('alerta-confirmacao').classList.add('oculto');
    document.getElementById('alerta-confirmacao').classList.remove('visivel');
};


