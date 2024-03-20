import clsx from 'clsx';
import {ButtonProps} from '@/app/lib/definitions';

export default function Button({children, className, ...rest}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex justify-center bg-red-600 hover:bg-red-800 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}
