const handleLogout = async (router) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if(res) router.push('/login');
    
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default handleLogout