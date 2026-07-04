export const colors = {
    background: '#0a0a0c',
    primary: '#ffffff',
    accent: '#00ffcc',
    premium: '#d4af37',
    surface: '#1c1c1e',
    border: 'rgba(255, 255, 255, 0.12)',
    glassDark: 'rgba(255, 255, 255, 0.06)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    progressBg: 'rgba(255, 255, 255, 0.15)',
    glassBadge: 'rgba(0, 0, 0, 0.6)',
};

export const frosted = {
    backgroundColor: 'rgba(15, 15, 15, 0.35)',
    borderRadius: 20,
    
    // Bisel de luz matemática (Rim Light) para simular el relieve del vidrio
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    borderLeftWidth: 1.2,
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
};

// Añade esto al final de tu theme.ts existente
export const gradients = {
    // Opción A: Aurora Boreal (Tonos oscuros de verde azulado y violeta místico)
    aurora: ['#050B0A', '#0A0914', '#040F0E'] as const,
    
    // Opción B: Nebulosa (Típico de Apple Music: púrpuras profundos combinados con azul espacial)
    nebulosa: ['#0D0614', '#060A1A', '#0B0512'] as const,

    // Opción C: Índigo Oceánico (Frío, profundo y ultra limpio)
    indigoOceano: ['#040B11', '#0A0A16', '#050D17'] as const,
};