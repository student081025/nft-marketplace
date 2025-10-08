import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead, useDisconnect } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../../const/addresses";
import { useState } from "react";
import {
  Container,
  Heading,
  Text,
  Box,
  Flex,
  VStack,
  Spacer,
} from "@chakra-ui/react";

export default function UserStatus() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const [newStatus, setNewStatus] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const {
    contract
  } = useContract(STATUS_CONTRACT_ADDRESS);

  const {
    data: myStatus,
    isLoading: isMyStatusLoading,
  } = useContractRead(contract, "getStatus", [address]);

  if (isMyStatusLoading) {
    return (
      <div>
      </div>
    );
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', maxWidth: '1440px', margin: '0 auto' }}>
      <div style={{ width: '100%', maxWidth: '1440px', padding: '0 1rem', margin: '0 auto' }}>

        {!isMyStatusLoading && myStatus && (
          <div style={{ margin: '1rem 0', padding: '1rem', background: '#ededed', borderRadius: '8px', color: 'black' }}>
            <p>{myStatus}</p>
          </div>
        )}

        <button style={{ background: 'green', borderRadius: '8px', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', marginTop: '1rem', marginBottom: '0rem' }} onClick={() => setIsStatusModalOpen(true)}>Update</button>

        {isStatusModalOpen && (
          <div style={{ borderRadius: "24px", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>New Status:</p>
                <button onClick={() => setIsStatusModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <textarea
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setCharacterCount(e.target.value.length);
                }}
                placeholder="Enter your status"
                style={{ width: '100%', height: '100px', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px' }}
              />
              <p style={{ textAlign: 'right', marginBottom: '1rem' }}>{characterCount}/140</p>
              <Web3Button
                style={{ background: 'green', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
                contractAddress={STATUS_CONTRACT_ADDRESS}
                action={(contract) => contract.call("setStatus", [newStatus])}
                isDisabled={characterCount === 0 || characterCount > 140}
                onSuccess={() => {
                  setIsStatusModalOpen(false);
                  setNewStatus("");
                }}
              >Update Status</Web3Button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};