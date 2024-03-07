'use client';

import { PropsWithChildren, createContext, useContext } from 'react';

import { UserCardModal } from '@/components/auth/UserCardModal';
import { ColdStoragePluginActions } from '@/plugin';
import {
  AccountLoupeActions,
  MultiOwnerModularAccount,
  MultiOwnerPluginActions,
  PluginManagerActions
} from '@alchemy/aa-accounts';
import { AlchemySigner, AlchemySmartAccountClient, BaseAlchemyActions } from '@alchemy/aa-alchemy';
import React, { useState } from 'react';
import { Chain, Transport } from 'viem';

export enum ModalType {
  USER_CARD = 'USER_CARD'
}

const MODAL_COMPONENTS: { [key: string]: React.FC<any> } = {
  [ModalType.USER_CARD]: UserCardModal
};

type AlchemyClientType = AlchemySmartAccountClient<
  Transport,
  Chain | undefined,
  MultiOwnerModularAccount<AlchemySigner>,
  BaseAlchemyActions<Chain | undefined, MultiOwnerModularAccount<AlchemySigner>> &
    MultiOwnerPluginActions<MultiOwnerModularAccount<AlchemySigner>> &
    ColdStoragePluginActions<MultiOwnerModularAccount<AlchemySigner>> &
    PluginManagerActions<MultiOwnerModularAccount<AlchemySigner>> &
    AccountLoupeActions<MultiOwnerModularAccount<AlchemySigner>>
>;

export type GlobalModalStore = {
  modalType?: ModalType;
  modalProps?: any;
  client: AlchemyClientType | undefined;
};

type GlobalModalContext = {
  showModal: (modalType: ModalType, modalProps?: any) => void;
  hideModal: () => void;
  setClient: (client: AlchemyClientType | undefined) => void;
  store: GlobalModalStore;
};

const initalState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
  setClient: () => {},
  store: { client: undefined }
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModalProvider = ({ children }: PropsWithChildren) => {
  const [store, setStore] = useState<GlobalModalStore>({ client: undefined });
  const { modalType, modalProps, client } = store;

  const setClient = (client: AlchemyClientType | undefined) => {
    setStore({
      ...store,
      client
    });
  };

  const showModal = (modalType: ModalType, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: undefined,
      modalProps: undefined
    });
  };

  const render = () => {
    if (!modalType || !MODAL_COMPONENTS[modalType]) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];
    return <ModalComponent id="global-modal" client={client} {...modalProps} />;
  };

  return (
    <GlobalModalContext.Provider value={{ store, setClient, showModal, hideModal }}>
      {render()}
      {children}
    </GlobalModalContext.Provider>
  );
};
