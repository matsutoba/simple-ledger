'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/ui/dialog';
import { cn } from '@/components/shadcn/ui/utils';
import { IconButton } from './IconButton';

type ModalSize = 'small' | 'medium' | 'large';

const sizeClasses: Record<ModalSize, string> = {
  small: 'sm:max-w-md',
  medium: 'sm:max-w-xl',
  large: 'sm:max-w-4xl',
};

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: ModalSize;
  dismissible?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  size = 'medium',
  children,
  footer,
  dismissible = false,
  className = '',
}) => {
  const handleOpenChange = (open: boolean) => {
    // dismissible=falseの場合、背景クリックでの閉じるのみブロック
    // Escapeキーと×ボタンは常に有効
    if (!dismissible && !open) {
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Escapeキー（open=false）と×ボタン（open=false）は常に許可
        if (!open) {
          onOpenChange(false);
          return;
        }
        handleOpenChange(open);
      }}
    >
      <DialogContent
        className={cn('border-gray-300', sizeClasses[size], className)}
        hideCloseButton={!dismissible}
        onPointerDownOutside={
          dismissible
            ? undefined
            : (e) => {
                e.preventDefault();
              }
        }
      >
        <div className="relative">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {!dismissible && (
            <div
              className="absolute top-[-24px] right-[-24px] rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none p-2"
              aria-label="Close"
            >
              <IconButton
                name="x"
                icon="x"
                variant="ghost"
                color="secondary"
                onClick={() => onOpenChange(false)}
              />
            </div>
          )}
        </div>
        <div className="py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
};
