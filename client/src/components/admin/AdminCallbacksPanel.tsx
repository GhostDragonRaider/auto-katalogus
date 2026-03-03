import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { adminFetchCallbacks, adminUpdateCallbackStatus } from '../../api/client';

const Panel = styled.section`
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
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
  background: #f1f5f9;
  color: #475569;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #f1f5f9;
  color: #475569;
`;

type Callback = {
  id: string;
  name: string;
  phone: string;
  preferred_time?: string;
  message?: string;
  created_at: string;
  status: string;
};

type Props = { token: string };

const AdminCallbacksPanel: React.FC<Props> = ({ token }) => {
  const { t } = useLanguage();
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchCallbacks(token);
      setCallbacks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const markHandled = async (cb: Callback) => {
    try {
      await adminUpdateCallbackStatus(token, cb.id, 'handled');
      await load();
    } catch {
      // ignore
    }
  };

  return (
    <Panel>
      <Header>
        <Title>{t('admin_callbacks_title')}</Title>
        <Count>{t('admin_callbacks_count', callbacks.length)}</Count>
      </Header>
      {loading ? (
        <p>{t('admin_messages_loading')}</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Név</Th>
              <Th>Telefon</Th>
              <Th>Időpont</Th>
              <Th>Státusz</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {callbacks.map((cb) => (
              <tr key={cb.id}>
                <Td>{cb.name}</Td>
                <Td>{cb.phone}</Td>
                <Td>{cb.preferred_time || '—'}</Td>
                <Td>
                  <StatusTag>
                    {cb.status === 'handled'
                      ? t('admin_messages_status_handled')
                      : t('admin_messages_status_new')}
                  </StatusTag>
                </Td>
                <Td>
                  {cb.status !== 'handled' && (
                    <ActionButton type="button" onClick={() => markHandled(cb)}>
                      {t('admin_callbacks_mark')}
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

export default AdminCallbacksPanel;
