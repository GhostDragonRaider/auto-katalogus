import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { Car } from '../api/types';
import { CarQuery, fetchCars, fetchMakes, fetchColors } from '../api/client';
import CarCard from '../components/catalog/CarCard';
import FiltersBar from '../components/catalog/FiltersBar';
import ContactForm from '../components/catalog/ContactForm';
import FinancingCalculator from '../components/tools/FinancingCalculator';
import TradeInForm from '../components/tools/TradeInForm';
import TrustSection from '../components/tools/TrustSection';
import NotifyForm from '../components/tools/NotifyForm';
import VideoSection from '../components/tools/VideoSection';

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 0;
  min-height: 320px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const HeroLeft = styled.div`
  background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(24px, 2.8vw, 32px);
  line-height: 1.2;
  margin: 0;
  color: #fff;
  font-weight: 700;
`;

const HeroLead = styled.p`
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
`;

const HeroCta = styled.button`
  display: inline-block;
  padding: 12px 24px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  margin-top: 8px;
  width: fit-content;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #991b1b;
  }
`;

const HeroRight = styled.div`
  position: relative;
  min-height: 280px;
  overflow: hidden;
`;

const HeroSlide = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 1.2s ease-in-out;
`;

const DEFAULT_HERO_IMAGE = 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg';

const HeroBanner = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  padding: 12px 18px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const InventorySection = styled.section`
  margin-top: 0;
`;

const InventoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const InventoryTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 3px solid #b91c1c;
  padding-bottom: 6px;
  display: inline-block;
`;

const InventorySubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #64748b;
`;

const CountBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  background: #f1f5f9;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  margin-top: 24px;
  padding: 32px;
  font-size: 15px;
  color: #64748b;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const TradeNotifyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const HomePage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [make, setMake] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [sort, setSort] = useState('');

  const query: CarQuery = useMemo(
    () => ({
      make: make || undefined,
      category: category || undefined,
      color: color || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minPower: minPower ? Number(minPower) : undefined,
      maxPower: maxPower ? Number(maxPower) : undefined,
      sort: (sort || undefined) as CarQuery['sort'],
    }),
    [make, category, color, minPrice, maxPrice, minPower, maxPower, sort]
  );

  useEffect(() => {
    let active = true;
    Promise.all([fetchMakes(), fetchColors()])
      .then(([makesData, colorsData]) => {
        if (active) {
          setMakes(makesData);
          setColors(colorsData);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCars(query);
        if (!active) return;
        setCars(data);
      } catch (err) {
        if (!active) return;
        setError(t('inventory_error'));
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
  }, [query]);

  const totalCount = cars.length;
  const location = useLocation();

  const heroImages = useMemo(
    () => (cars.length > 0 ? cars.map((c) => c.main_image) : [DEFAULT_HERO_IMAGE]),
    [cars]
  );
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 2800);
    return () => clearInterval(id);
  }, [heroImages.length]);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const id = state?.scrollTo;
    if (id === 'inventory' || id === 'contact') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.state]);

  return (
    <>
      <Helmet>
        <title>
          {lang === 'hu'
            ? `${t('site_name')} | Autó katalógus és kapcsolatfelvétel`
            : `${t('site_name')} | Car catalog and contact`}
        </title>
      </Helmet>

      <Hero id="hero">
        <HeroLeft>
          <HeroTitle>{t('hero_title')}</HeroTitle>
          <HeroLead>{t('hero_lead', totalCount)}</HeroLead>
          <HeroCta
            type="button"
            onClick={() => {
              const el = document.getElementById('inventory');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {t('hero_cta')}
          </HeroCta>
        </HeroLeft>
        <HeroRight>
          {heroImages.map((url, i) => (
            <HeroSlide
              key={`${url}-${i}`}
              $active={i === heroIndex % heroImages.length}
              style={{ backgroundImage: `url(${url})` }}
              aria-hidden={i !== heroIndex % heroImages.length}
            />
          ))}
          <HeroBanner>{t('hero_banner', totalCount)}</HeroBanner>
        </HeroRight>
      </Hero>

      <InventorySection id="inventory">
        <InventoryHeader>
          <div>
            <InventoryTitle>{t('inventory_title')}</InventoryTitle>
            <InventorySubtitle>{t('inventory_subtitle')}</InventorySubtitle>
          </div>
          <CountBadge>{t('inventory_count', totalCount)}</CountBadge>
        </InventoryHeader>

        <FiltersBar
          makes={makes}
          make={make}
          onMakeChange={setMake}
          category={category}
          onCategoryChange={setCategory}
          colors={colors}
          color={color}
          onColorChange={setColor}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          minPower={minPower}
          maxPower={maxPower}
          onMinPowerChange={setMinPower}
          onMaxPowerChange={setMaxPower}
          sort={sort}
          onSortChange={setSort}
          resultCount={totalCount}
          onClear={() => {
            setMake('');
            setCategory('');
            setColor('');
            setMinPrice('');
            setMaxPrice('');
            setMinPower('');
            setMaxPower('');
            setSort('');
          }}
        />

        {isLoading && <InventorySubtitle>{t('inventory_loading')}</InventorySubtitle>}
        {error && <EmptyState>{error}</EmptyState>}

        {!isLoading && !error && (
          <>
            {cars.length === 0 ? (
              <EmptyState>{t('inventory_empty')}</EmptyState>
            ) : (
              <Grid aria-label={t('inventory_aria')}>
                {cars.map((car, idx) => (
                  <CarCard key={car.id} car={car} featured={idx === 0 && !car.is_sold} />
                ))}
              </Grid>
            )}
          </>
        )}
      </InventorySection>

      <FinancingCalculator />

      <TradeNotifyGrid>
        <TradeInForm />
        <NotifyForm makes={makes} defaultMake={make} defaultCategory={category} />
      </TradeNotifyGrid>

      <VideoSection />

      <ContactForm cars={cars} />

      <TrustSection />
    </>
  );
};

export default HomePage;

