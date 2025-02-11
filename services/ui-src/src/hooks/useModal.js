import { useState } from "react";

const useModal = () => {
  const [dialogOpen, updateOpen] = useState(false);
  const showModal = () => {
    updateOpen(true);
  };
  const hideModal = () => {
    updateOpen(false);
  };

  return {
    dialogOpen,
    showModal,
    hideModal,
  };
};

export default useModal;
