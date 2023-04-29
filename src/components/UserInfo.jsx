import React, { useState, useEffect } from "react";
import Contract from "../Contract.json";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

function UserInfo(props) {
  const { address: userAddress } = useAccount();
  const [userImage, setUserImage] = useState("");
  const [userName, setUserNmae] = useState("");

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

    const image = await contract.getUserProfileImage(props.Address);
    const name = await contract.getUserName(props.Address);
    setUserImage(image);
    setUserNmae(name);
  }

  const [isFollowingStatus, setFollowingStatus] = useState(false);
  async function handleFollowingStatus() {
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
    const status = await contract.isFollowing(userAddress, props.Address);
    setFollowingStatus(status);
  }

  async function handleFollowUser() {
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

    const tx = await contract.followUser(props.Address, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  async function handleUnfollowUser() {
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

    const tx = await contract.unfollowUser(props.Address, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  useEffect(() => {
    handleReadDetails();
    handleFollowingStatus();
  }, []);
  return (
    <div className="right-sidebar-user-info-box">
      <img
        src={
          userImage === ""
            ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
            : userImage
        }
        alt="UserImage"
        className="rightsidebar-profile-img"
      />

      <div className="rightsidebar-user-info-detail-content">
        <span className="post-header-username">
          {userName === "" ? truncateAddress(props.Address) : userName}
        </span>
        <span className="post-header-useraddress">
          {truncateAddress(props.Address)}
        </span>
      </div>
      <div className="rightsidebar-follow-icon">
        {props.Address === userAddress ? null : isFollowingStatus === true ? (
          <span className="follow-button" onClick={handleUnfollowUser}>
            <GroupRemoveIcon />
          </span>
        ) : (
          <span className="follow-button" onClick={handleFollowUser}>
            <GroupAddIcon />
          </span>
        )}
      </div>
    </div>
  );
}
export default UserInfo;
