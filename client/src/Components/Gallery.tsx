import type { HTMLProps } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "../assets/image-gallery.css";

export interface GalleryProps extends HTMLProps<HTMLDivElement> {
  links: string[],
};

export default function Gallery({ links }: GalleryProps) {
  const images = links.map((link) => ({
    original: link,
    thumbnail: link
  }));

  return <ImageGallery
   showPlayButton={false}
   items={images} />;
}