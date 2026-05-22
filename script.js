let produtos = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// =========================
// CONTROLE DE PAGINAÇÃO
// =========================
let pagina = 1;

const porPagina = 50;

let listaAtual = [];

// =========================
// CARREGAR PRODUTOS DO JSON
// =========================
async function carregarProdutos() {

    try {

        const response = await fetch("./produtos.json");

        produtos = await response.json();

        listaAtual = produtos;

        pagina = 1;

        productGrid.innerHTML = "";

        renderizarProdutos();

    } catch (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );

    }

}

// =========================
// RENDERIZAR PRODUTOS
// =========================
function renderizarProdutos() {

    const inicio =
        (pagina - 1) * porPagina;

    const fim =
        inicio + porPagina;

    const itens =
        listaAtual.slice(inicio, fim);

    // remove botão antigo
    const antigoBotao =
        document.querySelector(
            ".load-more-wrapper"
        );

    if (antigoBotao) {
        antigoBotao.remove();
    }

    // produto não encontrado
    if (itens.length === 0 && pagina === 1) {

        productGrid.innerHTML = `
            <div class="not-found">
                <h2>Produto não encontrado</h2>
                <p>Tente pesquisar outro produto.</p>
            </div>
        `;

        return;
    }

    // limpa apenas na primeira página
    if (pagina === 1) {
        productGrid.innerHTML = "";
    }

    // =========================
    // RENDERIZA PRODUTOS
    // =========================

    const html = itens.map(p => {

        const nome =
            p.titulo ||
            p.nome ||
            p.title ||
            "Produto sem nome";

        const imagem =
            p.imagem ||
            p.image ||
            "";

        const preco =
            p.preco ||
            p.price ||
            "Preço indisponível";

        const link =
            p.link ||
            p.url ||
            "#";

        const nomeCurto =
            nome.length > 80
                ? nome.slice(0, 80) + "..."
                : nome;

        return `

        <div class="product-card">

            <img
                loading="lazy"
                src="${imagem}"
                alt="${nome}"
            >

            <div class="product-info">

                <h3>${nomeCurto}</h3>

                <span class="price">
                    ${preco}
                </span>

                <a
                    href="${link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="offer-btn"
                >
                    Ver Produto
                </a>

            </div>

        </div>

        `;

    }).join("");

    productGrid.innerHTML += html;

    criarBotaoCarregarMais();
}

// =========================
// BOTÃO CARREGAR MAIS
// =========================
function criarBotaoCarregarMais() {

    const totalExibidos =
        pagina * porPagina;

    // se acabou produtos
    if (totalExibidos >= listaAtual.length)
        return;

    // container
    const wrapper =
        document.createElement("div");

    wrapper.classList.add(
        "load-more-wrapper"
    );

    wrapper.style.marginTop = "30px";

    // botão
    const btn =
        document.createElement("button");

    btn.innerText = "Carregar mais";

    btn.classList.add("offer-btn");

    btn.style.background =
        "linear-gradient(180deg, #ffe24a 0%, #f7d420 100%)";

    btn.style.color = "#000";

    btn.style.border = "none";

    btn.style.borderRadius = "14px";

    btn.style.padding = "12px 26px";

    btn.style.fontWeight = "700";

    btn.style.fontSize = "15px";

    btn.style.cursor = "pointer";

    btn.style.boxShadow =
        "0 6px 18px rgba(255, 217, 0, 0.25)";

    btn.style.marginTop = "30px";

    // clique
    btn.addEventListener("click", () => {

        pagina++;

        renderizarProdutos();

    });

    wrapper.appendChild(btn);

    // adiciona abaixo da grid
    productGrid.after(wrapper);
}

// =========================
// PESQUISA
// =========================
let timeout;

function pesquisarProdutos() {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

        const termo =
            searchInput.value
                .toLowerCase()
                .trim();

        listaAtual = termo

            ? produtos.filter(p =>

                (p.titulo || p.nome || "")
                    .toLowerCase()
                    .includes(termo)

            )

            : produtos;

        pagina = 1;

        renderizarProdutos();

    }, 200);
}

// =========================
// EVENTOS
// =========================

searchInput.addEventListener(
    "input",
    pesquisarProdutos
);

searchBtn.addEventListener(
    "click",
    pesquisarProdutos
);

// pesquisar apertando enter
searchInput.addEventListener(
    "keydown",
    (e) => {

        if (e.key === "Enter") {
            pesquisarProdutos();
        }

    }
);

// =========================
// INICIAR
// =========================
carregarProdutos();