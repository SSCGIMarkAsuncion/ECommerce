import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export default function BestSeller({ bestSellers: [] }) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1025 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 641 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2
    }
  };
  return <Carousel className="h-[300px]" responsive={responsive}>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>

    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
  </Carousel>;
}