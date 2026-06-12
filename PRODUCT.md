# Product

## Register

product

## Users

Founders y administradores técnicos de MotoStore SaaS. Entorno: escritorio, pantalla Retina/2K, durante horas de trabajo. Tarea principal en cada sesión: revisar el estado de los tenants, crear nuevos, cambiar planes, detectar problemas. El usuario conoce el dominio, no necesita educación — necesita velocidad y precisión.

## Product Purpose

Portal de administración exclusivo para los creadores de la plataforma MotoStore. Permite gestionar el ciclo de vida completo de los tenants (tiendas de motos): creación, activación, cambio de plan, suspensión, métricas de uso. Es el centro de control del negocio SaaS.

## Brand Personality

Preciso. Austero. Confiable.

La interfaz debe sentirse como una herramienta profesional seria — no un dashboard genérico de SaaS. Cada píxel justifica su presencia. El color aparece con propósito, no como decoración.

## Anti-references

- **No** dashboards SaaS cream/sand genéricos (Notion, Linear clones mediocres).
- **No** glassmorphism decorativo ni gradientes en texto.
- **No** cards idénticas en grid con icono + heading + texto.
- **No** hero-metric template (número grande + label pequeño + stats).
- **No** uppercase tracked eyebrows en cada sección.

Referencias positivas de feeling: Railway dashboard, Render admin, Supabase platform — precisión técnica sin ornamento innecesario.

## Design Principles

1. **Datos primero.** La tabla es el producto. Todo lo demás — nav, header, panel — sirve a la tabla.
2. **El color es semántico.** El accent solo aparece en estados activos, acciones primarias, y foco. No como decoración.
3. **La motion comunica estado, no personalidad.** Cada animación tiene una justificación funcional (Emil: ¿cuántas veces se dispara esta acción?).
4. **Sin ruido visual.** Si un elemento no ayuda al usuario a completar su tarea, no está.
5. **Velocidad percibida.** Skeleton loading, optimistic UI, transiciones < 160ms en interacciones frecuentes.

## Accessibility & Inclusion

WCAG AA mínimo. Contraste de texto ≥ 4.5:1. Todos los elementos interactivos tienen focus-visible. prefers-reduced-motion implementado en todos los componentes. Navegación por teclado completa.
