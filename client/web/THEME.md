# Thème AREA - Guide d'utilisation

Ce thème est partagé entre le client mobile (React Native) et le client web (React) pour assurer une cohérence visuelle.

## 🎨 Couleurs principales

### Mode clair
- **Primary (Indigo)**: `#6366f1`
- **Primary Dark**: `#4f46e5`
- **Secondary (Purple)**: `#8b5cf6`
- **Background**: `#ffffff`
- **Text**: `#1e293b`

### Mode sombre
- **Primary (Indigo)**: `#818cf8`
- **Primary Dark**: `#6366f1`
- **Secondary (Purple)**: `#a78bfa`
- **Background**: `#0f172a`
- **Text**: `#f1f5f9`

## 📁 Fichiers disponibles

### TypeScript/JavaScript
```typescript
import { Colors, Gradients, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// Utilisation
const primaryColor = Colors.light.primary; // '#6366f1'
const cardStyle = {
  backgroundColor: Colors.light.card,
  borderRadius: BorderRadius.lg,
  boxShadow: Shadows.lg,
};
```

### CSS Variables
```css
/* Importer le fichier theme.css */
@import './styles/theme.css';

/* Utilisation */
.my-component {
  color: var(--color-text);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

## 🎯 Classes utilitaires CSS

Le fichier `theme.css` inclut des classes utilitaires prêtes à l'emploi :

- `.theme-primary` - Couleur primaire
- `.theme-bg-primary` - Fond primaire
- `.theme-text` - Texte principal
- `.theme-text-secondary` - Texte secondaire
- `.theme-bg` - Fond principal
- `.theme-card` - Style de carte
- `.theme-input` - Style d'input
- `.theme-button` - Style de bouton

## 📐 Système de spacing

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

## 🔲 Border radius

- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `full`: 9999px

## 🌑 Support du dark mode

Le thème supporte automatiquement le dark mode via `@media (prefers-color-scheme: dark)`.

Pour forcer un thème spécifique, vous pouvez utiliser les classes CSS ou modifier les variables dans votre composant.

## 💡 Exemples d'utilisation

### React avec TypeScript
```tsx
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

function MyComponent() {
  return (
    <div style={{
      backgroundColor: Colors.light.card,
      borderRadius: BorderRadius.lg,
      boxShadow: Shadows.lg,
      padding: '16px',
    }}>
      <h1 style={{ color: Colors.light.primary }}>Titre</h1>
    </div>
  );
}
```

### CSS pur
```css
.my-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
  color: var(--color-text);
}

.my-button {
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  transition: all var(--transition-normal);
}

.my-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}
```

### Tailwind CSS (si utilisé)
Vous pouvez configurer Tailwind pour utiliser ces couleurs :
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
        },
      },
    },
  },
};
```

## 🎭 Cohérence avec le mobile

Ce thème est identique à celui utilisé dans `client/mobile/constants/theme.ts` pour garantir une expérience utilisateur cohérente entre mobile et web.

