import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Public";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Contract from "../Contract.json";
import { ethers } from "ethers";
import { Modal } from "react-bootstrap";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import axios from "axios";

function LeftSidebar() {
  const { address: userAddress } = useAccount();
  const [userImage, setUserImage] = useState("");
  const [userName, setUserNmae] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
  const [displayImage, setDisplayImage] = useState(null);
  const handleShow = () => setShow(true);

  function truncateAddress(address, startLength = 6, endLength = 4) {
    if (!address) {
      return "";
    }

    const truncatedStart = address.substr(0, startLength);
    const truncatedEnd = address.substr(-endLength);

    return `${truncatedStart}...${truncatedEnd}`;
  }

  const [caption, setCaption] = useState("");
  function handleCaptionChange(event) {
    setCaption(event.target.value);
  }

  function handleDrop(event) {
    event.preventDefault();
    const img = event.dataTransfer.files[0];
    setDisplayImage(URL.createObjectURL(img));
    setImage(img);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleClick(event) {
    event.preventDefault();
    document.getElementById("upload-file").click();
  }

  function handleImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setDisplayImage(URL.createObjectURL(img));
      setImage(event.target.files[0]);
    }
  }

  const handleClose = () => {
    setShow(false);
    setImage("");
    setDisplayImage(null);
    setCaption("");
  };

  async function uploadPost() {
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

    const data = new FormData();
    data.append("file", image);
    let imgUrl = "";

    try {
      if (image) {
        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: "52a084fdd2c59360dcb7",
              pinata_secret_api_key:
                "8ce0d49080a717d547482ac09191e276dd4cdbe49e67200313cd82c9cd6d7cfd",
            },
          }
        );
        imgUrl = "https://gateway.ipfs.io/ipfs/" + response.data.IpfsHash;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        zenowayContract.contractAddress,
        zenowayContract.contractAbi,
        signer
      );

      const createPost = async (url, postCaption) => {
        const tx = await contract.createPost(url, postCaption);
        await tx.wait();
      };

      await createPost(imgUrl, caption, { gasLimit: 300000 });
      setCaption("");
      setImage(null);
      setDisplayImage(null);
      handleClose();
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Unable to Create Post!");
    }
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

    const image = await contract.getUserProfileImage(userAddress);
    const name = await contract.getUserName(userAddress);
    const notificationCount = await contract.getNotificationCount(userAddress);
    setNotificationsCount(notificationCount.toNumber());
    setUserImage(image);
    setUserNmae(name);
  }

  useEffect(() => {
    handleReadDetails();
  }, []);

  return (
    <div className="left-sidebar-container">
      <Link
        to={"/profile"}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="left-sidebar-user-info-box">
          <div className="leftsidebar-profile-img-box">
            <img
              className="leftsidebar-profile-img"
              src={
                userImage === ""
                  ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
                  : userImage
              }
              alt="UserImage"
            />
          </div>
          <br />
          <div className="leftsidebar-user-info-detail-content">
            <span className="post-header-username">
              {userName === "" ? truncateAddress(userAddress) : userName}
            </span>
            <span className="post-header-useraddress">
              {truncateAddress(userAddress)}
            </span>
          </div>
        </div>
      </Link>
      <div className="left-sidebar-button-container">
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div className="left-sidebar-button">
            <div>
              <HomeIcon className="left-sidebar-button-icon" />
              <span className="left-sidebar-text">Home</span>
            </div>
          </div>
        </Link>

        <Link
          to={"/explore"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="left-sidebar-button">
            <div>
              <ExploreIcon className="left-sidebar-button-icon" />
              <span className="left-sidebar-text">Explore</span>
            </div>
          </div>
        </Link>

        <Link
          to={"/alert"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="left-sidebar-button">
            <div style={notificationsCount === 0 ? null : { color: "#f75656" }}>
              <NotificationsIcon className="left-sidebar-button-icon" />
              <span className="left-sidebar-text">Alerts</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Create Button */}
      <div className="left-sidebar-create-post-button" onClick={handleShow}>
        <div>
          <AddCircleOutlineIcon className="left-sidebar-button-icon" />
          <span className="left-sidebar-text">
            <span>Create</span>
            <span> Post</span>
          </span>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            {image && (
              <img
                src={displayImage}
                alt="Dropped"
                className="input-post-image"
              />
            )}
            {!image && (
              <div style={{ transform: "scale(3)" }}>
                <span>
                  <PermMediaOutlinedIcon style={{ marginBottom: "0.5rem" }} />
                </span>
                <div style={{ fontSize: "0.6rem" }}>
                  Drag Image here...
                  <br />
                  or
                  <br />
                  Click to choose Image...
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            className="post-image-input"
            id="upload-file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <textarea
            className="post-textarea"
            id="scroll-bar"
            rows="4"
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Write a post..."
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="post-button" onClick={uploadPost}>
            Post
          </div>
          <div className="close-button" onClick={handleClose}>
            Close
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default LeftSidebar;
