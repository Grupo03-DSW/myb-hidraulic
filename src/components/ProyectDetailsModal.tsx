import React from "react";
import { Proyecto } from "@/models/proyecto";
import { Button } from "@/components/ui/button";
import ProyectoDetails from "@/components/ProyectDetails";
import { Modal } from "@/components/Modal";

interface ProjectDetailsModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  proyecto: Proyecto;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  open,
  onClose,
  proyecto,
}) => {
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        onClose(false);
      }}
      className="w-full md:w-11/12 lg:w-2/3"
    >
      <div className="max-h-[80vh] w-full mx-5 overflow-y-auto rounded-lg">
        <div className="my-2">
          <h2>Detalles del Proyecto</h2>
        </div>

        <div>
          <ProyectoDetails proyecto={proyecto} />
        </div>
        <div className="flex justify-center my-4">
          <Button onClick={() => onClose(false)}>Cerrar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailsModal;
