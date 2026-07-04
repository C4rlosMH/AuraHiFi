import AsyncStorage from '@react-native-async-storage/async-storage';

const PINS_KEY = '@aura_hifi_pins';
const MAX_PINS = 6;

export interface PinItem {
    id: string;
    title: string;
    subtitle: string;
    coverArtUrl: string;
    type: 'album' | 'playlist';
}

export const pinService = {
    getPins: async (): Promise<PinItem[]> => {
        try {
            const jsonValue = await AsyncStorage.getItem(PINS_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error("Error leyendo pines locales", e);
            return [];
        }
    },

    togglePin: async (item: PinItem): Promise<{ success: boolean; message: string }> => {
        try {
            const currentPins = await pinService.getPins();
            const exists = currentPins.some(pin => pin.id === item.id);

            if (exists) {
                // Si ya existe, lo quitamos
                const newPins = currentPins.filter(pin => pin.id !== item.id);
                await AsyncStorage.setItem(PINS_KEY, JSON.stringify(newPins));
                return { success: true, message: "Pin removido" };
            } else {
                // Si no existe, verificamos el límite antes de agregarlo
                if (currentPins.length >= MAX_PINS) {
                    return { success: false, message: `Límite alcanzado. Solo puedes tener ${MAX_PINS} pines.` };
                }
                const newPins = [item, ...currentPins];
                await AsyncStorage.setItem(PINS_KEY, JSON.stringify(newPins));
                return { success: true, message: "Fijado en la Biblioteca" };
            }
        } catch (e) {
            return { success: false, message: "Error al modificar el pin" };
        }
    },

    isPinned: async (id: string): Promise<boolean> => {
        const pins = await pinService.getPins();
        return pins.some(pin => pin.id === id);
    }
};