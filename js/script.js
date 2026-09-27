const API = "https://countriesnow.space/api/v0.1/countries";

const listaPaises = document.getElementById("listaPaises");
const carregamento = document.getElementById("carregamento");
const erro = document.getElementById("erro");
const semResultados = document.getElementById("semResultados");
const campoBusca = document.getElementById("campoBusca");
const formBusca = document.getElementById("formBusca");
const btnLimpar = document.getElementById("btnLimpar");
const btnTentarNovamente = document.getElementById("btnTentarNovamente");
const modal = document.getElementById("modalPais");
const conteudoModal = document.getElementById("conteudoModal");
const modalBootstrap = new bootstrap.Modal(modal);

let paises = [];
let usandoFallback = false;

const dadosExemplo = [
  {
    name: "Brazil",
    iso2: "BR",
    iso3: "BRA",
    capital: "Brasília",
    currency: "BRL",
    cities: [
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Salvador",
      "Curitiba",
      "Cuiabá",
    ],
  },
  {
    name: "Argentina",
    iso2: "AR",
    iso3: "ARG",
    capital: "Buenos Aires",
    currency: "ARS",
    cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
  },
  {
    name: "Chile",
    iso2: "CL",
    iso3: "CHL",
    capital: "Santiago",
    currency: "CLP",
    cities: ["Santiago", "Valparaíso", "Concepción", "Antofagasta"],
  },
  {
    name: "Canada",
    iso2: "CA",
    iso3: "CAN",
    capital: "Ottawa",
    currency: "CAD",
    cities: ["Toronto", "Montreal", "Vancouver", "Ottawa", "Calgary"],
  },
  {
    name: "Japan",
    iso2: "JP",
    iso3: "JPN",
    capital: "Tokyo",
    currency: "JPY",
    cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
  },
  {
    name: "Italy",
    iso2: "IT",
    iso3: "ITA",
    capital: "Rome",
    currency: "EUR",
    cities: ["Rome", "Milan", "Naples", "Turin", "Florence"],
  },
  {
    name: "Germany",
    iso2: "DE",
    iso3: "DEU",
    capital: "Berlin",
    currency: "EUR",
    cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"],
  },
  {
    name: "Australia",
    iso2: "AU",
    iso3: "AUS",
    capital: "Canberra",
    currency: "AUD",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Canberra"],
  },
  {
    name: "Mexico",
    iso2: "MX",
    iso3: "MEX",
    capital: "Mexico City",
    currency: "MXN",
    cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla"],
  },
  {
    name: "France",
    iso2: "FR",
    iso3: "FRA",
    capital: "Paris",
    currency: "EUR",
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
  },
  {
    name: "Spain",
    iso2: "ES",
    iso3: "ESP",
    capital: "Madrid",
    currency: "EUR",
    cities: ["Madrid", "Barcelona", "Valencia", "Seville"],
  },
  {
    name: "South Africa",
    iso2: "ZA",
    iso3: "ZAF",
    capital: "Pretoria",
    currency: "ZAR",
    cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  },
];

async function carregarPaises() {
  listaPaises.innerHTML = "";
  erro.classList.add("d-none");
  semResultados.classList.add("d-none");
  carregamento.classList.remove("d-none");
  usandoFallback = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resposta = await fetch(`${API}/capital`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!resposta.ok) throw new Error("Erro na requisição");
    const resultado = await resposta.json();
    if (resultado.error || !Array.isArray(resultado.data))
      throw new Error("Resposta inválida");
    paises = resultado.data;
    exibirPaises(paises.slice(0, 12));
  } catch (e) {
    // Fallback apenas para demonstração ao abrir por file:// ou com ?demo=1.
    // Em execução normal via Live Server, uma falha da API exibe o estado de erro exigido no trabalho.
    const modoDemo =
      location.protocol === "file:" ||
      new URLSearchParams(location.search).get("demo") === "1";

    if (modoDemo) {
      usandoFallback = true;
      paises = dadosExemplo;
      exibirPaises(paises);
    } else {
      erro.classList.remove("d-none");
    }
  } finally {
    carregamento.classList.add("d-none");
  }
}

