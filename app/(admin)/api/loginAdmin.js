
import { removeUserCacheHistory } from '@/app/utils/caching';
import { fetcher } from '@/app/(admin)/utils/fetcher';
const loginAdmin = async (username, email, password, remember) => {

  if(email !== '' && email.includes('@')){
    username = ''
  }


  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/login`;
    await removeUserCacheHistory()
    return await fetcher(url, 'POST', { username, email, password, remember });
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error.message;
  }
};

export default loginAdmin;
