import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from './context/LanguageContext';
import { useFavorites } from './context/FavoritesContext';
import { fetchCar } from './api/client';
import { Car } from './api/types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import CarDetailPage from './pages/CarDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CompareModal from './components/tools/CompareModal';
import CookieBanner from './components/catalog/CookieBanner';
import CallbackModal from './components/tools/CallbackModal';
import LiveChatWidget from './components/tools/LiveChatWidget';

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  color: #0f172a;
  width: 100%;
  overflow-x: hidden;
`;

const SkipLink = styled.a`
  position: absolute;
  top: -100px;
  left: 16px;
  padding: 12px 20px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  z-index: 1000;
  transition: top 0.2s ease;

  &:focus {
    top: 16px;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1280px;
  min-width: 0;
  margin: 0 auto;
  padding: 24px 20px 48px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 16px 12px 32px;
    max-width: 100%;
  }
`;

const TopBar = styled.div`
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 8px 20px;
  font-size: 13px;
  color: #64748b;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const TopBarInner = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  box-sizing: border-box;

  @media (max-width: 600px) {
    gap: 12px;
    justify-content: center;
  }
`;

const HeaderBar = styled.header`
  width: 100%;
  box-sizing: border-box;
  background: #1e293b;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  color: #1e293b;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.span`
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 18px;
  color: #fff;
`;

const LogoSubtitle = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
`;

const Nav = styled.nav<{ $open?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(300px, 85vw);
    background: #1e293b;
    flex-direction: column;
    align-items: stretch;
    padding: 80px 20px 24px;
    gap: 4px;
    transform: translateX(${(p) => (p.$open ? 0 : '100%')});
    transition: transform 0.3s ease;
    z-index: 30;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  }
`;

const NavItem = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    padding: 14px 16px;
    font-size: 16px;
    text-align: left;
  }
`;

const NavButton = styled.button`
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-weight: 500;
  background: transparent;
  color: #fff;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.8);
  }

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    padding: 14px 16px;
    font-size: 16px;
    text-align: left;
  }
`;

const Hamburger = styled.button`
  display: none;
  padding: 8px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const HamburgerLine = styled.span`
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
`;

const NavOverlay = styled.div<{ $open: boolean }>`
  display: none;
  @media (max-width: 900px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 25;
    opacity: ${(p) => (p.$open ? 1 : 0)};
    pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
    transition: opacity 0.3s ease;
  }
`;

const LangToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;

  @media (max-width: 900px) {
    margin-left: 0;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const LangBtn = styled.button<{ $active?: boolean }>`
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  background: ${(p) => (p.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};
  color: #fff;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const Footer = styled.footer`
  border-top: 1px solid #e2e8f0;
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: #64748b;
  background: #fff;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 16px 12px;
    font-size: 12px;
  }
