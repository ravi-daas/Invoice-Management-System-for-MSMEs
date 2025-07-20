import { createClient, deleteClientById, updateClientById } from "@/apis/clients";
import { ClientData } from "@/types";
import { createContext, useState, useContext, ReactNode } from "react";

type ClientContextType = {
  clients: ClientData[];
  addClient: (data: ClientData) => void;
  updateClient: (id: string, updatedData: Partial<ClientData>) => void;
  deleteClient: (id: string) => void;
  addClients: (clients: ClientData[]) => void;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<ClientData[]>([]);

  const addClient = (data: ClientData) => {
    setClients((prevClients) => [...prevClients, data]);
    createClient(data);
  };

  const addClients = (clients: ClientData[]) => {
    setClients(clients);
  };

  const updateClient = (id: string, updatedData: Partial<ClientData>) => {
    updateClientById(id, updatedData);
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === id ? { ...client, ...updatedData } : client
      )
    );
  };

  const deleteClient = (id: string) => {
    // console.log("Deleted client with id: ", id);
    deleteClientById(id);
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
  };

  return (
    <ClientContext.Provider
      value={{ clients, addClient, updateClient, deleteClient, addClients }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
