import Image from 'next/image';
import ShopsImage from '@/app/ui/image/Shops.png';

export default function ShopsLogo() {
  const style = {
    zIndex: 1,
  };

  return (
    <Image src={ShopsImage} alt="Cymbal Shops" style={style} priority={true} />
  );
}
