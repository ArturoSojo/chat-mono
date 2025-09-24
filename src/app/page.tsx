'use client';
import React, { useState, useEffect } from "react";
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatPanel } from '@/components/chat-panel';
import { VideoCallModal } from '@/components/video-call-modal';
import { ThemeToggle } from '@/components/theme-toggle';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { Toaster } from '@/components/ui/sonner';
import { useUIStore } from '@/store/ui-store';
import { useI18n } from '@/hooks/use-i18n';
import { User, Conversation } from '@/types';
//pb
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {app, auth} from '@/lib/firebaseClient'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Array<Conversation & { id: string; otherUser: User }>>([]);
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { 
    selectedConversationId, 
    setSelectedConversation, 
    activeCall, 
    setActiveCall, 
    clearActiveCall,
    theme,
    setTheme
  } = useUIStore();
  
  const { t } = useI18n();

/*pebe  */
//const app = initializeApp(firebaseConfig); // ✅ instancia de App
//const auth = getAuth(app); // ✅ instancia de Auth

/*const setUpRecaptcha = () => {

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, 
      'recaptcha-container',
      {
      size: 'invisible',
      callback: (response: string) => {
        console.log('reCAPTCHA resuelto:', response);
      },
    }, // ✅ instancia de Auth
    );
    window.recaptchaVerifier.render(); // opcional: renderiza el widget
  
};*/
const setUpRecaptcha = async () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, // ✅ primer argumento: instancia de Auth
      'recaptcha-container', // ✅ segundo argumento: ID del div
      {
        size: 'invisible',
        callback: (response: string) => {
          console.log('reCAPTCHA resuelto:', response);
        },
      }
    );
    await window.recaptchaVerifier.render(); // ✅ espera que se renderice
  }
};


const phoneNumber = '+584243241710';
const appVerifier = window.recaptchaVerifier;
const auth2 = getAuth();
function mia(){
  console.log("mia", auth2)
  signInWithPhoneNumber(auth2, phoneNumber, appVerifier)
  .then((confirmationResult) => {
    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    window.confirmationResult = confirmationResult;
    // ...
  }).catch((error) => {
    // Error; SMS not sent
    // ...
  });
}

const handleSendOtp = async (phoneNumber: string) => {
  setUpRecaptcha();
  const appVerifier = window.recaptchaVerifier;
  if (!appVerifier) {
    console.error('reCAPTCHA no está listo');
    return;
  }
  console.log("handleSendOtp", auth2)

  try {
    console.log("handleSendOtp2", appVerifier)
    const confirmationResult = await signInWithPhoneNumber(auth2, '+584243241710', appVerifier);
    window.confirmationResult = confirmationResult;
    alert('OTP enviado');
  } catch (error) {
    console.error('Error al enviar OTP:', error);
    //grecaptcha.reset(window.recaptchaWidgetId);
  }
};

