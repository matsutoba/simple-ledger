import React from 'react';
import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/shadcn/ui/select';
import { Typography } from '@/components/ui/Typography';
import { formControlColors, bgColors } from '@/theme/colors';
import { cn } from '@/components/shadcn/ui/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectGroupType {
  label: string;
  options: SelectOption[];
}

interface SelectProps extends React.ComponentProps<typeof ShadcnSelect> {
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  groups?: SelectGroupType[];
  errorMessage?: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof ShadcnSelectItem>,
  React.ComponentPropsWithoutRef<typeof ShadcnSelectItem>
>(({ className, ...props }, ref) => (
  <ShadcnSelectItem
    ref={ref}
    className={cn(
      'hover:bg-gray-100 focus:bg-blue-100 focus:text-gray-900',
      className,
    )}
    {...props}
  />
));
SelectItem.displayName = 'SelectItem';

const SelectContent = React.forwardRef<
  React.ElementRef<typeof ShadcnSelectContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnSelectContent>
>(({ className, ...props }, ref) => (
  <ShadcnSelectContent
    ref={ref}
    className={cn(bgColors.white, formControlColors.border, className)}
    {...props}
  />
));
SelectContent.displayName = 'SelectContent';

export const Select = React.forwardRef<
  React.ElementRef<typeof ShadcnSelect>,
  SelectProps
>(
  (
    {
      label,
      placeholder = 'オプションを選択...',
      options,
      groups,
      errorMessage,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <Typography variant="caption" color="secondary" className="block">
            {label}
          </Typography>
        )}
        <ShadcnSelect disabled={disabled} {...props}>
          <SelectTrigger
            className={cn(
              formControlColors.border,
              formControlColors.focusRing,
              formControlColors.focusBorder,
              errorMessage && formControlColors.errorBorder,
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options && options.length > 0 && (
              <>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </>
            )}
            {groups && groups.length > 0 && (
              <>
                {groups.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </>
            )}
          </SelectContent>
        </ShadcnSelect>
        {errorMessage && (
          <Typography variant="caption" color="destructive">
            {errorMessage}
          </Typography>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
