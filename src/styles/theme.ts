export const colors = {
    background: '#0a0a0c',
    primary: '#ffffff',
    accent: '#3D3DD5',
    premium: '#d4af37',
    light: '#7B7BEA',
    surface: '#1c1c1e',
    border: 'rgba(255, 255, 255, 0.12)',
    glassDark: 'rgba(255, 255, 255, 0.06)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    progressBg: 'rgba(255, 255, 255, 0.15)',
    glassBadge: 'rgba(0, 0, 0, 0.55)',
    reemplazo: '#1b1b1cd9',
    so_dark: '#040404be',
    black: '#000000',
    ilumination: '#ffffffb3',
    drag: 'rgba(255, 255, 255, 0.3)',
    cycle: '#13131348',
};

export const frosted = {
    //backgroundColor: 'rgba(70, 70, 70, 0.38)',
    backgroundColor: 'rgba(50, 50, 50, 0.23)',
    borderRadius: 20,
    
    // Bisel de luz matemática (Rim Light) para simular el relieve del vidrio
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    borderLeftWidth: 1.2,
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
};

// Reemplaza el bloque anterior en tu theme.ts con estos colores optimizados:
export const gradients = {
    // 1. Aurora Boreal (Verde esmeralda y teal que se funden en azul noche)
    aurora: ['#042622', '#081730', '#030A14'] as const,
    
    // 2. Nebulosa (Púrpura místico con azul espacial oscuro)
    nebulosa: ['#230C3A', '#0D1B40', '#06081A'] as const,

    // 3. Índigo Oceánico (Zafiro profundo combinado con cian y marinos fríos)
    indigoOceano: ['#051C34', '#0A333C', '#030E1B'] as const,

    // 4. Volcánico Premium (Rosa magmático intenso, violetas y carbón oscuro)
    volcanico: ['#3A061C', '#1D082B', '#09040D'] as const,

    // 5. Cyber Pink (Rosa neón profundo, teales eléctricos y fondo espacial oscuro)
    cyberPink: ['#42052C', '#082530', '#040714'] as const,

    // 6. Atardecer Eléctrico (Tonos violeta-rojizo, fucsia quemado y azul cobalto)
    atardecerElectrico: ['#35082C', '#280A3D', '#071226'] as const,

    // 7. Orquídea Cósmica (Magenta profundo, morados ricos y un sutil cian)
    orquideaCosmica: ['#2F0525', '#160833', '#061724'] as const,

    // 8. Bosque Místico (Verde pino saturado, esmeralda y gris Oxford)
    bosqueMistico: ['#082D1C', '#0A1C28', '#030A0F'] as const,

    // 9. Amatista Líquida (Púrpura amatista brillante que decae a un azul profundo y limpio)
    amatistaLiquida: ['#28083A', '#0A1435', '#040614'] as const,
    
    // 10. Sangre de Dragón (Carmesí profundo que decae a un carbón rojizo)
    sangreDeDragon: ['#4A0404', '#1C0202', '#080101'] as const,

    // 11. Rubí Oscuro (Rojo rubí con un levísimo toque de vino/borgoña)
    rubiOscuro: ['#3D0510', '#170105', '#050002'] as const,

    // 12. Eclipse Marcial (Rojo anaranjado quemado que se funde en oscuridad total)
    eclipseMarcial: ['#521102', '#210502', '#0A0201'] as const,
};