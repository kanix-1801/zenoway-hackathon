import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import NotificationBox from "../components/NotificationBox";
import Suggestionbar from "../components/Suggestionbar";
import Contract from "../Contract.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import RefreshIcon from "@mui/icons-material/Refresh";

function Alert() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { address: userAddress } = useAccount();

  async function handleReadNotification() {
    let zenowayContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

    if (chainId === 80001) {
      zenowayContract = {
        contractAddress: Contract.MumbaiContractAddress,
        contractAbi: Contract.abi,
      };
    } else if (chainId === 8082) {
      zenowayContract = {
        contractAddress: Contract.ShardeumContractAddress,
        contractAbi: Contract.abi,
      };
    } else {
      zenowayContract = {
        contractAddress: Contract.SpoliaContractAddress,
        contractAbi: Contract.abi,
      };
    }

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const allNotificatiions = await contract.getUserNotifications(userAddress);
    setNotifications(allNotificatiions);

    const notificationCount = await contract.getNotificationCount(userAddress);
    setNotificationsCount(notificationCount.toNumber());
  }

  async function handleClearNotifications() {
    let zenowayContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

    if (chainId === 80001) {
      zenowayContract = {
        contractAddress: Contract.MumbaiContractAddress,
        contractAbi: Contract.abi,
      };
    } else if (chainId === 8082) {
      zenowayContract = {
        contractAddress: Contract.ShardeumContractAddress,
        contractAbi: Contract.abi,
      };
    } else {
      zenowayContract = {
        contractAddress: Contract.SpoliaContractAddress,
        contractAbi: Contract.abi,
      };
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      signer
    );

    const tx = await contract.clearNotifications({
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  useEffect(() => {
    handleReadNotification();
  }, []);

  function refresh() {
    window.location.reload();
  }

  return (
    <>
      <Header />
      <LeftSidebar />
      <div
        className="clear-notification-button-container"
        onClick={handleClearNotifications}
      >
        {notificationsCount === 0 ? null : (
          <span className="clear-button">Clear Notifications</span>
        )}
      </div>
      <div
        style={{ paddingLeft: "5%", paddingRight: "5%" }}
        className="notification-container"
      >
        {notificationsCount === 0 ? (
          <div className="warning notification-warning">
            <span onClick={refresh}>
              <RefreshIcon
                style={{
                  transform: "scale(2)",
                  margin: "1.5rem",
                  cursor: "pointer",
                }}
              />
            </span>
            <br />
            <span style={{ cursor: "pointer" }}>No Notifications Yet...</span>
          </div>
        ) : (
          notifications
            .slice(0)
            .reverse()
            .map((notification, index) => {
              return (
                <NotificationBox
                  key={index}
                  address={notification.userAddress}
                  action={notification.action}
                  time={notification.time.toNumber()}
                />
              );
            })
        )}
      </div>
      <Suggestionbar />
    </>
  );
}

export default Alert;
