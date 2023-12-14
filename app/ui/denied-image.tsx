import  Image from 'next/image';
import deniedImage from '@/app/ui/img/access-denied.jpg';

export default function DeniedImage() {
  const style = {
    opacity: 0.7,
    zIndex: -1
  };

  return (
    <Image
      src={deniedImage}
      alt="Do Not Enter sign"
      fill={true}
      style={style}
      priority={true}
    />
  );
}