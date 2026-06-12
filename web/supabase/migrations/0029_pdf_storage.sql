-- 1. Adiciona as colunas para armazenar as URLs dos PDFs (se ainda não existirem)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE advisings ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 2. Cria o bucket de storage para os documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configura as políticas de segurança (RLS) para o bucket 'documents'

-- Remove as políticas se você tentou rodar e elas ficaram criadas pela metade
DROP POLICY IF EXISTS "authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "public_read" ON storage.objects;
DROP POLICY IF EXISTS "owner_manage" ON storage.objects;

-- Permitir que qualquer usuário autenticado faça upload
CREATE POLICY "authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Permitir que qualquer usuário autenticado visualize os documentos
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents');

-- CORREÇÃO: Usar 'users:manage' que é a permissão de administrador no seu sistema
CREATE POLICY "owner_manage" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      auth.uid() = owner
      OR authorize('users:manage')
    )
  );