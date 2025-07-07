// components/AlertModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface AlertModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  onConfirm?: () => void;
}

export default function AlertModal({
  isOpen,
  onOpenChange,
  title = "Alerta",
  message = "¿Estás seguro de realizar esta acción?",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancelButton = true,
  onConfirm,
}: AlertModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <p>{message}</p>
          </ModalBody>
          <ModalFooter>
            {showCancelButton && (
              <Button color="danger" variant="light" onPress={() => onOpenChange(false)}>
                {cancelText}
              </Button>
            )}
            <Button
              color="primary"
              onPress={() => {
                onConfirm?.();
                onOpenChange(false);
              }}
            >
              {confirmText}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
