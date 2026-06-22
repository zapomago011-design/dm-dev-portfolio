const defaults = {
  imovel:  { valor: 300000, prazo: 200, adm: 1.20, res: 0.50, seg: 0.10 },
  auto:    { valor: 80000,  prazo: 84,  adm: 1.60, res: 0.40, seg: 0.10 },
  moto:    { valor: 25000,  prazo: 60,  adm: 1.80, res: 0.40, seg: 0.05 },
  servico: { valor: 50000,  prazo: 60,  adm: 1.60, res: 0.30, seg: 0.05 },
};

function aplicarDefaults() {
  const t = document.getElementById('tipo').value;
  const d = defaults[t];
  document.getElementById('valor').value    = d.valor;
  document.getElementById('prazo').value    = d.prazo;
  document.getElementById('taxa-adm').value = d.adm;
  document.getElementById('taxa-res').value = d.res;
  document.getElementById('taxa-seg').value = d.seg;
  sincPrazo();
  atualizarTaxaLabel();
}

function sincValor() {
  atualizarTaxaLabel();
}

function sincPrazo() {
  const p = document.getElementById('prazo').value;
  document.getElementById('prazo-out').textContent = p + ' meses';
  atualizarTaxaLabel();
}

function atualizarTaxaLabel() {
  const adm = parseFloat(document.getElementById('taxa-adm').value) || 0;
  const res = parseFloat(document.getElementById('taxa-res').value) || 0;
  const seg = parseFloat(document.getElementById('taxa-seg').value) || 0;
  const total = adm + res + seg;
  document.getElementById('taxa-total-label').textContent = total.toFixed(2) + '%';
  document.getElementById('taxa-mes-label').textContent = (total / 12).toFixed(4) + '%';
}

function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtN(v, d = 2) {
  return v.toFixed(d).replace('.', ',');
}

function calcular(valor, prazo, adm, res, seg) {
  const taxaTotalAnual = adm + res + seg;
  const taxaTotal = taxaTotalAnual / 100;
  const amortizacao = valor / prazo;
  const taxaMes = (valor * taxaTotal) / 12;
  const parcela = amortizacao + taxaMes;
  const totalPago = parcela * prazo;
  const totalTaxas = totalPago - valor;
  const percentualTaxas = (totalTaxas / valor) * 100;
  return { parcela, totalPago, totalTaxas, percentualTaxas, amortizacao, taxaMes };
}

function gerarPlanos(valor, prazoBase, adm, res, seg) {
  const variantes = [
    { nome: 'Curto prazo', prazo: Math.max(12, prazoBase - 48) },
    { nome: 'Padrão',      prazo: prazoBase },
    { nome: 'Longo prazo', prazo: Math.min(240, prazoBase + 48) },
  ];
  if (valor >= 100000) {
    variantes.push({ nome: 'Lance 30%', prazo: prazoBase, lance: valor * 0.30 });
  }
  return variantes.map(v => {
    const r = calcular(valor, v.prazo, adm, res, seg);
    const lance = v.lance || 0;
    return { ...v, ...r, lance };
  });
}

