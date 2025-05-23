/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export declare namespace IEVMVaultFactory {
  export type CreateNewVaultParamsStruct = {
    name: string;
    symbol: string;
    underlying: string;
    protocolHelper: string;
    authority: string;
    initDepositAmount: BigNumberish;
    minDepositAmount: BigNumberish;
    maxDepositAmount: BigNumberish;
    deadline: BigNumberish;
  };

  export type CreateNewVaultParamsStructOutput = [
    string,
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    name: string;
    symbol: string;
    underlying: string;
    protocolHelper: string;
    authority: string;
    initDepositAmount: BigNumber;
    minDepositAmount: BigNumber;
    maxDepositAmount: BigNumber;
    deadline: BigNumber;
  };
}

export interface EVMVaultFactoryInterface extends utils.Interface {
  functions: {
    "CREATE_VAULT_TYPEHASH()": FunctionFragment;
    "collectFees(address,address)": FunctionFragment;
    "createNewVault((string,string,address,address,address,uint256,uint256,uint256,uint256),bytes)": FunctionFragment;
    "eip712Domain()": FunctionFragment;
    "getVaultAddress((string,string,address,address,address,uint256,uint256,uint256,uint256),bytes)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "signer()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateSigner(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "CREATE_VAULT_TYPEHASH"
      | "collectFees"
      | "createNewVault"
      | "eip712Domain"
      | "getVaultAddress"
      | "initialize"
      | "owner"
      | "renounceOwnership"
      | "signer"
      | "transferOwnership"
      | "updateSigner"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "CREATE_VAULT_TYPEHASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "collectFees",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createNewVault",
    values: [IEVMVaultFactory.CreateNewVaultParamsStruct, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "eip712Domain",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVaultAddress",
    values: [IEVMVaultFactory.CreateNewVaultParamsStruct, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "signer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSigner",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "CREATE_VAULT_TYPEHASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collectFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createNewVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "eip712Domain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVaultAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "signer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSigner",
    data: BytesLike
  ): Result;

  events: {
    "EIP712DomainChanged()": EventFragment;
    "Initialized(uint64)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "VaultCreated(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EIP712DomainChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultCreated"): EventFragment;
}

export interface EIP712DomainChangedEventObject {}
export type EIP712DomainChangedEvent = TypedEvent<
  [],
  EIP712DomainChangedEventObject
>;

export type EIP712DomainChangedEventFilter =
  TypedEventFilter<EIP712DomainChangedEvent>;

export interface InitializedEventObject {
  version: BigNumber;
}
export type InitializedEvent = TypedEvent<[BigNumber], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface VaultCreatedEventObject {
  vault: string;
  authority: string;
  shares: BigNumber;
}
export type VaultCreatedEvent = TypedEvent<
  [string, string, BigNumber],
  VaultCreatedEventObject
>;

export type VaultCreatedEventFilter = TypedEventFilter<VaultCreatedEvent>;

export interface EVMVaultFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: EVMVaultFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    CREATE_VAULT_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;

    collectFees(
      vault: string,
      receiver: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    createNewVault(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    eip712Domain(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, string, BigNumber[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
      }
    >;

    getVaultAddress(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    initialize(
      _signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    signer(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    updateSigner(
      _signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  CREATE_VAULT_TYPEHASH(overrides?: CallOverrides): Promise<string>;

  collectFees(
    vault: string,
    receiver: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  createNewVault(
    params: IEVMVaultFactory.CreateNewVaultParamsStruct,
    signature: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  eip712Domain(
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber, string, string, BigNumber[]] & {
      fields: string;
      name: string;
      version: string;
      chainId: BigNumber;
      verifyingContract: string;
      salt: string;
      extensions: BigNumber[];
    }
  >;

  getVaultAddress(
    params: IEVMVaultFactory.CreateNewVaultParamsStruct,
    signature: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    _signer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  updateSigner(
    _signer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    CREATE_VAULT_TYPEHASH(overrides?: CallOverrides): Promise<string>;

    collectFees(
      vault: string,
      receiver: string,
      overrides?: CallOverrides
    ): Promise<void>;

    createNewVault(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    eip712Domain(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, string, string, BigNumber[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
      }
    >;

    getVaultAddress(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(_signer: string, overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    signer(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSigner(_signer: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "EIP712DomainChanged()"(): EIP712DomainChangedEventFilter;
    EIP712DomainChanged(): EIP712DomainChangedEventFilter;

    "Initialized(uint64)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "VaultCreated(address,address,uint256)"(
      vault?: null,
      authority?: null,
      shares?: null
    ): VaultCreatedEventFilter;
    VaultCreated(
      vault?: null,
      authority?: null,
      shares?: null
    ): VaultCreatedEventFilter;
  };

  estimateGas: {
    CREATE_VAULT_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;

    collectFees(
      vault: string,
      receiver: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    createNewVault(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    eip712Domain(overrides?: CallOverrides): Promise<BigNumber>;

    getVaultAddress(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    signer(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    updateSigner(
      _signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CREATE_VAULT_TYPEHASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collectFees(
      vault: string,
      receiver: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    createNewVault(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    eip712Domain(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVaultAddress(
      params: IEVMVaultFactory.CreateNewVaultParamsStruct,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    signer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    updateSigner(
      _signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