/*pebe  */

  
  useEffect(() => {
    async function fetchData() {
      try {
        //const response = await fetch('/api/getData');
        const response = await fetch('/api/auth/phone/start');

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    async function postData() {
      try {
        // Datos que deseas enviar a tu API Route
        const datosParaEnviar = {
          phone: '+34123456789"',
         /* displayName: "Ana Pérez",
          username: 'anita',
          photoURL: "https://.../avatars/uuid.jpg",
          about: "Hola ",
          createdAt: "2025-09-03T12:00:00Z",
          updatedAt: "2025-09-03T12:00:00Z",
          presence: "presence"*/


          // Otros campos que tu API Route espera
        };

        const response = await fetch('/api/auth/phone/start', {
          method: 'POST', // 👈 Especifica el método HTTP
          headers: {
            'Content-Type': 'application/json', // 👈 Indica el formato de los datos
          },
          body: JSON.stringify(datosParaEnviar), // 👈 Convierte el objeto a una cadena JSON
        });

        if (!response.ok) {
          throw new Error('Failed to post data');
        }

        const result = await response.json();
        console.log('Datos guardados con éxito:', result);
      } catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Llama a la función para ejecutar la solicitud POST
    postData();

    fetchData();
    handleSendOtp('+584243241710');
  }, []);


  
  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Mock authentication check
  useEffect(() => {
    // In real app, check Firebase Auth state
    const checkAuth = async () => {
      // Simulate checking auth state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, set as not authenticated initially
      setIsAuthenticated(false);
    };
    
    checkAuth();
  }, []);

  // Mock data for demo
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const mockConversations: Array<Conversation & { id: string; otherUser: User }> = [
        {
          id: 'conv1',
          members: [currentUser.phone, '+34123456789'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T12:30:00Z',
          lastMessage: {
            id: 'msg1',
            from: '+34123456789',
            type: 'text',
            preview: 'Perfecto, nos vemos mañana',
            createdAt: '2024-01-15T12:30:00Z'
          },
          lastMessageAt: '2024-01-15T12:30:00Z',
          unreadCount: { [currentUser.phone]: 2, '+34123456789': 0 },
          settings: { mutedBy: [], archivedBy: [] },
          otherUser: {
            phone: '+34123456789',
            displayName: 'Ana García',
            username: 'anagar',
            photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b60fe372?w=40&h=40&fit=crop&crop=face',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T11:00:00Z',
            presence: { online: true, lastSeen: '2024-01-15T12:29:00Z' },
            devices: [],
            pushTokens: [],
            privacy: { readReceipts: true, lastSeenVisible: 'everyone', allowCalls: true },
            safety: { blockedUserIds: [], reportsCount: 0 },
            softDeleted: false
          }
        },
        {
          id: 'conv2',
          members: [currentUser.phone, '+34987654321'],
          createdAt: '2024-01-14T09:00:00Z',
          updatedAt: '2024-01-15T09:15:00Z',
          lastMessage: {
            id: 'msg2',
            from: currentUser.phone,
            type: 'text',
            preview: 'Gracias por la información',
            createdAt: '2024-01-15T09:15:00Z'
          },
          lastMessageAt: '2024-01-15T09:15:00Z',
          unreadCount: { [currentUser.phone]: 0, '+34987654321': 0 },
          settings: { mutedBy: [], archivedBy: [] },
          otherUser: {
            phone: '+34987654321',
            displayName: 'Carlos López',
            username: 'carlosl',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T08:00:00Z',
            presence: { online: false, lastSeen: '2024-01-15T08:30:00Z' },
            devices: [],
            pushTokens: [],
            privacy: { readReceipts: true, lastSeenVisible: 'contacts', allowCalls: true },
            safety: { blockedUserIds: [], reportsCount: 0 },
            softDeleted: false
          }
        }
      ];
      
      setConversations(mockConversations);
    }
  }, [isAuthenticated, currentUser]);

  const handleOnboardingComplete = async (userData: {
    phone: string;
    displayName: string;
    username: string;
    photoFile?: File;
    about?: string;
  }) => {
    // Create user profile
    const newUser: User = {
      phone: userData.phone,
      displayName: userData.displayName,
      username: userData.username,
      photoURL: userData.photoFile ? 'mock-url' : undefined,
      about: userData.about,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      presence: { online: true, lastSeen: new Date().toISOString() },
      devices: [],
      pushTokens: [],
      privacy: { readReceipts: true, lastSeenVisible: 'everyone', allowCalls: true },
      safety: { blockedUserIds: [], reportsCount: 0 },
      softDeleted: false
    };
    
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleVideoCall = (userId: string) => {
    const conversation = conversations.find(c => c.otherUser.phone === userId);
    if (conversation) {
      setActiveCall({
        callId: 'call_' + Date.now(),
        type: 'outgoing',
        contact: {
          displayName: conversation.otherUser.displayName,
          photoURL: conversation.otherUser.photoURL
        },
        media: 'video'
      });
    }
  };

  const handleNewChat = () => {
    // TODO: Implement new chat creation
    console.log('Create new chat');
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Show onboarding if not authenticated
  if (!isAuthenticated) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      <div>
        <h1>Realizando una solicitud POST...</h1>
        <div id="recaptcha-container" />
        <button onClick={() => handleSendOtp('+584243241710')}>Send OTP</button>
        <button onClick={mia} >Send OTP mia</button>
      </div>
      {/* Top Bar */}
      <div className="border-b bg-background px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-sm">
              {currentUser?.displayName.charAt(0) || 'C'}
            </span>
          </div>
          <h1 className="font-medium">Chat App</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* User Menu - TODO: Implement settings menu */}
          <button className="w-8 h-8 rounded-full overflow-hidden">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-sm">
                {currentUser?.displayName.charAt(0)}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          currentUserId={currentUser?.phone || ''}
          selectedConversationId={selectedConversationId}
          conversations={conversations}
          onConversationSelect={handleConversationSelect}
          onVideoCall={handleVideoCall}
          onNewChat={handleNewChat}
        />
        <ChatPanel
          currentUserId={currentUser?.phone || ''}
          conversation={selectedConversation}
          onVideoCall={handleVideoCall}
        />
      </div>

      {/* Video Call Modal */}
      {activeCall && (
        <VideoCallModal
          isOpen={!!activeCall}
          onClose={clearActiveCall}
          contactName={activeCall.contact.displayName}
          contactAvatar={activeCall.contact.photoURL}
        />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}