function simular() {
  const valor = parseFloat(document.getElementById('valor').value);
  const prazo = parseInt(document.getElementById('prazo').value);
  const adm   = parseFloat(document.getElementById('taxa-adm').value);
  const res   = parseFloat(document.getElementById('taxa-res').value);
  const seg   = parseFloat(document.getElementById('taxa-seg').value);

  if (!valor || valor < 1000) {
    alert('Informe um valor válido para a carta de crédito.');
    return;
  }

  const base   = calcular(valor, prazo, adm, res, seg);
  const planos = gerarPlanos(valor, prazo, adm, res, seg);
  const melhorIdx = planos.reduce((mi, p, i, arr) => p.parcela < arr[mi].parcela ? i : mi, 0);
  const maxTotal  = Math.max(...planos.map(p => p.totalPago));

  const barsHTML = planos.map(p => {
    const hTotal = 160;
    const hPrinc = Math.round((valor / maxTotal) * hTotal);
    const hTaxa  = Math.round((p.totalTaxas / maxTotal) * hTotal);
    return `
      <div class="bar-group">
        <div class="bar-stack" style="height:${hTotal}px;">
          <div class="bar-seg principal" style="height:${hPrinc}px;"></div>
          <div class="bar-seg taxa"      style="height:${hTaxa}px;"></div>
        </div>
        <div class="bar-label">${p.nome.split(' ')[0]}<br>${p.nome.split(' ').slice(1).join(' ')}</div>
      </div>`;
  }).join('');

  const rowsHTML = planos.map((p, i) => {
    const isMelhor = i === melhorIdx;
    const badge = i === 0 ? '<span class="badge badge-gray">Menor prazo</span>'
                : i === 2 ? '<span class="badge badge-amber">Maior prazo</span>'
                : i === 3 ? '<span class="badge badge-green">Com lance</span>'
                : '';
    const economia = base.totalPago - p.totalPago;
    const economiaTxt = economia > 0
      ? `<span style="color:var(--accent)">-${fmt(economia)}</span>`
      : economia < 0
      ? `<span style="color:var(--danger)">+${fmt(Math.abs(economia))}</span>`
      : '—';
    return `
      <tr class="${isMelhor ? 'best' : ''}">
        <td>${p.nome} ${badge} ${isMelhor ? '<span class="badge badge-green">Recomendado</span>' : ''}</td>
        <td>${p.prazo} m</td>
        <td>${fmt(p.lance)}</td>
        <td><strong>${fmt(p.parcela)}</strong></td>
        <td>${fmt(p.totalPago)}</td>
        <td>${economiaTxt}</td>
      </tr>`;
  }).join('');

  document.getElementById('results').innerHTML = `
    <div class="panel fadein">
      <p class="panel-title">Resumo do plano padrão</p>
      <div class="metrics-grid">
        <div class="metric">
          <div class="metric-label">Parcela mensal</div>
          <div class="metric-value accent">${fmt(base.parcela)}</div>
          <div class="metric-sub">por ${prazo} meses</div>
        </div>
        <div class="metric">
          <div class="metric-label">Total pago</div>
          <div class="metric-value">${fmt(base.totalPago)}</div>
          <div class="metric-sub">ao final do prazo</div>
        </div>
        <div class="metric">
          <div class="metric-label">Custo das taxas</div>
          <div class="metric-value accent2">${fmt(base.totalTaxas)}</div>
          <div class="metric-sub">${fmtN(base.percentualTaxas)}% do crédito</div>
        </div>
        <div class="metric">
          <div class="metric-label">Carta de crédito</div>
          <div class="metric-value">${fmt(valor)}</div>
          <div class="metric-sub">valor contratado</div>
        </div>
        <div class="metric">
          <div class="metric-label">Amortização/mês</div>
          <div class="metric-value">${fmt(base.amortizacao)}</div>
          <div class="metric-sub">parcela de capital</div>
        </div>
        <div class="metric">
          <div class="metric-label">Taxas/mês</div>
          <div class="metric-value danger">${fmt(base.taxaMes)}</div>
          <div class="metric-sub">adm + reserva + seg</div>
        </div>
      </div>
    </div>

    <div class="panel fadein" style="animation-delay:0.08s">
      <p class="plan-section-title">Composição do custo por plano</p>
      <div class="chart-wrap">${barsHTML}</div>
      <div class="chart-legend">
        <span><div class="dot p"></div> Capital</span>
        <span><div class="dot t"></div> Taxas</span>
      </div>
    </div>

    <div class="panel fadein" style="animation-delay:0.16s">
      <p class="plan-section-title">Comparativo de planos</p>
      <div style="overflow-x:auto;">
        <table class="plan-table">
          <thead>
            <tr>
              <th>Plano</th><th>Prazo</th><th>Lance</th>
              <th>Parcela</th><th>Total pago</th><th>vs. Padrão</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:1rem;line-height:1.6;">
        * Valores estimados com base nas taxas informadas. Consulte a administradora para valores oficiais.
        Lance antecipado reduz o saldo devedor e aumenta a chance de contemplação.
      </p>
    </div>
  `;
}


sincPrazo();
atualizarTaxaLabel();
