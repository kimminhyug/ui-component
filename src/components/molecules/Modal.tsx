import { Fragment, type ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from '../../theme/ThemeContext';
import { cn } from '../../utils/cn';
import type { Stylable, ThemedComponent } from '../../types/common';

export interface ModalProps extends Stylable, ThemedComponent {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
}

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  closeOnOverlayClick = true,
  className,
  style,
  theme: themeOverride,
}: ModalProps) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.modal, ...themeOverride } : globalTheme.modal;
  const t = (theme ?? {}) as Record<string, string>;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeOnOverlayClick ? onClose : () => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={cn('fixed inset-0', t.overlay)} />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={cn(t.panel, className)} style={style}>
                {(title || description) && (
                  <div className="p-4">
                    {title && <Dialog.Title className={t.title}>{title}</Dialog.Title>}
                    {description && (
                      <Dialog.Description className={t.description}>
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}
                <div className="p-4 pt-0">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
