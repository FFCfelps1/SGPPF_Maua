import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [modals, setModals] = useState({
    pesquisador: false,
    projeto: false,
    publicacao: false,
    financiamento: false,
  });

  const openModal = (type) => setModals(prev => ({ ...prev, [type]: true }));
  const closeModal = (type) => setModals(prev => ({ ...prev, [type]: false }));

  return (
    <UIContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
