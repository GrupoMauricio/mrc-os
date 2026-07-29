(() => {
  const config = window.COMMAND_CENTER_CONFIG;
  const state = { client: null, user: null };

  function assertConfig() {
    if (!config?.supabaseUrl || !config?.supabaseAnonKey || config.supabaseUrl.includes('SEU-PROJETO')) {
      throw new Error('Supabase ainda não configurado. Copie auth/config.example.js para auth/config.js e informe as credenciais públicas.');
    }
  }

  function getClient() {
    assertConfig();
    if (!state.client) {
      state.client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }
    return state.client;
  }

  async function signIn(email, password) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    state.user = data.user;
    return data;
  }

  async function signOut() {
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
    window.location.href = './login.html';
  }

  async function requireSession() {
    const { data, error } = await getClient().auth.getSession();
    if (error || !data.session) {
      window.location.replace('./login.html');
      return null;
    }
    state.user = data.session.user;
    return data.session;
  }

  async function redirectAuthenticatedUser() {
    const { data } = await getClient().auth.getSession();
    if (data.session) window.location.replace('./index.html');
  }

  window.CommandCenterAuth = { getClient, signIn, signOut, requireSession, redirectAuthenticatedUser };
})();
