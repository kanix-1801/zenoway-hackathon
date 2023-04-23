import React, { useState, useEffect } from "react";
import Contract from "../Contract.json";
import { ethers } from "ethers";

function NotificationBox(props) {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserNmae] = useState("");

  function timeSince(date) {
    var seconds = Math.floor(Date.now() / 1000 - date);

    var interval = seconds / 31536000;

    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " year";
      } else {
        return Math.floor(interval) + " years";
      }
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " month";
      } else {
        return Math.floor(interval) + " months";
      }
    }
    interval = seconds / 86400;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " day";
      } else {
        return Math.floor(interval) + " days";
      }
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " hr";
      } else {
        return Math.floor(interval) + " hrs";
      }
    }
    interval = seconds / 60;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " min";
      } else {
        return Math.floor(interval) + " mins";
      }
    }
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + " sec";
    } else {
      return Math.floor(interval) + " secs";
    }
  }

  function truncateAddress(address, startLength = 6, endLength = 4) {
    if (!address) {
      return "";
    }
    const truncatedStart = address.substr(0, startLength);
    const truncatedEnd = address.substr(-endLength);
    return `${truncatedStart}...${truncatedEnd}`;
  }

  async function handleReadDetails() {
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

    const image = await contract.getUserProfileImage(props.address);
    const name = await contract.getUserName(props.address);
    setUserImage(image);
    setUserNmae(name);
  }

  useEffect(() => {
    handleReadDetails();
  }, []);

  return (
    <div className="notification-box">
      <img
        src={
          userImage === ""
            ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
            : userImage
        }
        alt="UserImage"
        className="notification-profile-img"
      />

      <div className="notification-content-box">
        <span className="notification-content">
          {userName === "" ? truncateAddress(props.address) : userName}
          {props.action === "like" ? " liked your post!" : " is following you!"}
        </span>
        <span>
          {timeSince(props.time)} {"ago"}
        </span>
      </div>
    </div>
  );
}

export default NotificationBox;