function exibirPaises(lista) {
  listaPaises.innerHTML = "";
  semResultados.classList.add("d-none");
  if (lista.length === 0) {
    semResultados.classList.remove("d-none");
    return;
  }

  lista.forEach((pais) => {
    const card = document.createElement("article");
    card.className = "country-card";
    card.innerHTML = `
      <div class="top">
        <div class="flag">${gerarBandeira(pais.iso2)}</div>
        <h3>${pais.name}</h3>
        <div class="iso">ID: ${pais.iso3 || "-"}</div>
        <span class="badge-custom">País</span>
      </div>
      <div class="meta">
        <strong>Resumo:</strong><br>
        $Sua capital é ${pais.capital || "não informada"}.
      </div>
      <div class="action"><button type="button">Ver detalhes</button></div>
    `;
    card
      .querySelector("button")
      .addEventListener("click", () => verDetalhes(pais.name));
    listaPaises.appendChild(card);
  });
}

function gerarBandeira(codigo) {
  if (!codigo) return "🌎";
  return codigo
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt()));
}

async function verDetalhes(nomePais) {
  const pais = paises.find((p) => p.name === nomePais);
  conteudoModal.innerHTML = `<div class="loading-inline">Carregando detalhes de <strong>${nomePais}</strong>...</div>`;
  modalBootstrap.show();

  try {
    let cidades = pais?.cities || [];
    let moeda = pais?.currency || "Não informada";

    if (!usandoFallback) {
      const [respostaCidades, respostaMoeda] = await Promise.all([
        fetch(`${API}/cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: nomePais }),
        }),
        fetch(`${API}/currency`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: nomePais }),
        }),
      ]);
      if (!respostaCidades.ok || !respostaMoeda.ok)
        throw new Error("Falha nos detalhes");
      const dadosCidades = await respostaCidades.json();
      const dadosMoeda = await respostaMoeda.json();
      cidades = dadosCidades.data || [];
      moeda = dadosMoeda.data?.currency || moeda;
    }

    conteudoModal.innerHTML = `
      <div class="modal-header-country">
        <div class="flag">${gerarBandeira(pais?.iso2)}</div>
        <div><h2 id="tituloModal">${nomePais}</h2><div class="iso">${pais?.iso3 || "-"}</div></div>
      </div>
      <div class="details-grid">
        <div class="detail"><small>Capital</small><strong>${pais?.capital || "Não informada"}</strong></div>
        <div class="detail"><small>Moeda</small><strong>${moeda}</strong></div>
        <div class="detail"><small>Código ISO2</small><strong>${pais?.iso2 || "-"}</strong></div>
        <div class="detail"><small>Cidades encontradas</small><strong>${cidades.length}</strong></div>
      </div>
      <h3>Algumas cidades</h3>
      <div class="cities">${
        cidades
          .slice(0, 15)
          .map((c) => `<span class="city">${c}</span>`)
          .join("") || "Nenhuma cidade encontrada."
      }</div>
    `;
  } catch (e) {
    conteudoModal.innerHTML = `
      <div class="state-card error mb-0">
        <strong>Não foi possível carregar os detalhes.</strong><br>
        Verifique sua conexão e tente novamente.
        <div class="mt-3">
          <button type="button" id="btnTentarDetalhes" class="btn btn-danger">Tentar novamente</button>
        </div>
      </div>`;
    document
      .getElementById("btnTentarDetalhes")
      .addEventListener("click", () => verDetalhes(nomePais));
  }
}

formBusca.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = campoBusca.value.trim().toLowerCase();
  if (!texto) return exibirPaises(paises.slice(0, 12));
  exibirPaises(paises.filter((p) => p.name.toLowerCase().includes(texto)));
});

btnLimpar.addEventListener("click", () => {
  campoBusca.value = "";
  exibirPaises(paises.slice(0, 12));
});
btnTentarNovamente.addEventListener("click", carregarPaises);

carregarPaises();
