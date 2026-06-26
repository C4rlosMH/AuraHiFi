// src/hooks/useTapToSeek.ts
import { useState, useRef, useCallback, useMemo } from 'react';
import { PanResponder, LayoutChangeEvent, Vibration } from 'react-native';
import TrackPlayer from 'react-native-track-player';

export const useTapToSeek = (duration: number) => {
    const [sliderWidth, setSliderWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragValue, setDragValue] = useState(0);
    
    const initialTouchX = useRef(0);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        setSliderWidth(e.nativeEvent.layout.width);
    }, []);

    const panResponder = useMemo(() => 
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (evt) => {
                setIsDragging(true);
                initialTouchX.current = evt.nativeEvent.locationX;
                
                if (sliderWidth > 0 && duration > 0) {
                    const percentage = Math.max(0, Math.min(initialTouchX.current / sliderWidth, 1));
                    setDragValue(percentage * duration);
                    Vibration.vibrate(15); 
                }
            },

            onPanResponderMove: (evt, gestureState) => {
                if (sliderWidth > 0 && duration > 0) {
                    const currentX = initialTouchX.current + gestureState.dx;
                    const percentage = Math.max(0, Math.min(currentX / sliderWidth, 1));
                    setDragValue(percentage * duration);
                }
            },

            onPanResponderRelease: async (evt, gestureState) => {
                if (sliderWidth > 0 && duration > 0) {
                    const currentX = initialTouchX.current + gestureState.dx;
                    const percentage = Math.max(0, Math.min(currentX / sliderWidth, 1));
                    const finalValue = percentage * duration;
                    
                    setDragValue(finalValue);
                    await TrackPlayer.seekTo(finalValue);
                    
                    setTimeout(() => setIsDragging(false), 200);
                }
            },
            
            onPanResponderTerminate: () => {
                setIsDragging(false);
            }
        })
    , [sliderWidth, duration]);

    return {
        handleLayout,
        panHandlers: panResponder.panHandlers,
        isDragging,
        dragValue
    };
};