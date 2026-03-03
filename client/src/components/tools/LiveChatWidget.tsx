import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { createChatSession, getChatMessages, sendChatMessage, ChatMessage as ChatMessageType } from '../../api/client';

const Float = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  z-index: 100;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    bottom: 80px;
    right: 16px;
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
`;

const Panel = styled.div`
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 360px;
  max-height: 480px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 101;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 480px) {
    bottom: 140px;
    right: 16px;
    left: 16px;
    width: auto;
    max-height: 60vh;
  }
`;

const PanelHeader = styled.div`
  padding: 16px;
  background: #1e293b;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
`;

const MessageBubble = styled.div<{ $isAdmin: boolean }>`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  align-self: ${(p) => (p.$isAdmin ? 'flex-start' : 'flex-end')};
  background: ${(p) => (p.$isAdmin ? '#f1f5f9' : '#25d366')};
  color: ${(p) => (p.$isAdmin ? '#0f172a' : '#fff')};
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #25d366;
  }
`;

const SendBtn = styled.button`
  padding: 10px 16px;
  background: #25d366;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #20bd5a;
  }
`;

const CHAT_SESSION_KEY = 'nd_chat_session';

const LiveChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(CHAT_SESSION_KEY) : null
  );
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (open && !sessionId) {
      setLoading(true);
      createChatSession()
        .then((s) => {
          setSessionId(s.id);
          if (typeof window !== 'undefined') localStorage.setItem(CHAT_SESSION_KEY, s.id);
          return getChatMessages(s.id);
        })
        .then(setMessages)
        .finally(() => setLoading(false));
    } else if (open && sessionId) {
      getChatMessages(sessionId)
        .then(setMessages)
        .catch(() => {
          setSessionId(null);
          if (typeof window !== 'undefined') localStorage.removeItem(CHAT_SESSION_KEY);
        });
    }
  }, [open, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!open || !sessionId) return;
    const poll = () => getChatMessages(sessionId).then(setMessages);
    poll();
    const id = setInterval(poll, 2500);
    return () => clearInterval(id);
  }, [open, sessionId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !sessionId) return;
    setInput('');
    try {
      const msg = await sendChatMessage(sessionId, text);
      setMessages((m) => [...m, msg]);
    } catch {
      setSessionId(null);
      if (typeof window !== 'undefined') localStorage.removeItem(CHAT_SESSION_KEY);
    }
  };

  return (
    <>
      <Float
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('chat_btn')}
        title={t('chat_title')}
      >
        💬
      </Float>
      {open && (
        <Panel>
          <PanelHeader>{t('chat_title')}</PanelHeader>
          <Messages>
            {loading ? (
              <Messages>{t('chat_connecting')}</Messages>
            ) : (
              <>
                {messages.length === 0 && <MessageBubble $isAdmin>{t('chat_intro')}</MessageBubble>}
                {messages.map((m) => (
                  <MessageBubble key={m.id} $isAdmin={m.is_admin}>
                    {m.text}
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </Messages>
          {sessionId && !loading && (
            <InputRow>
              <Input
                placeholder={t('chat_placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <SendBtn type="button" onClick={handleSend}>
                {t('chat_send')}
              </SendBtn>
            </InputRow>
          )}
        </Panel>
      )}
    </>
  );
};

export default LiveChatWidget;
