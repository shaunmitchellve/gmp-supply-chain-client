import  Image from 'next/image';
import MTImage from '@/app/ui/img/field.jpg';

export default function FieldImage() {
  const style = {
    opacity: 0.7,
    zIndex: -1
  };

  return (
    <Image
      src={MTImage}
      alt="Wheat Field with wrong way sign"
      fill={true}
      style={style}
      priority={true}
    />
  );
}