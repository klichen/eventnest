import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

const LoadSkeleton = ({ width = '100%', height = 20 }) => {
    const opacity = useRef(new Animated.Value(0.3));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current, {
                    toValue: 0.8,
                    useNativeDriver: true,
                    duration: 500
                }),
                Animated.timing(opacity.current, {
                    toValue: 0.3,
                    useNativeDriver: true,
                    duration: 800
                })
            ])
        ).start()
    }, [opacity]);

    return (<Animated.View style={[{ opacity: opacity.current, height, width }, styles.skeleton]} />);
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#a0a0a0',
        borderRadius: 8,
    }
});

export default LoadSkeleton;