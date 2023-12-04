import  Image from 'next/image';
import MTImage from '@/app/ui/img/mountain-truck.jpg';

export default function MountainImage() {
  const style = {
    opacity: 0.7,
    zIndex: -1
  };

  return (
    <Image
      src={MTImage}
      alt="Truck driving through the mountains"
      fill={true}
      style={style}
      priority={true}
    />
  );
}