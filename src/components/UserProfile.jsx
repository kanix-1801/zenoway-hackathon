import { useState, useEffect } from "react";
import UserInfo from "../components/UserInfo";
import EditProfile from "../components/EditProfile";
import Contract from "../Contract.json";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Modal } from "react-bootstrap";

function UserProfile() {
  function truncateAddress(address, startLength = 6, endLength = 4) {
    if (!address) {
      return "";
    }
    const truncatedStart = address.substr(0, startLength);
    const truncatedEnd = address.substr(-endLength);

    return `${truncatedStart}...${truncatedEnd}`;
  }

  const [userImage, setUserImage] = useState("");
  const [userName, setUserNmae] = useState("");
  const [userBio, setUserBio] = useState("");
  const [userFollowings, setUserFollowings] = useState("");
  const [userFollowers, setUserFollowers] = useState("");
  const [userPostsCount, setUserPostsCount] = useState("");
  const [followerUsers, setFollowerUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  const { address: userAddress } = useAccount();
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
    const bio = await contract.getUserBio(userAddress);
    const following = await contract.getFollowingsCount(userAddress);
    const follower = await contract.getFollowersCount(userAddress);
    const postsCount = await contract.getUserPostsCount(userAddress);
    const followersAddresses = await contract.getFollowersAddress(userAddress);
    const followingAddresses = await contract.getFollowingAddresses(
      userAddress
    );
    setUserImage(image);
    setUserNmae(name);
    setUserBio(bio);
    setUserFollowings(following.toNumber());
    setUserFollowers(follower.toNumber());
    setUserPostsCount(postsCount.toNumber());
    setFollowerUsers(followersAddresses);
    setFollowingUsers(followingAddresses);
  }

  const [showEdit, setShowEdit] = useState(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseEdit = () => setShowEdit(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const handleShowFollowers = () => setShowFollowers(true);
  const handleCloseFollowers = () => setShowFollowers(false);

  const [showFollowings, setShowFollowings] = useState(false);
  const handleShowFollowings = () => setShowFollowings(true);
  const handleCloseFollowings = () => setShowFollowings(false);

  useEffect(() => {
    handleReadDetails();
  }, []);

  return (
    <div className="right-sidebar-container">
      <div className="user-profile-info-box">
        {userFollowers === 0 ? null : (
          <Modal show={showFollowers} onHide={handleCloseFollowers}>
            <Modal.Header closeButton>
              <Modal.Title>Followers</Modal.Title>
            </Modal.Header>
            <div className="dialog-box" id="sc">
              <Modal.Body>
                {followerUsers
                  .slice(0)
                  .reverse()
                  .map((followerUsers, index) => {
                    return <UserInfo key={index} Address={followerUsers} />;
                  })}
              </Modal.Body>
            </div>
          </Modal>
        )}

        {userFollowings === 0 ? null : (
          <Modal show={showFollowings} onHide={handleCloseFollowings}>
            <Modal.Header closeButton>
              <Modal.Title>Following</Modal.Title>
            </Modal.Header>
            <div className="dialog-box" id="scroll-bar">
              <Modal.Body>
                {followingUsers
                  .slice(0)
                  .reverse()
                  .map((followingUsers, index) => {
                    return <UserInfo key={index} Address={followingUsers} />;
                  })}
              </Modal.Body>
            </div>
          </Modal>
        )}

        <img
          src={
            userImage === ""
              ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
              : userImage
          }
          alt="UserImage"
          className="user-profile-img"
        />

        <div className="user-details-box">
          <h5 className="profile-username">
            {userName === "" ? truncateAddress(userAddress) : userName}
          </h5>
          <p className="profile-userAddress">{truncateAddress(userAddress)}</p>

          <div
            className="user-stats d-flex justify-content-start rounded-3 p-2 mb-2"
            style={{
              backgroundColor: "#efefef",
              color: "#0e3a3a",
              width: "100%",
              alignItem: "center",
            }}
          >
            <div
              className="px-1"
              style={{
                width: "100%",
                // color: "#ffffe1",
              }}
            >
              <p className="small mb-1">Post</p>
              <p className="mb-0">{userPostsCount}</p>
            </div>

            <div
              className="px-1"
              style={{
                width: "100%",
                cursor: "pointer",
              }}
              onClick={handleShowFollowers}
            >
              <p className="small mb-1">Followers</p>
              <p className="mb-0">{userFollowers}</p>
            </div>
            <div
              className="px-1"
              style={{
                width: "100%",
                cursor: "pointer",
              }}
              onClick={handleShowFollowings}
            >
              <p className="small mb-1">Following</p>
              <p className="mb-0">{userFollowings}</p>
            </div>
          </div>

          <div className="bio">
            {userBio === "" ? "Hey there, I'm using Zenoway!" : userBio}
          </div>

          <div className="edit-profile-button" onClick={handleShowEdit}>
            {" "}
            Edit Profile
          </div>

          <Modal show={showEdit} onHide={handleCloseEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <EditProfile />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
