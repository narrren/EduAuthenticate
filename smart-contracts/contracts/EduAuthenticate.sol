// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EduAuthenticate
 * @dev Institutional Blockchain Credentialing System
 *      - Privacy-first (Hashes only on chain)
 *      - Batch issuance
 *      - State-based revocation
 *      - Dual-Verification (Cert ID or Doc Hash)
 */
contract EduAuthenticate is AccessControl, ReentrancyGuard {
    bytes32 public constant UNIVERSITY_ADMIN_ROLE = keccak256("UNIVERSITY_ADMIN_ROLE");

    struct Certificate {
        bytes32 docHash;      // SHA-256 of StudentID + Degree + CertData OR IPFS CID
        address recipient;    // Optional student wallet
        uint256 issueDate;
        bool isRevoked;
        string metadataURI;   // IPFS link to encrypted metadata
        bool exists;
    }

    // Mapping from Certificate ID Hash (keccak256(certId)) to Certificate
    mapping(bytes32 => Certificate) public certificates;
    
    // Mapping from Document Hash to Certificate ID Hash (for purely file-based verification)
    mapping(bytes32 => bytes32) public docHashToCertIdHash;

    // Events for indexing
    event CertificateIssued(bytes32 indexed certIdHash, string certId, address indexed recipient, bytes32 docHash, string metadataURI);
    event CertificateRevoked(bytes32 indexed certIdHash, address indexed revoker, string reason);
    event AdminRoleTransferred(address indexed oldAdmin, address indexed newAdmin);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UNIVERSITY_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Issue a single certificate
     * @param _certId Unique Certificate ID (e.g. "EDU-2024-001")
     * @param _docHash Privacy-preserving hash of content
     * @param _recipient Student's wallet address (or address(0))
     * @param _metadataURI URI for JSON metadata on IPFS
     */
    function issueCertificate(
        string memory _certId,
        bytes32 _docHash,
        address _recipient,
        string memory _metadataURI
    ) public onlyRole(UNIVERSITY_ADMIN_ROLE) nonReentrant {
        bytes32 certIdHash = keccak256(abi.encodePacked(_certId));
        require(!certificates[certIdHash].exists, "Certificate ID already exists");
        require(docHashToCertIdHash[_docHash] == bytes32(0), "Document hash already registered");

        certificates[certIdHash] = Certificate({
            docHash: _docHash,
            recipient: _recipient,
            issueDate: block.timestamp,
            isRevoked: false,
            metadataURI: _metadataURI,
            exists: true
        });

        docHashToCertIdHash[_docHash] = certIdHash;

        emit CertificateIssued(certIdHash, _certId, _recipient, _docHash, _metadataURI);
    }

    /**
     * @notice Batch issue certificates to save gas
     */
    function issueBatch(
        string[] memory _certIds,
        bytes32[] memory _docHashes,
        address[] memory _recipients,
        string[] memory _metadataURIs
    ) external onlyRole(UNIVERSITY_ADMIN_ROLE) nonReentrant {
        require(_certIds.length == _docHashes.length, "Length mismatch: docHashes");
        require(_certIds.length == _recipients.length, "Length mismatch: recipients");
        require(_certIds.length == _metadataURIs.length, "Length mismatch: metadataURIs");

        for (uint256 i = 0; i < _certIds.length; i++) {
            issueCertificate(_certIds[i], _docHashes[i], _recipients[i], _metadataURIs[i]);
        }
    }

    /**
     * @notice Revoke a certificate
     * @param _certId The unique certificate ID to revoke
     * @param _reason Reason for revocation (internal audit log)
     */
    function revokeCertificate(string memory _certId, string memory _reason) external onlyRole(UNIVERSITY_ADMIN_ROLE) {
        bytes32 certIdHash = keccak256(abi.encodePacked(_certId));
        require(certificates[certIdHash].exists, "Certificate does not exist");
        require(!certificates[certIdHash].isRevoked, "Already revoked");

        certificates[certIdHash].isRevoked = true;
        emit CertificateRevoked(certIdHash, msg.sender, _reason);
    }

    /**
     * @notice Verify a certificate by ID
     * @param _certId Certificate ID
     * @return isValid True if exists and not revoked
     * @return docHash The document hash for client-side validation
     * @return metadataURI IPFS URI
     * @return issueDate Date of issuance
     */
    function verifyCertificate(string memory _certId) external view returns (bool isValid, bytes32 docHash, string memory metadataURI, uint256 issueDate) {
         bytes32 certIdHash = keccak256(abi.encodePacked(_certId));
         if (!certificates[certIdHash].exists) return (false, bytes32(0), "", 0);
         
         Certificate memory cert = certificates[certIdHash];
         return (!cert.isRevoked, cert.docHash, cert.metadataURI, cert.issueDate);
    }

    /**
     * @notice Verify a certificate by Document Hash (Reverse lookup)
     * @param _docHash The hash of the PDF file
     * @return isValid True if exists and not revoked
     * @return certIdHash The internal hash of the cert ID
     */
    function verifyByDocHash(bytes32 _docHash) external view returns (bool isValid, bytes32 certIdHash) {
        certIdHash = docHashToCertIdHash[_docHash];
        if (certIdHash == bytes32(0)) return (false, bytes32(0));

        Certificate memory cert = certificates[certIdHash];
        return (!cert.isRevoked, certIdHash);
    }
}
