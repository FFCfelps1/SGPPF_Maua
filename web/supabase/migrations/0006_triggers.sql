-- Timestamp maintenance + created_at immutability, and new-user provisioning.

-- BEFORE UPDATE: bump updated_at and keep created_at immutable.
create or replace function public.touch_timestamps()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger touch_profiles     before update on profiles     for each row execute function public.touch_timestamps();
create trigger touch_projects     before update on projects     for each row execute function public.touch_timestamps();
create trigger touch_publications before update on publications for each row execute function public.touch_timestamps();
create trigger touch_advisings    before update on advisings    for each row execute function public.touch_timestamps();
create trigger touch_funding      before update on funding      for each row execute function public.touch_timestamps();

-- Provisioning: enforce the Mauá institutional domain server-side, then create the profile.
-- Works for email/password signup now and for the Microsoft SSO provider added later
-- (both insert into auth.users). domain_hint on the client is UX only — this is the boundary.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email is null or new.email not ilike '%@maua.br' then
    raise exception 'Apenas e-mails institucionais @maua.br sao permitidos.'
      using errcode = 'check_violation';
  end if;

  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
