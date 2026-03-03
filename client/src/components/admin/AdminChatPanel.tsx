import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import {
  adminFetchChatSessions,
  adminGetChatMessages,
  adminSendChatMessage,
  ChatSession,
  ChatMessage,
} from '../../api/client';

const Wrapper = styled.section`
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  min-height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SessionList = styled.div`
  border-right: 1px solid #e2e8f0;
  padding-right: 16px;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 16px;
  }
`;

const SessionItem = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 4px;
  text-align: left;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? '#f1f5f9' : 'transparent')};
  cursor: pointer;
  font-size: 13px;
  color: #0f172a;

  &:hover {
    background: #f8fafc;
  }
`;

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ChatHeader = styled.div`
  padding-bottom: 12px;
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Bubble = styled.div<{ $admin: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  align-self: ${(p) => (p.$admin ? 'flex-start' : 'flex-end')};
  background: ${(p) => (p.$admin ? '#e2e8f0' : '#25d366')};
  color: ${(p) => (p.$admin ? '#0f172a' : '#fff')};
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
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

const Empty = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

type Props = { token: string };

const AdminChatPanel: React.FC<Props> = ({ token }) => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadSessions = async () => {
    try {
      const data = await adminFetchChatSessions(token);
      setSessions(data);
      if (!selected && data.length > 0) setSelected(data[0].id);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadSessions();
    const id = setInterval(loadSessions, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!selected) {
      setMessages([]);
      return;
    }
    const load = () => adminGetChatMessages(token, selected).then(setMessages);
    load();
    const id = setInterval(load, 2500);
    return () => clearInterval(id);
  }, [selected, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = reply.trim();
    if (!text || !selected) return;
    setReply('');
    try {
      const msg = await adminSendChatMessage(token, selected, text);
      setMessages((m) => [...m, msg]);
    } catch {
      // ignore
    }
  };

  return (
    <Wrapper>
      <SessionList>
        <ChatHeader>{t('admin_chat_title')}</ChatHeader>
        {sessions.length === 0 ? (
          <Empty>{t('admin_chat_select')}</Empty>
        ) : (
          sessions.map((s) => (
            <SessionItem
              key={s.id}
              $active={s.id === selected}
              onClick={() => setSelected(s.id)}
            >
              {s.visitor_name || `Chat ${s.id.slice(0, 8)}`}
            </SessionItem>
          ))
        )}
      </SessionList>
      <ChatArea>
        {selected ? (
          <>
            <Messages>
              {messages.map((m) => (
                <Bubble key={m.id} $admin={m.is_admin}>
                  {m.text}
                </Bubble>
              ))}
              <div ref={messagesEndRef} />
            </Messages>
            <InputRow>
              <Input
                placeholder={t('admin_chat_reply')}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <SendBtn type="button" onClick={handleSend}>
                {t('admin_chat_send')}
              </SendBtn>
            </InputRow>
          </>
        ) : (
          <Empty>{t('admin_chat_select')}</Empty>
        )}
      </ChatArea>
    </Wrapper>
  );
};

export default AdminChatPanel;
