'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, Users, Activity } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

export default function WebSocketExample() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');

  // Simular conexão WebSocket
  useEffect(() => {
    // Em um ambiente real, aqui você conectaria ao WebSocket
    // const socket = new WebSocket('ws://localhost:3001');
    
    // Simulação de conexão
    const timer = setTimeout(() => {
      setIsConnected(true);
      setUsers([
        { id: '1', name: 'Sistema', status: 'online' },
        { id: '2', name: 'Usuário Demo', status: 'online' },
      ]);
      
      // Mensagem de boas-vindas
      setMessages(prev => [...prev, {
        id: '1',
        user: 'Sistema',
        text: 'Bem-vindo ao exemplo de WebSocket! Digite seu nome para começar.',
        timestamp: new Date()
      }]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: userName || 'Anônimo',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simular resposta de outro usuário
    setTimeout(() => {
      const responses = [
        'Interessante! Conte mais sobre isso.',
        'Eu concordo com essa perspectiva.',
        'Como você chegou a essa conclusão?',
        'Isso me faz pensar em novas possibilidades.',
        'Ótimo ponto! Vamos explorar isso mais.'
      ];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        user: 'Assistente IA',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Exemplo de WebSocket
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Demonstração de comunicação em tempo real usando WebSocket
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de Usuários */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Usuários Online
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status da Conexão
                    </span>
                    <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área de Chat */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Chat em Tempo Real
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.user === (userName || 'Anônimo') ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.user === (userName || 'Anônimo')
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-slate-700 border'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.user}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma mensagem ainda. Seja o primeiro a enviar!</p>
                    </div>
                  )}
                </div>

                {/* Input de Mensagem */}
                <div className="space-y-3">
                  {!userName && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite seu nome..."
                        value={inputMessage}
                        onChange={(e) => {
                          setInputMessage(e.target.value);
                          if (e.target.value.trim()) {
                            setUserName(e.target.value.trim());
                          }
                        }}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {userName && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {userName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enviando como: <strong>{userName}</strong>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Informações Técnicas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Tecnologias Utilizadas:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Socket.IO para comunicação WebSocket</li>
                  <li>• Next.js com App Router</li>
                  <li>• TypeScript para tipagem segura</li>
                  <li>• Tailwind CSS para estilização</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Funcionalidades:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Conexão em tempo real</li>
                  <li>• Lista de usuários online</li>
                  <li>• Envio e recebimento de mensagens</li>
                  <li>• Interface responsiva</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}