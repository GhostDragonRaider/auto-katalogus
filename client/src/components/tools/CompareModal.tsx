import React from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Car } from '../../api/types';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
`;

const CloseBtn = styled.button`
  padding: 8px 16px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;

  &:hover {
    background: #e2e8f0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
`;

const CarTitle = styled.div`
  font-weight: 600;
  color: #0f172a;
`;

const Empty = styled.p`
  text-align: center;
  color: #64748b;
  padding: 32px;
`;

const RemoveBtn = styled.button`
  padding: 4px 8px;
  font-size: 11px;
  background: #fef2f2;
  color: #b91c1c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

type Props = {
  cars: Car[];
  onClose: () => void;
};

const CompareModal: React.FC<Props> = ({ cars, onClose }) => {
  const { t } = useLanguage();
  const { removeCompare, compare } = useFavorites();

  const compareCars = cars.filter((c) => compare.includes(c.id));

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(p);

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{t('compare_title')}</Title>
          <CloseBtn type="button" onClick={onClose}>
            ✕
          </CloseBtn>
        </Header>
        {compareCars.length === 0 ? (
          <Empty>{t('compare_empty')}</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th></Th>
                {compareCars.map((car) => (
                  <Th key={car.id}>
                    <CarTitle>{car.title}</CarTitle>
                    <RemoveBtn type="button" onClick={() => removeCompare(car.id)}>
                      {t('compare_remove')}
                    </RemoveBtn>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td style={{ fontWeight: 500, color: '#64748b' }}>{t('car_year')}</Td>
                {compareCars.map((car) => (
                  <Td key={car.id}>{car.year}</Td>
                ))}
              </tr>
              <tr>
                <Td style={{ fontWeight: 500, color: '#64748b' }}>{t('car_mileage')}</Td>
                {compareCars.map((car) => (
                  <Td key={car.id}>{car.mileage.toLocaleString('hu-HU')} km</Td>
                ))}
              </tr>
              <tr>
                <Td style={{ fontWeight: 500, color: '#64748b' }}>{t('car_fuel')}</Td>
                {compareCars.map((car) => (
                  <Td key={car.id}>{car.fuel_type}</Td>
                ))}
              </tr>
              <tr>
                <Td style={{ fontWeight: 500, color: '#64748b' }}>{t('car_transmission')}</Td>
                {compareCars.map((car) => (
                  <Td key={car.id}>{car.transmission}</Td>
                ))}
              </tr>
              {compareCars.some((c) => c.power_hp) && (
                <tr>
                  <Td style={{ fontWeight: 500, color: '#64748b' }}>{t('car_power')}</Td>
                  {compareCars.map((car) => (
                    <Td key={car.id}>{car.power_hp ? `${car.power_hp} LE` : '—'}</Td>
                  ))}
                </tr>
              )}
              <tr>
                <Td style={{ fontWeight: 500, color: '#64748b' }}>Ár</Td>
                {compareCars.map((car) => (
                  <Td key={car.id} style={{ fontWeight: 600, color: '#b91c1c' }}>
                    {formatPrice(car.price)}
                  </Td>
                ))}
              </tr>
            </tbody>
          </Table>
        )}
      </Modal>
    </Backdrop>
  );
};

export default CompareModal;
