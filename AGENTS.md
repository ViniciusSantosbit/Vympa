# Regras do projeto VYMPA

- Trabalhar um script por vez. S00 e S01 concluídos; S02 autorizado nesta sessão; S03 a S13 exigem autorização expressa.
- Preservar arquivos existentes e alterações de terceiros. Nunca excluir dados preexistentes sem autorização.
- Não introduzir segredos, credenciais ou dados comerciais fictícios no código. VITE_ é público.
- Executar typecheck, lint, format:check e build antes de declarar uma etapa concluída; relatar verificações pendentes.
- Não publicar, configurar hospedagem nem enviar código a remotos sem autorização.
- Não modificar VYMPA Connect ou outros repositórios. Não criar PROJETO.md.
- Componentes PascalCase, hooks use*, variáveis e funções camelCase. Preferir alias @/.
- Conteúdo comercial em src/content; modelos compartilhados em src/types; componentes reutilizáveis em components; seções em sections; lógica de domínio em features; composição e providers em app; estilos e tokens em styles; hooks genéricos em hooks e utilitários em lib.
- Respeitar acessibilidade, responsividade e prefers-reduced-motion.
