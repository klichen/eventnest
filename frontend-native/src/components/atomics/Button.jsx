import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Button = (props) => {
  const { onPress, title, bgColor, iconName, iconRight = false, iconColor = 'white', iconSize = 16, textColor = 'white', textWeight = 'bold', textSize = 16, customStyle } = props;
  
  const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: bgColor,
    },
    text: {
        fontSize: textSize,
        lineHeight: 21,
        fontWeight: textWeight,
        letterSpacing: 0.25,
        color: textColor,
    },
  });

  return (
    <Pressable style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        styles.button,
        customStyle
      ]} onPress={onPress}>
        {iconName && !iconRight && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
        <Text style={styles.text}>{title}</Text>
        {iconName && iconRight && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
    </Pressable>
  );
}


export default Button
