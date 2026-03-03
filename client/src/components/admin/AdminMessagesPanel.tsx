import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { ContactMessage } from '../../api/types';
import {
  adminFetchMessages,
  adminUpdateMessageStatus,
} from '../../api/client';

const Panel = styled.section`
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const Count = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
  background: #f8fafc;
`;

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
`;

const StatusTag = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
  color: #475569;
`;

const ActionButton = styled.button`
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  background: #f1f5f9;
  color: #475569;
  transition: background 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const StatusText = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
`;

type Props = {
  token: string;
};

const AdminMessagesPanel: React.FC<Props> = ({ token }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminFetchMessages(token);
      setMessages(data);
    } catch (err) {
      setError(t('admin_messages_error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const markAsHandled = async (msg: ContactMessage) => {
    try {
      await adminUpdateMessageStatus(token, msg.id, 'handled');
      await loadMessages();
    } catch {
      // ignore
    }
  };

  return (
    <Panel>
      <Header>
        <div>
          <Title>{t('admin_messages_title')}</Title>
          <Count>{t('admin_messages_count', messages.length)}</Count>
        </div>
      </Header>

      {isLoading && <StatusText>{t('admin_messages_loading')}</StatusText>}
      {error && <StatusText>{error}</StatusText>}

      {!isLoading && !error && (
        <Table>
          <thead>
            <tr>
              <Th>{t('admin_messages_col_sender')}</Th>
              <Th>{t('admin_messages_col_message')}</Th>
              <Th>{t('admin_messages_col_car')}</Th>
              <Th>{t('admin_messages_col_status')}</Th>
              <Th>{t('admin_messages_col_action')}</Th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <Td>
                  <div style={{ fontWeight: 500 }}>{msg.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {msg.email}
                    {msg.phone ? ` · ${msg.phone}` : ''}
                  </div>
                </Td>
                <Td>{msg.message}</Td>
                <Td>{msg.car_id ? msg.car_id : '—'}</Td>
                <Td>
                  <StatusTag>
                    {msg.status === 'handled'
                      ? t('admin_messages_status_handled')
                      : t('admin_messages_status_new')}
                  </StatusTag>
                </Td>
                <Td>
                  {msg.status !== 'handled' && (
                    <ActionButton
                      type="button"
                      onClick={() => markAsHandled(msg)}
                    >
                      {t('admin_messages_mark_handled')}
                    </ActionButton>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Panel>
  );
};

export default AdminMessagesPanel;

