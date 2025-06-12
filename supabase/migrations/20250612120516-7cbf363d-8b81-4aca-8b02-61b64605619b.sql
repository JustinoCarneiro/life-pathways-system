
-- Configurar o usuário samuelvitoralves14@gmail.com como admin principal
-- Primeiro, vamos buscar o ID do usuário baseado no email
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Buscar o ID do usuário pelo email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'samuelvitoralves14@gmail.com';
    
    -- Verificar se o usuário existe
    IF admin_user_id IS NOT NULL THEN
        -- Remover qualquer role existente para este usuário
        DELETE FROM public.user_roles WHERE user_id = admin_user_id;
        
        -- Inserir a role de admin para o usuário
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin');
        
        -- Criar ou atualizar o perfil do usuário
        INSERT INTO public.profiles (id, full_name, contact)
        VALUES (admin_user_id, 'Samuel Vitor Alves', 'samuelvitoralves14@gmail.com')
        ON CONFLICT (id) 
        DO UPDATE SET 
            full_name = EXCLUDED.full_name,
            contact = EXCLUDED.contact,
            updated_at = NOW();
            
        RAISE NOTICE 'Usuário % configurado como admin principal com sucesso!', 'samuelvitoralves14@gmail.com';
    ELSE
        RAISE NOTICE 'Usuário % não encontrado no sistema. O usuário precisa fazer login primeiro.', 'samuelvitoralves14@gmail.com';
    END IF;
END $$;

-- Verificar se a configuração foi aplicada corretamente
SELECT 
    u.email,
    p.full_name,
    ur.role,
    ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'samuelvitoralves14@gmail.com';
