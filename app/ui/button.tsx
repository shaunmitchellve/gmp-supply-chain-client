import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'w-full flex justify-center bg-red-600 hover:bg-red-800 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition eas-in durraction-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}
