import React from 'react';
import { View } from 'react-native';
import { styles } from './StorageCylinder.styles';

export interface StorageSlice {
    id: string;
    label: string;
    sizeText: string;
    percentage: number;
    color: string;
    lidColor: string;
}

interface StorageCylinderProps {
    data: StorageSlice[];
}

export default function StorageCylinder({ data }: StorageCylinderProps) {
    const CYLINDER_MAX_HEIGHT = 380;

    return (
        <View style={styles.container}>
            
            {/* 1. EL CRISTAL DEL FONDO */}
            <View style={styles.glassBackground}>
                <View style={[styles.ellipseBase, styles.glassTopLid]} />
                <View style={[styles.ellipseBase, styles.glassBottomLid]} />
            </View>

            {/* 2. LOS LÍQUIDOS APILADOS */}
            <View style={styles.liquidsWrapper}>
                {[...data].reverse().map((slice, index, arr) => {
                    const isTopLiquid = index === arr.length - 1;
                    
                    // Altura cruda basada en el porcentaje
                    const rawHeight = (slice.percentage / 100) * CYLINDER_MAX_HEIGHT;
                    
                    // Forzamos un mínimo de 6px para que los porcentajes muy bajos (1%) 
                    // sigan siendo visibles y no desaparezcan debajo de las elipses
                    const sliceHeight = rawHeight > 0 && rawHeight < 6 ? 6 : rawHeight;

                    if (sliceHeight <= 0) return null;

                    return (
                        <View key={slice.id} style={{ height: sliceHeight, width: 110, zIndex: index }}>
                            
                            {/* Cuerpo plano del líquido */}
                            <View style={[styles.liquidBody, { backgroundColor: slice.color, height: sliceHeight }]} />
                            
                            {/* Elipse Inferior: Crea la curva que tapa al color de abajo */}
                            <View style={[styles.ellipseBase, styles.liquidBottom, { backgroundColor: slice.color }]} />
                            
                            {/* Elipse Superior: La superficie iluminada (Solo en el líquido más alto) */}
                            {isTopLiquid && (
                                <View style={[styles.ellipseBase, styles.liquidTop, { backgroundColor: slice.lidColor }]} />
                            )}
                            
                        </View>
                    );
                })}
            </View>
        </View>
    );
}