-- Update handle_new_user to merge with pre-registered profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF new.email IS NULL OR new.email NOT ILIKE '%@maua.br' THEN
    RAISE EXCEPTION 'Apenas e-mails institucionais @maua.br sao permitidos.'
      USING ERRCODE = 'check_violation';
  END IF;

  -- Check if a profile already exists for this email (pre-registered)
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = new.email) THEN
    UPDATE public.profiles
    SET id = new.id,
        full_name = COALESCE(nullif(new.raw_user_meta_data ->> 'full_name', ''), full_name)
    WHERE email = new.email;
  ELSE
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
      new.id,
      COALESCE(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
      new.email
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;
