import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Button = (props) => {
  const { onPress, title = 'Button', bgColor = '#ff7a00', iconName, iconRight = true, iconColor = 'white' } = props;
  
  const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: bgColor,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
  });

  return (
    <Pressable style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        styles.button
      ]} onPress={onPress}>
        {iconName && !iconRight && <Ionicons name={iconName} size={16} color={iconColor} />}
        <Text style={styles.text}>{title}</Text>
        {iconName && iconRight && <Ionicons name={iconName} size={16} color={iconColor} />}
    </Pressable>
  );
}


export default Button
