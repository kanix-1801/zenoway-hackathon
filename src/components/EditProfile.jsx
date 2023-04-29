import React, { useState } from "react";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import axios from "axios";
import { ethers } from "ethers";
import Contract from "../Contract.json";

function EditProfile() {
  const [image, setImage] = useState("");
  const [displayImage, setDisplayImage] = useState(null);

  function handleImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setDisplayImage(URL.createObjectURL(img));
      setImage(event.target.files[0]);
    }
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

  async function updateImage() {
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

      const updateUserImage = async (url) => {
        const tx = await contract.setUserProfileImage(url);
        await tx.wait();
      };

      await updateUserImage(imgUrl, { gasLimit: 300000 });
      setImage(null);
      setDisplayImage(null);
    } catch (err) {
      console.log(err);
      alert("Unable to Upload Image");
    }
  }

  const [userName, setUserName] = useState("");
  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }

  async function updateName() {
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

    const tx = await contract.setUserName(userName, {
      gasLimit: 300000,
    });
    await tx.wait();
    setUserName("");
  }

  const [userBio, setUserBio] = useState("");
  function handleUserBioChange(event) {
    setUserBio(event.target.value);
  }

  async function updateBio() {
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

    const tx = await contract.setUserBio(userBio, {
      gasLimit: 300000,
    });
    await tx.wait();
    setUserBio("");
  }

  return (
    <>
      <div className="edit-page-box">
        <div className="flex-shrink-0" style={{ height: "10rem" }}>
          <div className="image-drop-down">
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
                <div style={{ transform: "scale(1.5)" }}>
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
          </div>

          <input
            type="file"
            className="Edit-img-box img-fluid"
            id="upload-file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="profile-update-button" onClick={updateImage}>
          Update Image
        </div>

        <hr />

        <input
          value={userName}
          type="text"
          placeholder="New Username"
          onChange={handleUserNameChange}
          className="profile-username-input"
        />

        <div className="profile-update-button" onClick={updateName}>
          Update Name
        </div>

        <hr />

        <textarea
          value={userBio}
          onChange={handleUserBioChange}
          id="scroll-bar"
          className="profile-bio-input"
          placeholder="New Bio"
        />

        <div className="profile-update-button" onClick={updateBio}>
          Update Bio
        </div>
      </div>
    </>
  );
}
export default EditProfile;
