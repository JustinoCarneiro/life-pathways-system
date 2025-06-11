
-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Criar enum para tipos de roles
CREATE TYPE public.user_role AS ENUM ('admin', 'area_leader', 'sector_leader', 'lifegroup_leader', 'user');

-- Criar tabela de roles de usuário
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Criar tabela de áreas
CREATE TABLE IF NOT EXISTS public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  responsible_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de setores
CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  area_id UUID REFERENCES public.areas(id) ON DELETE CASCADE NOT NULL,
  responsible_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de lifegroups
CREATE TABLE IF NOT EXISTS public.lifegroups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE NOT NULL,
  responsible_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de pessoas
CREATE TABLE IF NOT EXISTS public.people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT,
  address TEXT,
  birth_date DATE,
  lifegroup_id UUID REFERENCES public.lifegroups(id) ON DELETE CASCADE,
  is_leader BOOLEAN DEFAULT FALSE,
  is_assistant BOOLEAN DEFAULT FALSE,
  discipler_id UUID REFERENCES public.people(id),
  steps JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifegroups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

-- Função para verificar se o usuário tem uma role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para user_roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas RLS para areas
CREATE POLICY "Authenticated users can view areas" ON public.areas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage areas" ON public.areas
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para sectors
CREATE POLICY "Authenticated users can view sectors" ON public.sectors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and area leaders can manage sectors" ON public.sectors
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'area_leader')
  );

-- Políticas RLS para lifegroups
CREATE POLICY "Authenticated users can view lifegroups" ON public.lifegroups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins, area and sector leaders can manage lifegroups" ON public.lifegroups
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'area_leader') OR
    public.has_role(auth.uid(), 'sector_leader')
  );

-- Políticas RLS para people
CREATE POLICY "Authenticated users can view people" ON public.people
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Leaders can manage people" ON public.people
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'area_leader') OR
    public.has_role(auth.uid(), 'sector_leader') OR
    public.has_role(auth.uid(), 'lifegroup_leader')
  );

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, contact)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'contact', '')
  );
  
  -- Atribuir role de usuário padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir dados iniciais
INSERT INTO public.areas (id, name) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Área 1'),
  ('22222222-2222-2222-2222-222222222222', 'Área 2')
ON CONFLICT DO NOTHING;
