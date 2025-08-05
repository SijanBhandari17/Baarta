import React, { useState, useEffect, useRef } from 'react';
import {
  FaMicrophone,
  FaVideo,
  FaShareSquare,
  FaUserCircle,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaPhoneSlash,
  FaPaperPlane,
  FaEllipsisV,
  FaCog,
  FaUsers,
} from 'react-icons/fa';
import { initialMessages, participants } from '../utils/LiveDiscussions.js';
import { goLive } from '../sockets/handleGoLive.js';

const YOUR_NAME = 'You';
const getAvatarByName = name => {
  const participant = participants.find(p => p.name === name);
  return participant ? participant.img : null;
};

const getAudioBars = (level = 0) => {
  return [...Array(4)].map((_, i) => (
    <div
      key={i}
      className={`w-0.5 rounded-full bg-green-400 transition-all duration-150 ${
        level > (i + 1) * 25 ? 'h-3' : 'h-1'
      }`}
    />
  ));
};

const Discussion = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeStreamer, setActiveStreamer] = useState(participants[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [audioLevels, setAudioLevels] = useState({});
  const [localStream, setLocalStream] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const startVideo = async () => {
      if (videoRef.current && !localStream) {
        try {
          const stream = await goLive(videoRef.current);
          setLocalStream(stream);
        } catch (error) {
          console.error('Failed to start video:', error);
        }
      }
    };

    startVideo();
  }, [messages, localStream]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMuted) {
        const newLevels = {};
        participants.forEach(p => {
          newLevels[p.name] = Math.random() * 100;
        });
        setAudioLevels(newLevels);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isMuted]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newEntry = {
      name: YOUR_NAME,
      time,
      message: newMessage.trim(),
    };

    setMessages(prev => [...prev, newEntry]);
    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = e => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white">
      {/* Chat Panel */}
      <div className="flex w-[28rem] flex-col border-r border-gray-700/50 bg-[#1f1f1f] shadow-2xl backdrop-blur-xl">
        <div className="border-b border-gray-700/50 bg-gradient-to-r from-[#252525] to-[#2a2a2a] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <FaUsers className="text-blue-400" /> Discussion Chat
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {participants.length + 1} participants online
              </p>
            </div>
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-700">
              <FaEllipsisV className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((msg, index) => {
            const avatar = getAvatarByName(msg.name);
            const isYou = msg.name === YOUR_NAME;
            return (
              <div
                key={index}
                className={`group flex items-start gap-3 ${isYou ? 'flex-row-reverse' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-700 text-gray-400">
                    {avatar ? (
                      <video className="h-full w-full object-cover" />
                    ) : (
                      <FaUserCircle className="text-lg" />
                    )}
                  </div>
                  <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#1f1f1f] bg-green-500" />
                </div>
                <div className={`max-w-[75%] ${isYou ? 'text-right' : ''}`}>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-300">{msg.name}</p>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg ${
                      isYou
                        ? 'rounded-br-md bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                        : 'rounded-bl-md bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {isTyping && (
          <div className="px-4 py-2 text-xs text-gray-400 italic">You are typing...</div>
        )}

        <div className="border-t border-gray-700/50 bg-gradient-to-r from-[#252525] to-[#2a2a2a] p-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              placeholder="Type your message..."
              className="max-h-20 w-full resize-none rounded-2xl border border-gray-600/50 bg-gray-800/80 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white shadow-lg transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex flex-1 flex-col bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a]">
        <div className="border-b border-gray-700/50 bg-[#1f1f1f]/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold text-white">
                Climate Change Research Methods
              </h2>
              <p className="text-sm text-gray-400">
                Research Discussion Session • Room #2024-CRM-001
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-400">LIVE</span>
              </div>
              <button className="rounded-lg p-2 transition-colors hover:bg-gray-700">
                <FaCog className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="relative h-full w-full overflow-hidden rounded-3xl border border-gray-700/30 bg-gray-800 shadow-2xl">
            {isScreenSharing ? (
              <div className="flex h-full w-full items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
                    <FaShareSquare className="text-3xl text-blue-400" />
                  </div>
                  <p className="mb-2 text-xl font-bold text-white">Screen Sharing Active</p>
                  <p className="text-sm text-gray-400">{activeStreamer.name} is presenting</p>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute top-6 left-6 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1.5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-red-400">REC</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                {getAudioBars(audioLevels[activeStreamer.name])}
                <span className="ml-2 text-xs text-gray-300">Audio</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img
                  src={activeStreamer.img}
                  alt={activeStreamer.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-white">{activeStreamer.name}</p>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></div>
                    Speaking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 bg-[#1f1f1f]/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleMute}
              className={`relative rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                isMuted
                  ? 'scale-110 bg-gradient-to-br from-red-600 to-red-700'
                  : 'bg-gradient-to-br from-gray-700 to-gray-800'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <FaMicrophoneSlash className="text-lg" />
              ) : (
                <FaMicrophone className="text-lg" />
              )}
              {isMuted && (
                <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`relative rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                isVideoOff
                  ? 'scale-110 bg-gradient-to-br from-red-600 to-red-700'
                  : 'bg-gradient-to-br from-gray-700 to-gray-800'
              }`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? <FaVideoSlash className="text-lg" /> : <FaVideo className="text-lg" />}
              {isVideoOff && (
                <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
              )}
            </button>
            <button
              onClick={toggleScreenShare}
              className={`rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                isScreenSharing
                  ? 'scale-110 bg-gradient-to-br from-blue-600 to-blue-700'
                  : 'bg-gradient-to-br from-gray-700 to-gray-800'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <FaShareSquare className="text-lg" />
            </button>
            <button
              className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
              title="Leave call"
            >
              <FaPhoneSlash className="text-lg" />
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2">
              {isMuted && <span className="text-xs text-red-400">Muted</span>}
              {isVideoOff && <span className="text-xs text-red-400">Camera off</span>}
              {isScreenSharing && <span className="text-xs text-blue-400">Screen sharing</span>}
              {!isMuted && !isVideoOff && !isScreenSharing && (
                <span className="text-xs text-green-400">All systems active</span>
              )}
              <div className="ml-2 h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;