`;

const FooterInner = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { compare } = useFavorites();
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareCars, setCompareCars] = useState<Car[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);

  useEffect(() => {
    if (compareOpen && compare.length > 0) {
      Promise.all(compare.map((id) => fetchCar(id)))
        .then(setCompareCars)
        .catch(() => setCompareCars([]));
    } else {
      setCompareCars([]);
      if (compare.length === 0) setCompareOpen(false);
    }
  }, [compareOpen, compare]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToHome = () => {
    if (location.pathname === '/') {
      scrollToSection('hero');
    } else {
      navigate('/');
    }
  };

  const goToInventory = () => {
    if (location.pathname === '/') {
      scrollToSection('inventory');
    } else {
      navigate('/', { state: { scrollTo: 'inventory' } });
    }
  };

  const goToAdminLogin = () => {
    window.location.href = '/admin/login';
  };

  const closeMenu = () => setMenuOpen(false);

  const navTo = (fn: () => void) => {
    fn();
    closeMenu();
  };

  return (
    <Shell>
      <Helmet>
        <html lang={lang} />
        <title>
          {lang === 'hu'
            ? `${t('site_name')} | Modern Autókereskedés Katalógus`
            : `${t('site_name')} | Modern Car Dealership Catalog`}
        </title>
        <meta name="description" content={t('meta_description')} />
        <meta
          name="keywords"
          content={lang === 'hu' ? 'autókereskedés, autó katalógus, használt autó, új autó, demo oldal' : 'car dealership, car catalog, used car, new car, demo'}
        />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={t('site_name')} />
        <meta property="og:description" content={t('meta_og_desc')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + location.pathname : ''} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            name: t('site_name'),
            description: t('meta_description'),
            url: typeof window !== 'undefined' ? window.location.origin : '',
            telephone: '+36 20 123 4567',
            email: 'info@novadrive.hu',
            address: { '@type': 'PostalAddress', streetAddress: 'Autó utca 1.', addressLocality: 'Budapest', postalCode: '1234' },
            openingHoursSpecification: [
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
              { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
            ],
          })}
        </script>
      </Helmet>

      <SkipLink href="#main-content" id="skip-link">
        {t('skip_link')}
      </SkipLink>

      <TopBar>
        <TopBarInner>
          <span>{t('topbar_phone')}</span>
          <span>{t('topbar_email')}</span>
          <button
            type="button"
            onClick={() => setCallbackOpen(true)}
            style={{
              padding: '6px 12px',
              background: '#b91c1c',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {t('callback_btn')}
          </button>
        </TopBarInner>
      </TopBar>
      <HeaderBar>
        <HeaderInner>
          <Logo
            onClick={goToHome}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), goToHome())}
            aria-label={t('site_name')}
          >
            <LogoMark>N</LogoMark>
            <LogoText>
              <LogoTitle>{t('site_name')}</LogoTitle>
              <LogoSubtitle>{t('logo_subtitle')}</LogoSubtitle>
            </LogoText>
          </Logo>
          <Hamburger
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('menu_close') : t('menu_open')}
          >
            <HamburgerLine />
            <HamburgerLine />
            <HamburgerLine />
          </Hamburger>
          <NavOverlay $open={menuOpen} onClick={closeMenu} aria-hidden />
          <Nav $open={menuOpen} role="navigation" aria-label={lang === 'hu' ? 'Főmenü' : 'Main menu'}>
            <NavItem type="button" onClick={() => navTo(goToInventory)}>
              {t('nav_inventory')}
            </NavItem>
            <NavItem type="button" onClick={() => navTo(() => navigate('/about'))}>
              {t('nav_about')}
            </NavItem>
            <NavItem type="button" onClick={() => navTo(() => navigate('/faq'))}>
              {t('nav_faq')}
            </NavItem>
            <NavItem
              type="button"
              onClick={() =>
                navTo(() =>
                  location.pathname === '/'
                    ? scrollToSection('contact')
                    : navigate('/', { state: { scrollTo: 'contact' } })
                )
              }
            >
              {t('nav_contact')}
            </NavItem>
            <NavButton type="button" onClick={() => navTo(goToAdminLogin)}>
              {t('nav_admin')}
            </NavButton>
            <LangToggle>
              <LangBtn
                type="button"
                $active={lang === 'hu'}
                onClick={() => setLang('hu')}
                title="Magyar"
              >
                HU
              </LangBtn>
              <LangBtn
                type="button"
                $active={lang === 'en'}
                onClick={() => setLang('en')}
                title="English"
              >
                EN
              </LangBtn>
            </LangToggle>
          </Nav>
        </HeaderInner>
      </HeaderBar>

      <Main id="main-content" tabIndex={-1} role="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Main>

      <Footer>
        <FooterInner>{t('footer')}</FooterInner>
      </Footer>

      <CookieBanner />

      <LiveChatWidget />

      {callbackOpen && <CallbackModal onClose={() => setCallbackOpen(false)} />}

      {compareOpen && (
        <CompareModal cars={compareCars} onClose={() => setCompareOpen(false)} />
      )}
    </Shell>
  );
};

export default App;
