import React from 'react';
import { Input } from '@/components/shadcn/ui/input';
import { Icon } from '@/components/ui/Icon';

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
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, icon, iconPosition = 'start', className, ...props }, ref) => {
    const isIconName = typeof icon === 'string';
    const hasIcon = !!icon;

    const defaultClassName =
      'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all';
    const inputClassName = className
      ? `${defaultClassName} ${className}`
      : defaultClassName;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={props.id} className="block text-sm text-gray-700">
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
                  className="text-gray-400"
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
                  className="text-gray-400"
                />
              ) : (
                <>{icon}</>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

TextField.displayName = 'TextField';
