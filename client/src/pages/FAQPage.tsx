import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const Page = styled.article`
  max-width: 720px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 32px;
  border-bottom: 3px solid #b91c1c;
  padding-bottom: 12px;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Item = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const QuestionHeader = styled.button`
  width: 100%;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
  }

  &:focus {
    outline: 2px solid #b91c1c;
    outline-offset: -2px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 15px;
  }
`;

const Icon = styled.span<{ $open: boolean }>`
  flex-shrink: 0;
  transform: rotate(${(p) => (p.$open ? 180 : 0)}deg);
  transition: transform 0.2s ease;
  font-size: 18px;
  color: #64748b;
`;

const Answer = styled.div<{ $open: boolean }>`
  max-height: ${(p) => (p.$open ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerInner = styled.div`
  padding: 0 20px 18px;
  font-size: 15px;
  line-height: 1.7;
  color: #475569;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    padding: 0 16px 14px;
    font-size: 14px;
  }
`;

const FAQ_ITEMS = [
  { q: 'faq_q1', a: 'faq_a1' },
  { q: 'faq_q2', a: 'faq_a2' },
  { q: 'faq_q3', a: 'faq_a3' },
  { q: 'faq_q4', a: 'faq_a4' },
  { q: 'faq_q5', a: 'faq_a5' },
] as const;

const FAQPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Helmet>
        <title>{t('faq_meta_title')}</title>
        <meta
          name="description"
          content={
            lang === 'hu'
              ? 'Gyakran ismételt kérdések a NovaDrive Motors autókereskedésről: garancia, finanszírozás, csereautó, tesztvezetés.'
              : 'Frequently asked questions about NovaDrive Motors: warranty, financing, trade-in, test drive.'
          }
        />
      </Helmet>

      <Page>
        <Title>{t('faq_title')}</Title>

        {FAQ_ITEMS.map((item, idx) => (
          <Item key={item.q}>
            <QuestionHeader
              type="button"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-answer-${idx}`}
              id={`faq-question-${idx}`}
            >
              {t(item.q)}
              <Icon $open={openIndex === idx} aria-hidden>
                ▼
              </Icon>
            </QuestionHeader>
            <Answer
              id={`faq-answer-${idx}`}
              $open={openIndex === idx}
              role="region"
              aria-labelledby={`faq-question-${idx}`}
            >
              <AnswerInner>{t(item.a)}</AnswerInner>
            </Answer>
          </Item>
        ))}
      </Page>
    </>
  );
};

export default FAQPage;
