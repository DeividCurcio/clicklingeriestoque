const form = document.getElementById('formProduto');
const tbody = document.getElementById('tbodyEstoque');
const buscaInput = document.getElementById('busca');

let estoque = JSON.parse(localStorage.getItem('estoqueClickLingerie')) || [];

function salvarEstoque() {
  localStorage.setItem('estoqueClickLingerie', JSON.stringify(estoque));
}

function renderizarTabela(filtro = '') {
  tbody.innerHTML = '';

  const filtrados = estoque.filter(item => 
    item.produto.toLowerCase().includes(filtro.toLowerCase())
  );

  filtrados.forEach((item, index) => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${item.data}</td>
      <td>${item.produto}</td>
      <td>${item.quantidade}</td>
      <td>${item.tamanhos.join(' - ')}</td>
      <td>
        <button class="btn-excluir" onclick="excluirItem(${index})">Excluir</button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

function excluirItem(index) {
  if (confirm("Deseja realmente excluir este produto?")) {
    estoque.splice(index, 1);
    salvarEstoque();
    renderizarTabela(buscaInput.value);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  
  const data = document.getElementById('dataEntrada').value;
  const produto = document.getElementById('nomeProduto').value.trim();
  const quantidade = Number(document.getElementById('quantidade').value);
  
  const tamanhosSelecionados = Array.from(
    document.querySelectorAll('input[name="tamanho"]:checked')
  ).map(cb => cb.value);

  if (!produto || !data || quantidade < 1 || tamanhosSelecionados.length === 0) {
    alert('Preencha todos os campos obrigatórios e selecione pelo menos um tamanho!');
    return;
  }

  estoque.push({
    data,
    produto,
    quantidade,
    tamanhos: tamanhosSelecionados
  });

  salvarEstoque();
  renderizarTabela();
  form.reset();
});

buscaInput.addEventListener('input', () => {
  renderizarTabela(buscaInput.value);
});

// Carregar ao abrir a página
renderizarTabela();