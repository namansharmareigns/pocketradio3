
import { Howl } from 'howler';

// Audio notification types
export type NotificationType = 'emergency' | 'fun' | 'reminder';

// Audio configuration type
export interface AudioConfig {
  volume: number;
  voiceType: string;
  rate?: number;
  pitch?: number;
}

// Default configuration
const defaultConfig: AudioConfig = {
  volume: 0.8,
  voiceType: 'en-US',
  rate: 1,
  pitch: 1,
};

// Create audio instances for different notification types
const createNotificationSound = (type: NotificationType) => {
  const sounds = {
    emergency: new Howl({ src: ['/sounds/emergency.mp3'], volume: 0.8 }),
    fun: new Howl({ src: ['/sounds/fun.mp3'], volume: 0.6 }),
    reminder: new Howl({ src: ['/sounds/reminder.mp3'], volume: 0.4 }),
  };
  return sounds[type];
};

// Text-to-speech utility
export const speak = (text: string, config: Partial<AudioConfig> = {}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = mergedConfig.volume;
    utterance.rate = mergedConfig.rate!;
    utterance.pitch = mergedConfig.pitch!;
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === mergedConfig.voiceType) || null;
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Speech synthesis not supported');
  }
};

// Play notification sound
export const playNotificationSound = (type: NotificationType) => {
  const sound = createNotificationSound(type);
  sound.play();
};

// Combined notification (sound + speech)
export const notify = (type: NotificationType, message: string, config?: Partial<AudioConfig>) => {
  playNotificationSound(type);
  speak(message, config);
};
