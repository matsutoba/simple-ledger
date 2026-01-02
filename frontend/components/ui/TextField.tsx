import React from 'react';
import { Input } from '@/components/shadcn/ui/input';
import { Icon } from '@/components/ui/Icon';
import { formControlColors } from '@/theme/colors';

type IconName =
  | 'lock'
  | 'mail'
  | 'eye'
  | 'eyeOff'
  | 'menu'
  | 'search'
  | 'settings'
  | 'logout'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'check'
  | 'x'
  | 'chevronDown'
  | 'chevronUp'
  | 'arrowRight'
  | 'home';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconName | React.ComponentType<{ className?: string }>;
  iconPosition?: 'start' | 'end';
  errorMessage?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { label, icon, iconPosition = 'start', className, errorMessage, ...props },
    ref,
  ) => {
    const isIconName = typeof icon === 'string';
    const hasIcon = !!icon;

    const defaultClassName = [
      'w-full',
      'pl-10',
      'pr-4',
      'py-3',
      'border',
      formControlColors.border,
      'rounded-lg',
      formControlColors.focusRing,
      formControlColors.focusBorder,
      'outline-none',
      'transition-all',
    ].join(' ');
    const inputClassName = className
      ? `${defaultClassName} ${className}`
      : defaultClassName;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm ${formControlColors.label}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && iconPosition === 'start' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isIconName ? (
                <Icon
                  name={icon as IconName}
                  size={20}
                  className={formControlColors.icon}
                />
              ) : (
                <>{icon}</>
              )}
            </div>
          )}
          <Input
            ref={ref}
            className={`${hasIcon && iconPosition === 'start' ? 'pl-10' : ''} ${
              hasIcon && iconPosition === 'end' ? 'pr-10' : ''
            } ${inputClassName}`}
            {...props}
          />
          {hasIcon && iconPosition === 'end' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {isIconName ? (
                <Icon
                  name={icon as IconName}
                  size={20}
                  className={formControlColors.icon}
                />
              ) : (
                <>{icon}</>
              )}
            </div>
          )}
        </div>
        {errorMessage && (
          <p className={`${formControlColors.error} text-sm`}>{errorMessage}</p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
