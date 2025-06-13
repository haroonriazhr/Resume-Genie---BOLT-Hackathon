import { cn } from '@/lib/utils';

const BoltButton = () => (
  <a
    href="https://bolt.new"
    target="_blank"
    rel="noopener noreferrer"
    title="Powered By Bolt"
    className={cn(
      'bolt-button',
      'fixed z-50 top-[85%] right-[.5vw] w-[6vw] h-[6vw]',
      'bg-contain bg-no-repeat bg-center',
      'cursor-pointer transition-opacity duration-300'
    )}
  >
    <img className='w-[90%]' src="/bolt.png" alt="Powered by Bolt" />
  </a>
);

export default BoltButton;