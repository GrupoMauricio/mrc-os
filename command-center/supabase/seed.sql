-- Dados iniciais do Grupo Maurício
insert into public.organizations (name, slug, legal_name, settings)
values (
  'Grupo Maurício',
  'grupo-mauricio',
  'Grupo Maurício',
  '{"locale":"pt-BR","timezone":"America/Sao_Paulo","currency":"BRL","productName":"Command Center OS"}'::jsonb
)
on conflict (slug) do nothing;

with org as (
  select id from public.organizations where slug = 'grupo-mauricio'
)
insert into public.companies (organization_id, name, slug, legal_name, document_number, description, segments, metadata)
select org.id, company.name, company.slug, company.legal_name, company.document_number, company.description, company.segments, company.metadata
from org
cross join (
  values
    ('NextLevel', 'nextlevel', 'NextLevel Marketing Ltda - ME', null, 'Marketing, tecnologia, inteligência artificial e crescimento.', array['Marketing','Tecnologia','IA'], '{"publicBrand":true}'::jsonb),
    ('Mega Tron', 'mega-tron', 'Mega Tron Comércio Eletrônico Ltda', null, 'Operações comerciais, comércio eletrônico e infraestrutura de vendas.', array['Comércio eletrônico','Operações'], '{"publicBrand":true}'::jsonb),
    ('Maurício Turismo', 'mauricio-turismo', 'Starline Viagens e Turismo Ltda', null, 'Viagens, missões empresariais, eventos e experiências.', array['Turismo','Eventos','Experiências'], '{"publicBrand":true}'::jsonb),
    ('IDESA-MRS', 'idesa-mrs', 'IDESA-MRS', '04.460.065/0001-70', 'Instituto de impacto social, educação e projetos institucionais.', array['Impacto social','Educação'], '{"naturezaJuridica":"Associação Privada","sede":"Santo Antônio do Tauá - PA","fundacao":"2001-05-17"}'::jsonb)
) as company(name, slug, legal_name, document_number, description, segments, metadata)
on conflict (organization_id, slug) do update set
  name = excluded.name,
  legal_name = excluded.legal_name,
  document_number = excluded.document_number,
  description = excluded.description,
  segments = excluded.segments,
  metadata = excluded.metadata;
