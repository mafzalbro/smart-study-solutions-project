import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { GrTest } from 'react-icons/gr';

export default function SidebarHeader() {
  return (
    <div className='flex justify-between'>
      <Link href='/chat' className='flex gap-2 items-center justify-center'>
        <h2 className="text-xl" title='Chat Home'><FaHome /> </h2>
      </Link>
      <Link href="/chat/test-api">
        <span className='flex items-center gap-2 text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-500'>
          <GrTest />
          Test API
        </span>
      </Link>
    </div>
  );
}
