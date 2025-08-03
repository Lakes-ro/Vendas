const supabaseUrl = 'https://lbjsdaexqhkgxsuwfgmg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // sua key completa
const supabase = supabase || createClient(supabaseUrl, supabaseKey);

var listaNomes = [];

function btnCadastrar() {
    var nome = $("#nome").val();
    var quarto = $("#quarto").val();

    if (!validarFormulario(nome, quarto)) {
        alert("Preencha todos os campos");
        return;
    }

    let produtosSelecionados = coletarProdutos();

    if (produtosSelecionados.length === 0) {
        alert("Selecione ao menos um produto");
        return;
    }

    let pessoaObjeto = { nome, quarto, produtos: produtosSelecionados };
    listaNomes.push(pessoaObjeto);

    AdicionarNomesElementoHtml(pessoaObjeto);
    atualizarTotal();
}

function coletarProdutos() {
    let produtos = [];

    // Danix
    let saborDanix = $("#danix select").eq(0).find(":selected").text();
    let qtdDanix = parseInt($("#danix select").eq(1).val());
    if (qtdDanix > 0) {
        saborDanix = (saborDanix === "Escolha o sabor") ? "sabor aleatório" : saborDanix;
        produtos.push({ nome: "Danix", sabor: saborDanix, quantidade: qtdDanix, preco: calcularPreco(qtdDanix) });
    }

    // Guaravita
    let qtdGuara = parseInt($("#guaravita select").val());
    if (qtdGuara > 0) {
        produtos.push({ nome: "Guaravita", sabor: "-", quantidade: qtdGuara, preco: calcularPreco(qtdGuara) });
    }

    // Bis Xtra
    let qtdBis = parseInt($("#bis select").val());
    if (qtdBis > 0) {
        produtos.push({ nome: "Bis Xtra", sabor: "-", quantidade: qtdBis, preco: calcularPreco(qtdBis) });
    }

    // Suco Gelado
    let saborSuco = $("#suco select").eq(0).find(":selected").text();
    let qtdSuco = parseInt($("#suco select").eq(1).val());
    if (qtdSuco > 0) {
        saborSuco = (saborSuco === "Escolha o sabor") ? "sabor aleatório" : saborSuco;
        produtos.push({ nome: "Suco Gelado", sabor: saborSuco, quantidade: qtdSuco, preco: calcularPreco(qtdSuco) });
    }

    return produtos;
}

function calcularPreco(quantidade) {
    return quantidade >= 4 ? 10 : (quantidade * 3) - ((quantidade - 1) * 0.5);
}

function AdicionarNomesElementoHtml(pessoaObjeto) {
    var elementoHmtl = document.getElementById("lista-nomes");

    let html = `<li class="mt-3 list-group-item">
        <button onclick='ExcluirElemento(this)' class='btn btn-danger'>
            <i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <strong>Nome:</strong> ${pessoaObjeto.nome}<br>
        <strong>Quarto:</strong> ${pessoaObjeto.quarto}<br>`;

    pessoaObjeto.produtos.forEach(prod => {
        html += `<strong>${prod.nome}</strong> - ${prod.sabor} - 
        <strong>Qtd:</strong> ${prod.quantidade}<br>`;
    });

    html += `</li>`;

    elementoHmtl.insertAdjacentHTML("beforeend", html);
}

function ExcluirElemento(element) {
    element.parentNode.remove();
    atualizarTotal();
}

function atualizarTotal() {
    let total = 0;
    $("#lista-nomes li").each(function () {
        let texto = $(this).text();
        let regex = /Qtd:\s(\d+)/g;
        let match;

        while ((match = regex.exec(texto)) !== null) {
            let qtd = parseInt(match[1]);
            total += calcularPreco(qtd);
        }
    });

    $("#totalValue").text("R$ " + total.toFixed(2).replace('.', ','));
}

function validarFormulario(nome, quarto) {
    return nome && quarto;
}

async function Envio() {
    if (listaNomes.length === 0) {
        alert("Nenhum item no carrinho.");
        return;
    }

    for (const pessoa of listaNomes) {
        for (const prod of pessoa.produtos) {
            const { error } = await supabase.from("FomeZeroBD").insert([{
                Produto: prod.nome,
                Quantidade: prod.quantidade,
                Sabor: prod.sabor,
                Nome: pessoa.nome,
                Quarto: pessoa.quarto,
                "Valor Total": prod.preco
            }]);

            if (error) {
                console.error("Erro ao enviar para o Supabase:", error);
                alert("Erro ao enviar pedido. Tente novamente.");
                return;
            }
        }
    }

    alert("Pedido enviado!");
    location.reload();
}
