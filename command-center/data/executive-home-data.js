(() => {
  const config = window.COMMAND_CENTER_CONFIG;

  async function getExecutiveHomeData() {
    const client = window.CommandCenterAuth.getClient();
    const session = await window.CommandCenterAuth.requireSession();
    if (!session) return null;

    const userId = session.user.id;
    const organizationSlug = config.organizationSlug || 'grupo-mauricio';

    const { data: membership, error: membershipError } = await client
      .from('organization_members')
      .select('role,is_active,organizations!inner(id,name,slug,logo_url)')
      .eq('profile_id', userId)
      .eq('is_active', true)
      .eq('organizations.slug', organizationSlug)
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership) throw new Error('Seu usuário não possui acesso ativo ao Grupo Maurício.');

    const organization = membership.organizations;
    const organizationId = organization.id;

    const results = await Promise.all([
      client.from('profiles').select('id,full_name,avatar_url').eq('id', userId).single(),
      client.from('companies').select('id,name,slug,description,segments,status,metadata,updated_at').eq('organization_id', organizationId).order('name'),
      client.from('projects').select('id,name,status,progress,due_date,updated_at').eq('organization_id', organizationId).order('updated_at', { ascending: false }),
      client.from('organization_members').select('profile_id,role,is_active').eq('organization_id', organizationId).eq('is_active', true),
      client.from('tasks').select('id,title,status,priority,due_at,completed_at,updated_at').eq('organization_id', organizationId).order('updated_at', { ascending: false }),
      client.from('decisions').select('id,title,context,recommendation,priority,status,decision,decided_at,created_at,updated_at').eq('organization_id', organizationId).order('created_at', { ascending: false })
    ]);

    const firstError = results.find(result => result.error)?.error;
    if (firstError) throw firstError;

    const [profileResult, companiesResult, projectsResult, membersResult, tasksResult, decisionsResult] = results;
    const companies = companiesResult.data || [];
    const projects = projectsResult.data || [];
    const members = membersResult.data || [];
    const tasks = tasksResult.data || [];
    const decisions = decisionsResult.data || [];

    const openStatuses = new Set(['draft', 'active', 'paused']);
    const activeProjects = projects.filter(item => openStatuses.has(item.status));
    const openTasks = tasks.filter(item => openStatuses.has(item.status));
    const openDecisions = decisions.filter(item => openStatuses.has(item.status));
    const criticalDecisions = openDecisions.filter(item => item.priority === 'critical');
    const urgentDecisions = openDecisions.filter(item => ['critical', 'high'].includes(item.priority));
    const overdueProjects = activeProjects.filter(item => item.due_date && new Date(`${item.due_date}T23:59:59`) < new Date());
    const overdueTasks = openTasks.filter(item => item.due_at && new Date(item.due_at) < new Date());

    return {
      user: session.user,
      profile: profileResult.data,
      organization,
      membership,
      companies,
      projects,
      members,
      tasks,
      decisions,
      metrics: {
        companies: companies.filter(item => item.status === 'active').length,
        activeProjects: activeProjects.length,
        members: members.length,
        openDecisions: openDecisions.length,
        criticalDecisions: criticalDecisions.length,
        urgentDecisions: urgentDecisions.length,
        openTasks: openTasks.length,
        overdueProjects: overdueProjects.length,
        overdueTasks: overdueTasks.length
      }
    };
  }

  window.CommandCenterData = { getExecutiveHomeData };
})();