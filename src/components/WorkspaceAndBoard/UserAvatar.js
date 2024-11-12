import Avatar from "react-avatar";

const UserAvatar = ({ firstName, lastName, profilePicture, size = "40", onClick }) => {
  return (
    <Avatar
      name={`${firstName} ${lastName}`}
      src={profilePicture}
      size={size}
      round={true}
      onClick={onClick}
    />
  );
};

export default UserAvatar;
