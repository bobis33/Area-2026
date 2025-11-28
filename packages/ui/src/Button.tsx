import React from "react";
import { Pressable, Text, StyleSheet, Platform } from "react-native";

type ButtonProps = {
    label: string;
    onPress: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onPress }) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
        ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
    },
    text: {
        color: "white",
        fontWeight: "bold",
    },
});
