import React from 'react';
import './MaterialIcon.css';

interface MaterialIconProps {
  /** Nome do ícone (ex: 'home', 'settings', 'person') */
  name: string;
  /** Tipo do ícone - padrão é 'outlined' */
  variant?: 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';
  /** Tamanho do ícone */
  size?: 'small' | 'medium' | 'large' | number;
  /** Classe CSS adicional */
  className?: string;
  /** Cor do ícone */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'disabled' | 'white' | 'muted' | string;
  /** Handler de clique */
  onClick?: () => void;
  /** Título para acessibilidade */
  title?: string;
}

/**
 * Componente para renderizar ícones do Google Material Icons
 * 
 * @example
 * <MaterialIcon name="home" />
 * <MaterialIcon name="settings" variant="filled" size="large" />
 * <MaterialIcon name="person" color="primary" onClick={handleClick} />
 */
const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  variant = 'outlined',
  size = 'medium',
  className = '',
  color,
  onClick,
  title,
}) => {
  // Determinar a classe CSS baseada no variant
  const getIconClass = () => {
    switch (variant) {
      case 'filled':
        return 'material-icons';
      case 'outlined':
        return 'material-symbols-outlined';
      case 'rounded':
        return 'material-symbols-rounded';
      case 'sharp':
        return 'material-symbols-sharp';
      case 'two-tone':
        return 'material-icons-two-tone';
      default:
        return 'material-symbols-outlined';
    }
  };

  // Construir classes CSS
  const buildClasses = () => {
    const classes = [
      getIconClass(),
      'material-icon'
    ];

    // Adicionar classe de tamanho se for string
    if (typeof size === 'string') {
      classes.push(`material-icon--${size}`);
    }

    // Adicionar classe de cor se for uma cor do tema
    if (color && !color.startsWith('#') && !color.startsWith('rgb') && !color.startsWith('var(')) {
      classes.push(`material-icon--${color}`);
    }

    // Adicionar classe de clicável
    if (onClick) {
      classes.push('material-icon--clickable');
    }

    // Adicionar classes customizadas
    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  };

  // Construir estilo inline apenas para casos específicos (números customizados)
  const hasCustomSize = typeof size === 'number';
  const hasCustomColor = color && (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('var('));

  const iconProps: any = {
    className: buildClasses(),
    onClick,
    title,
    'aria-label': title || name,
    tabIndex: onClick ? 0 : undefined,
    onKeyDown: onClick ? (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    } : undefined
  };

  // Apenas adicionar style se realmente necessário
  if (hasCustomSize || hasCustomColor) {
    const style: React.CSSProperties = {};
    if (hasCustomSize) style.fontSize = `${size}px`;
    if (hasCustomColor) style.color = color;
    iconProps.style = style;
  }

  return (
    <span {...iconProps}>
      {name}
    </span>
  );
};

export default MaterialIcon;
