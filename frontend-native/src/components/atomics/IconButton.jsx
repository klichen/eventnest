import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const IconButton = (props) => {
  const { onPress, bgColor, iconName, iconColor = 'white', iconSize = 16 } = props;
  
  const styles = StyleSheet.create({
    button: {
        backgroundColor: bgColor,
    },
  });

  return (
    <Pressable style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        styles.button
      ]} onPress={onPress}>
        {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
    </Pressable>
  );
}


export default IconButton
