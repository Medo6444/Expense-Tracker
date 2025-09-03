import * as React from "react";
import {ViewStyle, View} from "react-native";

interface CardProps extends React.PropsWithChildren {
    style?: ViewStyle;
}

export function Card({children, style = {}}: CardProps) {
    return (
        <View style={{
            padding: 15,
            borderRadius: 15,
            backgroundColor: "white",
            marginBottom: 10,
            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: {height: 6, width: 0},
            ...style,
        }}>
            {children}
        </View>
    );
}