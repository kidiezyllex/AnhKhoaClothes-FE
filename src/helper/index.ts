import cookies from 'js-cookie';

export const setCookies = (accessToken: string) => {
  cookies.set('accessToken', accessToken);
  
  //                                                                                                                     Lưu token vào localStorage để có thể khôi phục sau khi reload
  try {
    const tokenString = JSON.stringify({ token: accessToken });
    localStorage.setItem('token', tokenString);
  } catch (error) {
    console.error('Lỗi khi lưu token vào localStorage:', error);
  }
};

export async function loadConfig(url: string) {
  const resp = await fetch(url);

  const data = await resp.json();

  return data;
}