import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import Post from "../components/Post";
import Suggestionbar from "../components/Suggestionbar";
import Contract from "../Contract.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function Home() {
  const [posts, setPosts] = useState([]);
  const { address: userAddress } = useAccount();

  async function handleReadPost() {
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

    const allPost = await contract.readFollowingPosts(userAddress);
    setPosts(allPost);
  }

  useEffect(() => {
    handleReadPost();
  }, []);
  return (
    <>
      <Header />
      <div className="main">
        <LeftSidebar />
        <div className="post-container container">
          {posts.length === 0 ? (
            <div className="warning">
              <Link
                to={"/explore"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span>
                  <ErrorOutlineIcon
                    style={{ transform: "scale(2)", margin: "1.5rem" }}
                  />
                </span>
                <br />
                <span>Follow People from explore page...</span>
              </Link>
            </div>
          ) : (
            posts
              .slice(0)
              .reverse()
              .map((post, index) => {
                return (
                  <Post
                    key={index}
                    id={Number(post.postId)}
                    creatorAddress={post.creatorAddress}
                    addressOfImage={post.imageAddress}
                    postCaption={post.postCaption}
                    dateCreated={post.timeCreated}
                  />
                );
              })
          )}
        </div>
        <Suggestionbar />
      </div>
    </>
  );
}

export default Home;
