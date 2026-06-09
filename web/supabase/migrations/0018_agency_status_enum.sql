-- Replace text with an enum for standard agency statuses
CREATE TYPE public.agency_project_status AS ENUM (
  'em_analise',       -- Em análise
  'pendente',         -- Aguardando documentação/correção
  'aprovado',         -- Aprovado/Aguardando contratação
  'em_execucao',      -- Em execução/Contratado
  'concluido',        -- Concluído/Relatório final aprovado
  'rejeitado',        -- Não aprovado pela agência
  'cancelado'         -- Cancelado pela agência ou pesquisador
);

ALTER TABLE public.project_submissions 
  ALTER COLUMN funding_agency_status TYPE public.agency_project_status 
  USING (
    CASE 
      WHEN funding_agency_status ILIKE '%analise%' THEN 'em_analise'::public.agency_project_status
      WHEN funding_agency_status ILIKE '%aprovado%' THEN 'aprovado'::public.agency_project_status
      WHEN funding_agency_status ILIKE '%execucao%' THEN 'em_execucao'::public.agency_project_status
      WHEN funding_agency_status ILIKE '%concluido%' THEN 'concluido'::public.agency_project_status
      WHEN funding_agency_status ILIKE '%rejeitado%' THEN 'rejeitado'::public.agency_project_status
      WHEN funding_agency_status ILIKE '%cancelado%' THEN 'cancelado'::public.agency_project_status
      ELSE 'em_analise'::public.agency_project_status
    END
  );
