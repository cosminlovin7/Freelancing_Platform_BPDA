import { contractAddress } from 'config';
// import json from 'abis/adder.abi.json';
import json from "abis/freelancing-sc.abi.json";
import {AbiRegistry, SmartContract, Address} from "@multiversx/sdk-core";

const abi = AbiRegistry.create(json);

export const _SmartContract = new SmartContract({
    address: new Address(contractAddress),
    abi
});