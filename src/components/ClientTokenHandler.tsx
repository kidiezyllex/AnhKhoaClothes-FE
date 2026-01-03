"use client";

import { useEffect } from 'react';

interface ClientTokenHandlerProps {
  onTokenRetrieved?: (tokenData: { localStorage: string | null, cookie: string | null }) => void;
}

export default function ClientTokenHandler({ onTokenRetrieved }: ClientTokenHandlerProps) {
  useEffect(() => {
    const tokenLocal = localStorage.getItem("token");
    //                                                                                                                     Lấy token từ cookies
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    const accessToken = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
    
    //                                                                                                                     Gọi callback nếu được cung cấp
    if (onTokenRetrieved) {
      onTokenRetrieved({
        localStorage: tokenLocal,
        cookie: accessToken
      });
    }
  }, [onTokenRetrieved]);

  //                                                                                                                     Component này không render gì cả
  return null;
} 