import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { requestCallback } from '../../api/client';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: #64748b;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #b91c1c;
    box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.15);
  }
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #b91c1c;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #991b1b;
  }

  &.secondary {
    background: #f1f5f9;
    color: #475569;
    &:hover {
      background: #e2e8f0;
    }
  }
`;

const Status = styled.p<{ $error?: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${(p) => (p.$error ? '#b91c1c' : '#15803d')};
`;

type Props = {
  onClose: () => void;
};

const CallbackModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setStatus(undefined);
    setLoading(true);
    try {
      await requestCallback({ name: name.trim(), phone: phone.trim(), preferred_time: preferredTime.trim() || undefined, message: message.trim() || undefined });
      setStatus({ type: 'success', text: t('callback_success') });
      setTimeout(onClose, 1500);
    } catch {
      setStatus({ type: 'error', text: t('callback_error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-labelledby="callback-title">
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title id="callback-title">{t('callback_title')}</Title>
        <Subtitle>{t('callback_subtitle')}</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            placeholder={t('callback_name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="tel"
            placeholder={t('callback_phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            placeholder={t('callback_time')}
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          />
          <Textarea
            placeholder={t('callback_message')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {status && <Status $error={status.type === 'error'}>{status.text}</Status>}
          <Row>
            <Button type="button" className="secondary" onClick={onClose}>
              {t('admin_cars_cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '...' : t('callback_submit')}
            </Button>
          </Row>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default CallbackModal;
