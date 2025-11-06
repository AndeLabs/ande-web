import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/ande.ico"
      alt="ANDE Network Logo"
      width={32}
      height={32}
      className="animate-float"
    />
  );
}
