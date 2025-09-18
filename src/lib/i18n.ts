// Internationalization configuration and translations

export type Language = 'es' | 'en';
export const defaultLanguage: Language = 'es';

export const translations = {
  es: {
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      search: 'Buscar',
      retry: 'Reintentar',
      back: 'Volver',
      next: 'Siguiente',
      done: 'Listo',
      optional: 'Opcional',
    },

    // Auth & Onboarding
    auth: {
      welcome: 'Bienvenido',
      phoneNumber: 'Número de teléfono',
      phoneNumberPlaceholder: '+58 123 456 789',
      invalidPhone: 'Número de teléfono inválido',
      sendOtp: 'Enviar código',
      otpSent: 'Código enviado a {phone}',
      enterOtp: 'Ingresa el código de verificación',
      otpPlaceholder: '123456',
      invalidOtp: 'Código incorrecto',
      expiredOtp: 'Código expirado',
      resendOtp: 'Reenviar código',
      resendAvailableIn: 'Disponible en {seconds}s',
      maxAttemptsReached: 'Máximo de intentos alcanzado',
      verifyOtp: 'Verificar código',
    },

    // Profile Setup
    profile: {
      setupProfile: 'Configura tu perfil',
      displayName: 'Nombre completo',
      displayNamePlaceholder: 'Tu nombre completo',
      username: 'Nombre de usuario',
      usernamePlaceholder: 'usuario123',
      usernameAvailable: 'Disponible',
      usernameUnavailable: 'No disponible',
      usernameChecking: 'Verificando...',
      profilePicture: 'Foto de perfil',
      uploadPhoto: 'Subir foto',
      removePhoto: 'Eliminar foto',
      aboutMe: 'Acerca de mí',
      aboutMePlaceholder: 'Hola, estoy usando esta app 👋',
      completeSetup: 'Completar configuración',
    },

    // Chat Interface
    chat: {
      chats: 'Chats',
      newMessage: 'Nuevo mensaje',
      searchConversations: 'Buscar conversaciones...',
      noConversations: 'No hay conversaciones',
      startFirstConversation: 'Inicia tu primera conversación',
      online: 'En línea',
      away: 'Ausente',
      offline: 'Desconectado',
      lastSeen: 'Última vez {time}',
      typing: 'escribiendo...',
      messageFailedToSend: 'No se pudo enviar',
      messageDelivered: 'Entregado',
      messageRead: 'Leído',
      replyTo: 'Responder a',
      editMessage: 'Editar mensaje',
      deleteMessage: 'Eliminar mensaje',
      deleteForMe: 'Eliminar para mí',
      deleteForEveryone: 'Eliminar para todos',
      messageDeleted: 'Mensaje eliminado',
      messageEdited: 'Editado',
      forwardMessage: 'Reenviar mensaje',
    },

    // Message Composer
    composer: {
      typeMessage: 'Escribe un mensaje...',
      sendMessage: 'Enviar mensaje',
      attachFile: 'Adjuntar archivo',
      takePhoto: 'Tomar foto',
      recordVoice: 'Grabar mensaje de voz',
      stopRecording: 'Detener grabación',
      recording: 'Grabando...',
      addEmoji: 'Agregar emoji',
      formatText: 'Formatear texto',
      maxFileSize: 'Tamaño máximo de archivo excedido',
      unsupportedFileType: 'Tipo de archivo no soportado',
    },

    // Video Calls
    calls: {
      incomingCall: 'Llamada entrante',
      outgoingCall: 'Llamando...',
      videoCall: 'Videollamada',
      voiceCall: 'Llamada de voz',
      accept: 'Aceptar',
      decline: 'Rechazar',
      endCall: 'Colgar',
      mute: 'Silenciar',
      unmute: 'Quitar silencio',
      turnOffCamera: 'Apagar cámara',
      turnOnCamera: 'Encender cámara',
      switchCamera: 'Cambiar cámara',
      callDuration: 'Duración: {duration}',
      callEnded: 'Llamada finalizada',
      callFailed: 'Llamada fallida',
      reconnecting: 'Reconectando...',
      poorConnection: 'Conexión deficiente',
    },

    // Settings
    settings: {
      settings: 'Configuración',
      profile: 'Perfil',
      privacy: 'Privacidad',
      notifications: 'Notificaciones',
      theme: 'Tema',
      language: 'Idioma',
      about: 'Acerca de',
      logout: 'Cerrar sesión',
      deleteAccount: 'Eliminar cuenta',
      lightTheme: 'Tema claro',
      darkTheme: 'Tema oscuro',
      systemTheme: 'Seguir sistema',
      readReceipts: 'Confirmaciones de lectura',
      lastSeenVisibility: 'Visibilidad de última conexión',
      allowCalls: 'Permitir llamadas',
      everyone: 'Todos',
      contacts: 'Contactos',
      nobody: 'Nadie',
      pushNotifications: 'Notificaciones push',
      soundNotifications: 'Notificaciones sonoras',
    },

    // Errors
    errors: {
      networkError: 'Error de conexión',
      serverError: 'Error del servidor',
      unknownError: 'Error desconocido',
      fileUploadError: 'Error al subir archivo',
      permissionDenied: 'Permiso denegado',
      cameraNotAvailable: 'Cámara no disponible',
      microphoneNotAvailable: 'Micrófono no disponible',
      callFailed: 'La llamada falló',
      userNotFound: 'Usuario no encontrado',
      conversationNotFound: 'Conversación no encontrada',
    },

    // Notifications
    notifications: {
      newMessage: 'Nuevo mensaje',
      newMessageFrom: 'Nuevo mensaje de {user}',
      missedCall: 'Llamada perdida',
      missedCallFrom: 'Llamada perdida de {user}',
      incomingCall: 'Llamada entrante de {user}',
    },
  },

  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      optional: 'Optional',
    },

    // Auth & Onboarding
    auth: {
      welcome: 'Welcome',
      phoneNumber: 'Phone number',
      phoneNumberPlaceholder: '+1 123 456 7890',
      invalidPhone: 'Invalid phone number',
      sendOtp: 'Send code',
      otpSent: 'Code sent to {phone}',
      enterOtp: 'Enter verification code',
      otpPlaceholder: '123456',
      invalidOtp: 'Incorrect code',
      expiredOtp: 'Code expired',
      resendOtp: 'Resend code',
      resendAvailableIn: 'Available in {seconds}s',
      maxAttemptsReached: 'Maximum attempts reached',
      verifyOtp: 'Verify code',
    },

    // Profile Setup
    profile: {
      setupProfile: 'Set up your profile',
      displayName: 'Full name',
      displayNamePlaceholder: 'Your full name',
      username: 'Username',
      usernamePlaceholder: 'username123',
      usernameAvailable: 'Available',
      usernameUnavailable: 'Not available',
      usernameChecking: 'Checking...',
      profilePicture: 'Profile picture',
      uploadPhoto: 'Upload photo',
      removePhoto: 'Remove photo',
      aboutMe: 'About me',
      aboutMePlaceholder: 'Hey there! I am using this app 👋',
      completeSetup: 'Complete setup',
    },

    // Chat Interface
    chat: {
      chats: 'Chats',
      newMessage: 'New message',
      searchConversations: 'Search conversations...',
      noConversations: 'No conversations',
      startFirstConversation: 'Start your first conversation',
      online: 'Online',
      away: 'Away',
      offline: 'Offline',
      lastSeen: 'Last seen {time}',
      typing: 'typing...',
      messageFailedToSend: 'Failed to send',
      messageDelivered: 'Delivered',
      messageRead: 'Read',
      replyTo: 'Reply to',
      editMessage: 'Edit message',
      deleteMessage: 'Delete message',
      deleteForMe: 'Delete for me',
      deleteForEveryone: 'Delete for everyone',
      messageDeleted: 'Message deleted',
      messageEdited: 'Edited',
      forwardMessage: 'Forward message',
    },

    // Message Composer
    composer: {
      typeMessage: 'Type a message...',
      sendMessage: 'Send message',
      attachFile: 'Attach file',
      takePhoto: 'Take photo',
      recordVoice: 'Record voice message',
      stopRecording: 'Stop recording',
      recording: 'Recording...',
      addEmoji: 'Add emoji',
      formatText: 'Format text',
      maxFileSize: 'Maximum file size exceeded',
      unsupportedFileType: 'Unsupported file type',
    },

    // Video Calls
    calls: {
      incomingCall: 'Incoming call',
      outgoingCall: 'Calling...',
      videoCall: 'Video call',
      voiceCall: 'Voice call',
      accept: 'Accept',
      decline: 'Decline',
      endCall: 'End call',
      mute: 'Mute',
      unmute: 'Unmute',
      turnOffCamera: 'Turn off camera',
      turnOnCamera: 'Turn on camera',
      switchCamera: 'Switch camera',
      callDuration: 'Duration: {duration}',
      callEnded: 'Call ended',
      callFailed: 'Call failed',
      reconnecting: 'Reconnecting...',
      poorConnection: 'Poor connection',
    },

    // Settings
    settings: {
      settings: 'Settings',
      profile: 'Profile',
      privacy: 'Privacy',
      notifications: 'Notifications',
      theme: 'Theme',
      language: 'Language',
      about: 'About',
      logout: 'Log out',
      deleteAccount: 'Delete account',
      lightTheme: 'Light theme',
      darkTheme: 'Dark theme',
      systemTheme: 'Follow system',
      readReceipts: 'Read receipts',
      lastSeenVisibility: 'Last seen visibility',
      allowCalls: 'Allow calls',
      everyone: 'Everyone',
      contacts: 'Contacts',
      nobody: 'Nobody',
      pushNotifications: 'Push notifications',
      soundNotifications: 'Sound notifications',
    },

    // Errors
    errors: {
      networkError: 'Network error',
      serverError: 'Server error',
      unknownError: 'Unknown error',
      fileUploadError: 'File upload error',
      permissionDenied: 'Permission denied',
      cameraNotAvailable: 'Camera not available',
      microphoneNotAvailable: 'Microphone not available',
      callFailed: 'Call failed',
      userNotFound: 'User not found',
      conversationNotFound: 'Conversation not found',
    },

    // Notifications
    notifications: {
      newMessage: 'New message',
      newMessageFrom: 'New message from {user}',
      missedCall: 'Missed call',
      missedCallFrom: 'Missed call from {user}',
      incomingCall: 'Incoming call from {user}',
    },
  },
};

export type TranslationKey = keyof typeof translations['es'];

export function t(
  key: string,
  params?: Record<string, string | number>,
  language: Language = defaultLanguage
): string {
  const keys = key.split('.');
  let value: unknown = translations[language]; // ← sin any

  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
      break;
    }
  }

  if (typeof value !== 'string') {
    // Fallback a EN si no es string o no existe
    if (language !== 'en') {
      return t(key, params, 'en');
    }
    return key;
  }

  if (params) {
    return value.replace(/\{(\w+)\}/g, (_match: string, param: string) =>
      param in params ? String(params[param]) : _match
    );
  }

  return value;
}