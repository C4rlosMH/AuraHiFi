import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    // Relleno dinámico: 30% del alto de la pantalla para que las letras floten al centro
    paddingVertical: height * 0.3, 
    paddingHorizontal: 24,
  },
  lyricText: {
    fontSize: 28, // Letra gigante y audaz
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 20,
    letterSpacing: -0.5, // Le da un toque más moderno y compacto
  },
  activeText: {
    color: '#FFFFFF',
    // Sombra sutil para que el texto resalte si el fondo es muy claro
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inactiveText: {
    // Mismo blanco, pero casi transparente
    color: 'rgba(255, 255, 255, 0.35)', 
  }
});