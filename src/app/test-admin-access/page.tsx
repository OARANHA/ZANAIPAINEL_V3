'use client';

import { useEffect, useState } from 'react';

export default function TestAdminAccess() {
  const [cookies, setCookies] = useState('');
  const [accessResult, setAccessResult] = useState('');

  const checkCookies = () => {
    setCookies(document.cookie);
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    checkCookies();
  };

  const testAdminAccess = async () => {
    try {
      const response = await fetch('/admin', {
        method: 'HEAD',
        redirect: 'manual'
      });
      setAccessResult(`Status: ${response.status}, Redirect: ${response.headers.get('location')}`);
    } catch (error) {
      setAccessResult(`Error: ${error}`);
    }
  };

  useEffect(() => {
    checkCookies();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Teste de Acesso Admin</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Cookies Atuais:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">{cookies || 'Nenhum cookie'}</pre>
        </div>

        <div className="space-x-4 flex flex-wrap gap-2">
          <button 
            onClick={checkCookies}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Verificar Cookies
          </button>
          
          <button 
            onClick={clearAllCookies}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Limpar Todos os Cookies
          </button>
          
          <button 
            onClick={testAdminAccess}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Testar Acesso /admin
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resultado do Teste:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">{accessResult || 'Nenhum teste realizado'}</pre>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Links de Teste:</h2>
          <div className="space-y-2">
            <a href="/admin" className="block text-red-600 hover:text-red-800">
              Acessar /admin (deveria redirecionar para login)
            </a>
            <a href="/admin/login" className="block text-blue-600 hover:text-blue-800">
              Acessar /admin/login (público)
            </a>
            <a href="/login" className="block text-gray-600 hover:text-gray-800">
              Acessar /login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}