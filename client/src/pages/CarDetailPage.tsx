import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { Car } from '../api/types';
import { fetchCar } from '../api/client';
import Gallery from '../components/catalog/Gallery';
import TestDriveForm from '../components/tools/TestDriveForm';

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const HeadingRow = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
`;

const Sub = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #64748b;
`;

const Price = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #b91c1c;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 12px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  width: 40%;
  color: #64748b;
  font-weight: 500;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
`;

const Description = styled.p`
  margin-top: 16px;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
`;

const ExtrasSection = styled.div`
  margin-top: 16px;
`;

const ExtrasTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
`;

const ExtrasGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ExtraTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid #bbf7d0;

  &::before {
    content: '✓';
    font-weight: 700;
  }
`;

const BackLink = styled(RouterLink)`
  font-size: 14px;
  color: #b91c1c;
  font-weight: 500;
  margin-bottom: 16px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const StatusText = styled.p`
  grid-column: 1 / -1;
  font-size: 14px;
  color: #64748b;
`;

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCar(id);
        if (!active) return;
        setCar(data);
      } catch (err) {
        if (!active) return;
        setError(t('car_error'));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t from useLanguage is stable
  }, [id]);

  if (isLoading) {
    return <StatusText>{t('car_loading')}</StatusText>;
  }

  if (error || !car) {
    return <StatusText>{error ?? t('car_not_found')}</StatusText>;
  }

  const formattedPrice = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(car.price);

  const images = car.gallery && car.gallery.length > 0 ? car.gallery : [car.main_image];

  return (
    <>
      <Helmet>
        <title>{`${car.title} | ${t('site_name')}`}</title>
        <meta
          name="description"
          content={`${car.year} ${car.make} ${car.model} – ${formattedPrice}. ${car.description}`}
        />
      </Helmet>

      <BackLink to="/">&larr; {t('car_back')}</BackLink>

      <HeadingRow>
        <div>
          <Title>{car.title}</Title>
          <Sub>
            {car.make} · {car.model} · {car.year}
          </Sub>
          <BadgeRow>
            <Badge>{car.body_type}</Badge>
            <Badge>{car.fuel_type}</Badge>
            <Badge>{car.transmission}</Badge>
            <Badge>{car.category}</Badge>
            {car.is_sold && <Badge>{t('car_sold')}</Badge>}
          </BadgeRow>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Price>{formattedPrice}</Price>
          <Sub style={{ marginTop: 4 }}>{t('car_offer')}</Sub>
        </div>
      </HeadingRow>

      <Wrapper>
        <Gallery images={images} title={car.title} videoUrl={car.video_url} />
        <div>
          <Table aria-label={t('car_table_aria')}>
            <tbody>
              <tr>
                <Th>{t('car_year')}</Th>
                <Td>{car.year}</Td>
              </tr>
              <tr>
                <Th>{t('car_mileage')}</Th>
                <Td>{car.mileage.toLocaleString('hu-HU')} km</Td>
              </tr>
              <tr>
                <Th>{t('car_fuel')}</Th>
                <Td>{car.fuel_type}</Td>
              </tr>
              <tr>
                <Th>{t('car_transmission')}</Th>
                <Td>{car.transmission}</Td>
              </tr>
              <tr>
                <Th>{t('car_body')}</Th>
                <Td>{car.body_type}</Td>
              </tr>
              <tr>
                <Th>{t('car_category')}</Th>
                <Td>{car.category}</Td>
              </tr>
              {car.color && (
                <tr>
                  <Th>{t('car_color')}</Th>
                  <Td>{car.color}</Td>
                </tr>
              )}
              {car.power_hp != null && (
                <tr>
                  <Th>{t('car_power')}</Th>
                  <Td>{car.power_hp} LE</Td>
                </tr>
              )}
            </tbody>
          </Table>
          {car.extras && car.extras.length > 0 && (
            <ExtrasSection>
              <ExtrasTitle>{t('car_extras')}</ExtrasTitle>
              <ExtrasGrid>
                {car.extras.map((extra) => (
                  <ExtraTag key={extra}>{extra}</ExtraTag>
                ))}
              </ExtrasGrid>
            </ExtrasSection>
          )}
          <Description>{car.description}</Description>
          {!car.is_sold && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 18, borderBottom: '2px solid #b91c1c', paddingBottom: 6 }}>
                {t('testdrive_title')}
              </h3>
              <TestDriveForm car={car} />
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default CarDetailPage;
