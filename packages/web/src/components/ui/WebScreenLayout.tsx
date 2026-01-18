import { ScreenLayout, type ScreenLayoutProps } from '@area/ui';
import { useWebTheme } from '@/context/ThemeContext';
import { lightColors, darkColors } from '@area/ui';
import type { ViewStyle } from 'react-native';

export interface WebScreenLayoutProps extends ScreenLayoutProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function WebScreenLayout({
  children,
  title,
  scroll = false,
  safeArea = true,
  headerRight,
  contentStyle,
  maxWidth = 'lg',
  className = '',
  ...screenLayoutProps
}: WebScreenLayoutProps) {
  const { mode } = useWebTheme();
  const colors = mode === 'light' ? lightColors : darkColors;

  const getContainerStyle = (): ViewStyle => {
    const maxWidthMap = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      full: '100%' as const,
    };

    return {
      backgroundColor: colors.background,
      maxWidth: maxWidthMap[maxWidth],
      width: '100%',
      ...contentStyle,
    };
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        margin: '0 auto',
      }}
    >
      <ScreenLayout
        title={title}
        scroll={scroll}
        safeArea={false}
        headerRight={headerRight}
        contentStyle={getContainerStyle()}
        {...screenLayoutProps}
      >
        {children}
      </ScreenLayout>
    </div>
  );
}
