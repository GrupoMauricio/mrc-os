(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const priorityLabel = { critical: 'Crítica', high: 'Alta', medium: 'Média', low: 'Baixa' };
  const statusLabel = { draft: 'Rascunho', active: 'Ativa', paused: 'Pausada', completed: 'Concluída', archived: 'Arquivada' };

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  function greeting(name) {
    const hour = new Date().getHours();
    const word = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
    return `${word}, ${name || 'Maurício'}.`;
  }

  function executiveSummary(data) {
    const m = data.metrics;
    if (m.criticalDecisions) return `Existem ${m.criticalDecisions} decisões críticas aguardando sua atenção.`;
    if (m.overdueProjects) return `${m.overdueProjects} projetos ultrapassaram o prazo planejado.`;
    if (m.overdueTasks) return `${m.overdueTasks} tarefas estão vencidas e precisam de encaminhamento.`;
    if (m.urgentDecisions) return `${m.urgentDecisions} decisões de alto impacto estão abertas.`;
    if (m.activeProjects) return `A operação está estável, com ${m.activeProjects} projetos em andamento.`;
    return 'A fundação do Grupo Maurício está conectada e pronta para receber a operação.';
  }

  function renderMetrics(data) {
    const m = data.metrics;
    setText('#metricCompanies', m.companies);
    setText('#metricProjects', m.activeProjects);
    setText('#metricPeople', m.members);
    setText('#metricDecisions', m.openDecisions);
    setText('#companiesCaption', `${data.companies.length} cadastradas no banco`);
    setText('#projectsCaption', m.overdueProjects ? `${m.overdueProjects} fora do prazo` : 'Operação dentro do prazo');
    setText('#peopleCaption', `${m.members} acessos ativos`);
    setText('#decisionsCaption', m.criticalDecisions ? `${m.criticalDecisions} críticas` : 'Nenhuma decisão crítica');
  }

  function renderDecisions(data) {
    const container = $('#decisionList');
    const open = data.decisions.filter(item => ['draft', 'active', 'paused'].includes(item.status)).slice(0, 5);
    if (!open.length) {
      container.innerHTML = '<div class="empty-state">Nenhuma decisão aberta. Novas decisões aparecerão aqui automaticamente.</div>';
      return;
    }
    container.innerHTML = open.map(item => `
      <article class="decision-item priority-${escapeHtml(item.priority)}">
        <div>
          <span class="pill">${escapeHtml(priorityLabel[item.priority] || item.priority)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.context || item.recommendation || 'Sem contexto registrado.')}</p>
        </div>
        <div class="decision-meta">
          <span>${escapeHtml(statusLabel[item.status] || item.status)}</span>
          <small>${new Intl.DateTimeFormat('pt-BR').format(new Date(item.created_at))}</small>
        </div>
      </article>`).join('');
  }

  function companyHealth(company, data) {
    const projects = data.projects.filter(project => project.company_id === company.id);
    const metadataHealth = Number(company.metadata?.health);
    if (Number.isFinite(metadataHealth) && metadataHealth >= 0 && metadataHealth <= 100) return metadataHealth;
    if (company.status !== 'active') return 45;
    return projects.some(project => project.status === 'paused') ? 68 : 88;
  }

  function renderCompanies(data) {
    const container = $('#companyGrid');
    if (!data.companies.length) {
      container.innerHTML = '<div class="empty-state">Nenhuma empresa disponível para esta organização.</div>';
      return;
    }
    container.innerHTML = data.companies.map(company => {
      const health = companyHealth(company, data);
      const segments = (company.segments || []).slice(0, 3);
      return `<article class="company-card">
        <div class="company-card-head"><div><span class="eyebrow">${escapeHtml(statusLabel[company.status] || company.status)}</span><h3>${escapeHtml(company.name)}</h3></div><strong>${health}%</strong></div>
        <p>${escapeHtml(company.description || 'Descrição estratégica ainda não registrada.')}</p>
        <div class="health-track"><span style="width:${health}%"></span></div>
        <div class="tags">${segments.map(segment => `<span>${escapeHtml(segment)}</span>`).join('') || '<span>Sem segmento</span>'}</div>
      </article>`;
    }).join('');
  }

  function renderActivity(data) {
    const container = $('#activityList');
    const activity = [
      ...data.projects.map(item => ({ label: `Projeto atualizado: ${item.name}`, date: item.updated_at })),
      ...data.tasks.map(item => ({ label: `Tarefa atualizada: ${item.title}`, date: item.updated_at })),
      ...data.decisions.map(item => ({ label: `Decisão registrada: ${item.title}`, date: item.updated_at }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    container.innerHTML = activity.length
      ? activity.map(item => `<li><span></span><div><strong>${escapeHtml(item.label)}</strong><small>${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.date))}</small></div></li>`).join('')
      : '<li><div><strong>Nenhuma atividade operacional registrada.</strong><small>Os próximos eventos aparecerão aqui.</small></div></li>';
  }

  function render(data) {
    const name = data.profile?.full_name?.split(' ')[0] || 'Maurício';
    setText('#greeting', greeting(name));
    setText('#profileName', data.profile?.full_name || data.user.email);
    setText('#profileRole', data.membership.role === 'owner' ? 'Proprietário do Grupo' : data.membership.role);
    setText('#organizationName', data.organization.name);
    setText('#executiveSummary', executiveSummary(data));
    renderMetrics(data);
    renderDecisions(data);
    renderCompanies(data);
    renderActivity(data);
    $('#loadingState')?.remove();
    $('#appContent')?.removeAttribute('hidden');
  }

  function showError(error) {
    const loading = $('#loadingState');
    if (loading) loading.innerHTML = `<strong>Não foi possível carregar a Executive Home.</strong><p>${escapeHtml(error.message)}</p><button class="btn" onclick="location.reload()">Tentar novamente</button>`;
  }

  function setupInterface() {
    const modal = $('#commandModal');
    const sidebar = $('#sidebar');
    const openCommand = () => { modal?.classList.add('open'); setTimeout(() => $('#commandInput')?.focus(), 20); };
    const closeCommand = () => modal?.classList.remove('open');
    $('#commandTrigger')?.addEventListener('click', openCommand);
    $('#menuBtn')?.addEventListener('click', () => sidebar?.classList.toggle('open'));
    $('#signOutBtn')?.addEventListener('click', () => window.CommandCenterAuth.signOut());
    modal?.addEventListener('click', event => { if (event.target === modal) closeCommand(); });
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommand(); }
      if (event.key === 'Escape') closeCommand();
    });
  }

  async function boot() {
    setupInterface();
    try {
      const data = await window.CommandCenterData.getExecutiveHomeData();
      if (data) render(data);
    } catch (error) {
      console.error(error);
      showError(error);
    }
  }

  boot();
})();