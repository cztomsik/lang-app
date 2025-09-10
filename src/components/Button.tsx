import type { ComponentChildren } from 'preact';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'skip' | 'reset' | 'speak' | 'icon' | 'unstyled';

interface ButtonProps {
  variant?: ButtonVariant;
  children: ComponentChildren;
  onClick?: () => void;
  disabled?: boolean;
  class?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5',
  success: 'bg-gradient-to-br from-green-400 to-cyan-400 text-white hover:shadow-lg hover:-translate-y-0.5',
  danger: 'bg-gradient-to-br from-pink-400 to-red-500 text-white hover:shadow-lg hover:-translate-y-0.5',
  skip: 'bg-transparent text-gray-500 border-2 border-gray-300 hover:border-gray-500 hover:text-gray-600 hover:bg-gray-50',
  reset: 'bg-transparent text-gray-600 border-2 border-gray-300 hover:border-violet-500 hover:text-violet-500',
  speak:
    'bg-transparent hover:bg-gray-100 active:opacity-50 rounded-full p-2 min-w-10 h-10 flex items-center justify-center opacity-70 hover:opacity-100',
  icon: 'px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white hover:border-violet-500 focus:border-violet-500 focus:outline-none transition-colors duration-300 font-medium',
  unstyled: '',
};

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  class: className = '',
  title,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    variant === 'speak'
      ? variantStyles.speak
      : variant === 'icon'
        ? ''
        : variant === 'unstyled'
          ? ''
          : 'px-8 py-3 text-base font-medium rounded-lg transition-all duration-300 uppercase tracking-wider';

  const styles = variant === 'unstyled' ? className : `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button type={type} class={styles} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  );
}
