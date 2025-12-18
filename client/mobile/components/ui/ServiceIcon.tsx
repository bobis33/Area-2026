import React from 'react';
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

interface ServiceIconProps {
  service: 'discord' | 'github' | 'google' | 'spotify' | 'gitlab' | string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  service,
  size = 24,
  color,
  style,
}) => {
  const serviceLower = service.toLowerCase();

  switch (serviceLower) {
    case 'discord':
      return (
        <Ionicons name="logo-discord" size={size} color={color} style={style} />
      );
    case 'github':
      return (
        <AntDesign name="github" size={size} color={color} style={style} />
      );
    case 'google':
      return (
        <AntDesign name="google" size={size} color={color} style={style} />
      );
    case 'spotify':
      return <MaterialCommunityIcons name="spotify" size={size} color={color} style={style} />;
    case 'gitlab':
      return <MaterialCommunityIcons name="gitlab" size={size} color={color} style={style} />;
    default:
      // Fallback icon
      return (
        <MaterialCommunityIcons
          name="web"
          size={size}
          color={color}
          style={style}
        />
      );
  }
};
