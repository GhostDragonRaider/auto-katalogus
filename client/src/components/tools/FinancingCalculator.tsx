import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';

const Section = styled.section`
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 2px solid #b91c1c;
  padding-bottom: 6px;
  display: inline-block;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #475569;
`;

const Input = styled.input`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;

  &:focus {
    border-color: #b91c1c;
    outline: none;
  }
`;

const Result = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const Monthly = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #b91c1c;
`;

const Cta = styled.a`
  display: inline-block;
  padding: 10px 20px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #991b1b;
  }
`;

const FinancingCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [price, setPrice] = useState(10000000);
  const [down, setDown] = useState(2000000);
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(12);

  const monthly = useMemo(() => {
    const principal = Math.max(0, price - down);
    if (principal <= 0 || months <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  }, [price, down, months, rate]);

  const formatted = new Intl.NumberFormat('hu-HU', {
    maximumFractionDigits: 0,
  }).format(Math.round(monthly));

  return (
    <Section>
      <Title>{t('finance_title')}</Title>
      <Grid>
        <Field>
          <Label>{t('finance_price')}</Label>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </Field>
        <Field>
          <Label>{t('finance_down')}</Label>
          <Input
            type="number"
            min={0}
            value={down}
            onChange={(e) => setDown(Number(e.target.value) || 0)}
          />
        </Field>
        <Field>
          <Label>{t('finance_months')}</Label>
          <Input
            type="number"
            min={1}
            max={96}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 12)}
          />
        </Field>
        <Field>
          <Label>{t('finance_rate')}</Label>
          <Input
            type="number"
            min={0}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
          />
        </Field>
      </Grid>
      <Result>
        {t('finance_monthly')}: <Monthly>{formatted} Ft</Monthly>
      </Result>
      <Cta href="#contact">{t('finance_offer')}</Cta>
    </Section>
  );
};

export default FinancingCalculator;
