import React, { useState, useEffect } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Contract from "../Contract.json";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Modal } from "react-bootstrap";
import UserInfo from "./UserInfo";

function Post(props) {
  const [showLikes, setShowLikes] = useState(false);
  const handleCloseLikes = () => setShowLikes(false);
  const handleShowLikes = () => setShowLikes(true);
  const [likesUsers, setLikesUsers] = useState([]);

  const [isExpanded, setExpanded] = useState(false);

  function truncateAddress(address, startLength = 6, endLength = 4) {
    if (!address) {
      return "";
    }

    const truncatedStart = address.substr(0, startLength);
    const truncatedEnd = address.substr(-endLength);

    return `${truncatedStart}...${truncatedEnd}`;
  }

  function handleReadMoreClick() {
    setExpanded(true);
  }
  function handleReadLessClick() {
    setExpanded(false);
  }

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

  const { address: userAddress } = useAccount();
  const [isFollowingStatus, setFollowingStatus] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [userName, setUserNmae] = useState("");

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

    const status = await contract.isFollowing(
      userAddress,
      props.creatorAddress
    );

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

    const tx = await contract.followUser(props.creatorAddress, {
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

    const tx = await contract.unfollowUser(props.creatorAddress, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
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

    const image = await contract.getUserProfileImage(props.creatorAddress);
    const name = await contract.getUserName(props.creatorAddress);
    const allLikesUsers = await contract.getPostLikes(props.id);
    setLikesUsers(allLikesUsers);
    setUserImage(image);
    setUserNmae(name);
  }

  async function handleLike() {
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

    const tx = await contract.likePost(props.id, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  async function handleUnlike() {
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

    const tx = await contract.unlikePost(props.id, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  const [likes, setLikes] = useState(0);
  async function handleLikeCount() {
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

    const likesCount = await contract.getPostLikesCount(props.id);
    setLikes(likesCount.toNumber());
  }

  const [isLiked, setLiked] = useState(false);
  async function handleCheckLike() {
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

    const liked = await contract.hasLiked(props.id, userAddress);
    setLiked(liked);
  }

  useEffect(() => {
    handleFollowingStatus();
    handleReadDetails();
    handleLikeCount();
    handleCheckLike();
  }, []);

  return (
    <div className="post">
      <div className="post-header">
        <div className="head">
          <div className="head-box">
            <img
              src={
                userImage === ""
                  ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
                  : userImage
              }
              alt="UserImage"
              className="profile-img"
            />
            <div className="post-header-content">
              <span className="post-header-username">
                {userName === ""
                  ? truncateAddress(props.creatorAddress)
                  : userName}
              </span>
              <span className="time-duration">
                {timeSince(props.dateCreated.toNumber())} {"ago"}
              </span>
            </div>
          </div>

          <div className="action-button">
            {props.creatorAddress === userAddress ? null : isFollowingStatus ===
              true ? (
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
      </div>
      <div className="post-caption">
        {props.postCaption.length > 200 ? (
          isExpanded ? (
            <p>
              {props.postCaption}{" "}
              <span className="read-link" onClick={handleReadLessClick}>
                <br />
                less
              </span>
            </p>
          ) : (
            <p>
              {props.postCaption.substring(0, 200)}
              {"... "}
              <span className="read-link" onClick={handleReadMoreClick}>
                more
              </span>
            </p>
          )
        ) : (
          <p>{props.postCaption}</p>
        )}
      </div>
      <div className="post-middle">
        {props.addressOfImage === "" ? null : (
          <img
            className="post-image"
            src={props.addressOfImage}
            alt="User's Post"
          />
        )}
        <div className="post-footer">
          {likes === 0 ? null : (
            <Modal show={showLikes} onHide={handleCloseLikes}>
              <Modal.Header closeButton>
                <Modal.Title>Likes</Modal.Title>
              </Modal.Header>
              <div className="dialog-box" id="scroll-bar">
                <Modal.Body>
                  {likesUsers
                    .slice(0)
                    .reverse()
                    .map((likesUsers, index) => {
                      return <UserInfo key={index} Address={likesUsers} />;
                    })}
                </Modal.Body>
              </div>
            </Modal>
          )}
          <span style={{ cursor: "pointer" }}>
            {isLiked === true ? (
              <span onClick={handleUnlike} className="like-button">
                <ThumbUpIcon />
              </span>
            ) : (
              <span onClick={handleLike} className="like-button">
                <ThumbUpOutlinedIcon />
              </span>
            )}
            <span className="like-count" onClick={handleShowLikes}>
              {likes} {likes <= 1 ? "Like" : "Likes"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Post;
