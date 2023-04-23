import UserInfo from "./UserInfo";

function RightSidebar() {
  return (
    <div className="right-sidebar-container">
      <h6 className="right-sidebar-heading">Follow Us</h6>
      <UserInfo Address="0xA4ddE5A879428f8168Ca86Af3f6935d63ffD0BC7" />
      <UserInfo Address="0x1423aaEb738D9760E83Cd2aCDB6631aaa271367d" />
      <UserInfo Address="0xfD50dA1c6852ED6d3B93Ac63E8F86643975a0fA1" />
    </div>
  );
}
export default RightSidebar;
