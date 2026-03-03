import React from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Car } from '../../api/types';
import { useNavigate } from 'react-router-dom';

const Card = styled.article`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
  aspect-ratio: 16 / 10;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease-out;
`;

const SoldBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 700;
  background: #b91c1c;
  color: #fff;
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 700;
  background: #b91c1c;
  color: #fff;
`;

const IconBtn = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  z-index: 2;

  &:hover {
    background: #fff;
    color: #b91c1c;
  }
`;

const FavBtn = styled(IconBtn)<{ $active?: boolean }>`
  right: 52px;
  color: ${({ $active }) => ($active ? '#b91c1c' : '#475569')};
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  color: #475569;
  font-weight: 500;
`;

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  line-height: 1.3;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const Specs = styled.div`
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #b91c1c;
  margin-top: 4px;
`;

const Cta = styled.span`
  font-size: 13px;
  color: #b91c1c;
  font-weight: 500;
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

type Props = {
  car: Car;
  featured?: boolean;
};

const CarCard: React.FC<Props> = ({ car, featured }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toggleFavorite, isFavorite, addCompare } = useFavorites();

  const handleClick = () => {
    navigate(`/cars/${car.id}`);
  };

  const formattedPrice = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(car.price);

  return (
    <Card onClick={handleClick}>
      <ImageWrapper>
        <Image src={car.main_image} alt={car.title} loading="lazy" />
        {car.is_sold && <SoldBadge>{t('car_sold')}</SoldBadge>}
        {!car.is_sold && featured && <FeaturedBadge>{t('car_featured')}</FeaturedBadge>}
        {!car.is_sold && !featured && <CategoryBadge>{car.category}</CategoryBadge>}
        {!car.is_sold && (
          <>
            <FavBtn
              type="button"
              $active={isFavorite(car.id)}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(car.id); }}
              title={t('favorite_add')}
            >
              ♥
            </FavBtn>
            <IconBtn
              type="button"
              onClick={(e) => { e.stopPropagation(); addCompare(car.id); }}
              title={t('compare_add')}
            >
              ⚖
            </IconBtn>
          </>
        )}
      </ImageWrapper>
      <Content>
        <Title>{car.title}</Title>
        <Subtitle>
          {car.make} · {car.model} · {car.year}
        </Subtitle>
        <Specs>
          {car.mileage.toLocaleString('hu-HU')} km · {car.fuel_type} ·{' '}
          {car.transmission}
        </Specs>
        <Price>{formattedPrice}</Price>
        <Cta>
          {t('car_details')} <span>›</span>
        </Cta>
      </Content>
    </Card>
  );
};

export default CarCard;
