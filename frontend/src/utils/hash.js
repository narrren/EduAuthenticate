import CryptoJS from 'crypto-js';

/**
 * Generates a SHA-256 hash of a file for privacy-preserving verification.
 * Does not upload the file anywhere.
 * @param {File} file - The file object from input or dropzone
 * @returns {Promise<string>} - The 0x-prefixed hex hash
 */
export const generateDocHash = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const fileData = event.target.result;
                // Convert ArrayBuffer to WordArray for CryptoJS
                const wordArray = CryptoJS.lib.WordArray.create(fileData);
                const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                resolve(`0x${hash}`);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Generates the Certificate ID hash as done in the smart contract.
 * Solidity: keccak256(abi.encodePacked(_certId)) -> effectively keccak/sha3 of the string bytes?
 * Wait, Solidity's keccak256 is not exactly SHA256. 
 * The smart contract uses `keccak256`. 
 * To match strictly, we should use `ethers.keccak256(ethers.toUtf8Bytes(certId))`.
 * 
 * However, the prompt asked for "Privacy-First Hashing... SHA-256 of combined Student ID...". 
 * But the Code I wrote in Solidity uses `keccak256` for the CertID mapping key and `bytes32 _docHash` (which is passed in).
 * 
 * Let's provide a helper for the DocHash (SHA256) and a helper for CertID (Keccak256 via ethers).
 */

import { keccak256, toUtf8Bytes } from 'ethers';

export const generateCertIdHash = (certId) => {
    return keccak256(toUtf8Bytes(certId));
};
