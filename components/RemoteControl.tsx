
import React from 'react';
import RemoteButton from './RemoteButton';
import { RemoteAction, ConnectionState } from '../types';

interface RemoteControlProps {
  onAction: (action: RemoteAction) => void;
  onOpenSettings: () => void;
  connection: ConnectionState;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ onAction, onOpenSettings, connection }) => {
  return (
    <div className="relative w-72 h-[640px] bg-zinc-950 rounded-[60px] p-6 shadow-2xl border border-zinc-800/50 flex flex-col items-center">
      {/* Top Branding/Sensor & Settings */}
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <div className={`w-2 h-2 rounded-full ${connection.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} title={connection.isConnected ? 'Connected' : 'Disconnected'} />
        <div className="w-12 h-1 bg-zinc-800 rounded-full" />
        <button onClick={onOpenSettings} className="text-zinc-600 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>
      
      {/* Power Section */}
      <div className="w-full flex justify-between px-2 mb-8">
        <RemoteButton onClick={() => onAction('POWER')} className="w-12 h-12 text-red-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.56 5.44l-1.45 1.45A5.969 5.969 0 0118 12c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17.15-4.13 2.89-5.11L7.44 5.44A7.947 7.947 0 004 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.96-1.61-5.54-4-6.89zM11 2h2v10h-2V2z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('VOICE')} className="w-12 h-12 text-blue-400 bg-zinc-800 border-2 border-blue-500/50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </RemoteButton>
      </div>

      {/* D-Pad */}
      <div className="relative w-48 h-48 bg-zinc-900 rounded-full flex items-center justify-center mb-10 shadow-inner">
        <div className="absolute inset-2 border-zinc-800 rounded-full border-4" />
        <button onClick={() => onAction('UP')} className="absolute top-2 w-12 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
        </button>
        <button onClick={() => onAction('DOWN')} className="absolute bottom-2 w-12 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <button onClick={() => onAction('LEFT')} className="absolute left-2 w-8 h-12 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 7l-5 5 5 5z"/></svg>
        </button>
        <button onClick={() => onAction('RIGHT')} className="absolute right-2 w-8 h-12 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5z"/></svg>
        </button>
        <button 
          onClick={() => onAction('SELECT')} 
          className="w-24 h-24 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all shadow-lg z-10 flex items-center justify-center font-bold text-zinc-300"
        >
          SELECT
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <RemoteButton onClick={() => onAction('BACK')} className="w-14 h-14" title="Back">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('HOME')} className="w-14 h-14" title="Home">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('SELECT')} className="w-14 h-14" title="Menu">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </RemoteButton>
      </div>

      {/* Media Controls */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <RemoteButton onClick={() => onAction('REWIND')} className="w-14 h-14">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('PLAY_PAUSE')} className="w-14 h-14">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('FAST_FORWARD')} className="w-14 h-14">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
        </RemoteButton>
      </div>

      {/* Volume/Mute */}
      <div className="grid grid-cols-3 gap-6">
        <RemoteButton onClick={() => onAction('VOLUME_DOWN')} className="w-14 h-14">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('MUTE')} className="w-14 h-14">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
        </RemoteButton>
        <RemoteButton onClick={() => onAction('VOLUME_UP')} className="w-14 h-14">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        </RemoteButton>
      </div>
    </div>
  );
};

export default RemoteControl;
