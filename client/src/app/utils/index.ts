export const checkUserInSessionStorage = (): boolean => {
  try {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return !!cookies['user'];
  } catch (error) {
    console.error("Error accessing cookies:", error);
    return false;
  }
};


export const getUserFromCookies = (): any | null => {
  if(typeof window === 'undefined') return null;
  const cookieObj = document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, ...v] = cookie.split('=');
    acc[key.trim()] = decodeURIComponent(v.join('='));
    return acc;
  }, {} as Record<string, string>);
  if(cookieObj['user']) {
    return JSON.parse(cookieObj['user']);
  }
  return null;

}

export const setUserInCookies = (user: any) => {
  document.cookie = JSON.stringify(user);
}
