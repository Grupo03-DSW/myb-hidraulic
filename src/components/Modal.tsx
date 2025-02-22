"use client";
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (onClose === undefined) return;

    const handleClickOutside = (e: MouseEvent) => {
      // ✅ Evitar cierre si el clic es en un elemento superpuesto con data-ignore-modal
      const target = e.target as HTMLElement;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !target.closest("[data-ignore-modal]")
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="m-0 fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className={`${
          className && className
        } bg-background p-8 rounded-lg shadow-lg`}
      >
        {children}
      </div>
    </div>
  );
}
