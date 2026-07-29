(() => {
  'use strict';

  const config = window.COMMAND_CENTER_CONFIG;
  const grid = document.getElementById('companyGrid');
  const notice = document.getElementById('notice');
  const dialog = document.getElementById('companyDialog');
  const form = document.getElementById('companyForm');
  const searchInput = document.getElementById('searchInput');
  let companies = [];
  let organizationId = null;
  let client = null;

  const fields = {
    id: document.getElementById('companyId'),
    name: document.getElementById('name'),
    legalName: document.getElementById('legalName'),
    documentNumber: document.getElementById('documentNumber'),
    description: document.getElementById('description'),
    segments: document.getElementById('segments'),
    status: document.getElementById('status')
  };

  function showNotice(message, type = 'ok') {
    notice.textContent = message;
    notice.className = `notice show ${type}`;
    window.setTimeout(() => { notice.className = 'notice'; }, 5000);
  }

  function slugify(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function render(items = companies) {
    if (!items.length) {
      grid.innerHTML = '<div class="card state">Nenhuma empresa encontrada.</div>';
      return;
    }
    grid.innerHTML = items.map(company => `
      <article class="card company">
        <div class="eyebrow">${escapeHtml(statusLabel(company.status))}</div>
        <h2>${escapeHtml(company.name)}</h2>
        <p>${escapeHtml(company.description || company.legal_name || 'Sem descrição cadastrada.')}</p>
        <div class="tags">${(company.segments || []).map(segment => `<span class="tag">${escapeHtml(segment)}</span>`).join('')}</div>
        <small>${escapeHtml(company.legal_name || '')}${company.document_number ? ` · ${escapeHtml(company.document_number)}` : ''}</small>
        <div class="actions">
          <button class="btn" data-edit="${company.id}">Editar</button>
          <button class="btn danger" data-delete="${company.id}">Remover</button>
        </div>
      </article>`).join('');
  }

  function statusLabel(status) {
    return ({active:'Ativa',draft:'Em estruturação',paused:'Pausada',completed:'Concluída',archived:'Arquivada'})[status] || status;
  }

  async function requireSession() {
    if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
      throw new Error('Supabase ainda não configurado. Preencha auth/config.js.');
    }
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;
    if (!session) {
      window.location.replace('./login.html');
      return false;
    }
    return true;
  }

  async function resolveOrganization() {
    const { data, error } = await client
      .from('organizations')
      .select('id,name,slug')
      .eq('slug', config.organizationSlug || 'grupo-mauricio')
      .single();
    if (error) throw error;
    organizationId = data.id;
  }

  async function loadCompanies() {
    grid.innerHTML = '<div class="card state">Carregando empresas...</div>';
    const { data, error } = await client
      .from('companies')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');
    if (error) throw error;
    companies = data || [];
    render();
  }

  function openCreate() {
    form.reset();
    fields.id.value = '';
    document.getElementById('dialogTitle').textContent = 'Nova empresa';
    dialog.showModal();
  }

  function openEdit(id) {
    const company = companies.find(item => item.id === id);
    if (!company) return;
    fields.id.value = company.id;
    fields.name.value = company.name || '';
    fields.legalName.value = company.legal_name || '';
    fields.documentNumber.value = company.document_number || '';
    fields.description.value = company.description || '';
    fields.segments.value = (company.segments || []).join(', ');
    fields.status.value = company.status || 'active';
    document.getElementById('dialogTitle').textContent = 'Editar empresa';
    dialog.showModal();
  }

  async function saveCompany(event) {
    event.preventDefault();
    const payload = {
      organization_id: organizationId,
      name: fields.name.value.trim(),
      slug: slugify(fields.name.value),
      legal_name: fields.legalName.value.trim() || null,
      document_number: fields.documentNumber.value.trim() || null,
      description: fields.description.value.trim() || null,
      segments: fields.segments.value.split(',').map(v => v.trim()).filter(Boolean),
      status: fields.status.value,
      updated_at: new Date().toISOString()
    };
    if (!payload.name || !payload.slug) return showNotice('Informe um nome válido.', 'error');

    const id = fields.id.value;
    const query = id
      ? client.from('companies').update(payload).eq('id', id).eq('organization_id', organizationId)
      : client.from('companies').insert(payload);
    const { error } = await query;
    if (error) return showNotice(error.message, 'error');
    dialog.close();
    showNotice(id ? 'Empresa atualizada.' : 'Empresa cadastrada.');
    await loadCompanies();
  }

  async function removeCompany(id) {
    const company = companies.find(item => item.id === id);
    if (!company || !window.confirm(`Remover ${company.name}? Esta ação não pode ser desfeita.`)) return;
    const { error } = await client.from('companies').delete().eq('id', id).eq('organization_id', organizationId);
    if (error) return showNotice(error.message, 'error');
    showNotice('Empresa removida.');
    await loadCompanies();
  }

  document.getElementById('newCompanyBtn').addEventListener('click', openCreate);
  document.getElementById('closeDialogBtn').addEventListener('click', () => dialog.close());
  document.getElementById('cancelBtn').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', saveCompany);
  grid.addEventListener('click', event => {
    const editId = event.target.dataset.edit;
    const deleteId = event.target.dataset.delete;
    if (editId) openEdit(editId);
    if (deleteId) removeCompany(deleteId);
  });
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    render(companies.filter(company => [company.name, company.legal_name, company.description, ...(company.segments || [])]
      .filter(Boolean).some(value => String(value).toLowerCase().includes(term))));
  });
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await client.auth.signOut();
    window.location.replace('./login.html');
  });

  (async () => {
    try {
      if (!(await requireSession())) return;
      await resolveOrganization();
      await loadCompanies();
    } catch (error) {
      grid.innerHTML = `<div class="card state">${escapeHtml(error.message)}</div>`;
      showNotice(error.message, 'error');
    }
  })();
})();
