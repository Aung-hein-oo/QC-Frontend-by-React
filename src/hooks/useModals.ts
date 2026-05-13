import { useState, useCallback } from 'react';
import { ConfirmModalType } from '../components/common/ConfirmModal';

interface ConfirmModalState {
  isOpen: boolean;
  type: ConfirmModalType;
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void | Promise<void>;
  showCancel: boolean;
}

interface SuccessModalState {
  isOpen: boolean;
  title: string;
  message?: string;
  action?: string;
  actionColor: string;
  customMessage: string;
}

export const useModals = () => {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showCancel: true,
  });

  const [successModal, setSuccessModal] = useState<SuccessModalState>({
    isOpen: false,
    title: '',
    message: '',
    action: '' as string,
    actionColor: 'emerald',
    customMessage: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
    type: ConfirmModalType = 'info',
    showCancel: boolean = true
  ) => {
    setConfirmModal({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      cancelText,
      showCancel,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await onConfirm();
        } finally {
          setIsLoading(false);
          closeConfirm();
        }
      },
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback((
    title: string,
    message?: string,
    action?: string,
    actionColor: string = 'emerald',
    customMessage?: string
  ) => {
    setSuccessModal({
      isOpen: true,
      title,
      message,
      action,
      actionColor,
      customMessage : customMessage || '',
    });
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmModal: {
      ...confirmModal,
      isLoading,
    },
    successModal,
    showConfirm,
    closeConfirm,
    showSuccess,
    closeSuccess,
  };
};