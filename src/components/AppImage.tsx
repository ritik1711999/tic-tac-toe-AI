import React from "react";

interface AppImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src: string;
  alt?: string;
}

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}: AppImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/assets/images/no_image.png";
      }}
      {...props}
    />
  );
}

export default Image;
