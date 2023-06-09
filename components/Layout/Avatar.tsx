import { FC } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
}

const Avatar: FC<AvatarProps> = ({
  className,
  src,
  alt,
  size = 2,
  onClick,
}) => {
  return (
    <div
      onClick={onClick && onClick}
      className={`w-10 h-10 rounded-full overflow-hidden shadow-lg ${
        className ? className : ""
      }`}
    >
      <img className="w-full h-full object-cover" src={src} alt={alt} />
    </div>
  );
};

export default Avatar;
