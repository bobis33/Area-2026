import { Link, Navigate } from 'react-router-dom';
import {
  FiZap,
  FiSettings,
  FiTarget,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';
import { Button, Card, Text } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import styles from './Home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const t = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <nav className={styles.heroNav}>
          <Link to="/" className={styles.navLogo}>
            <img src="/logo.svg" alt="AREA" className={styles.navLogoImg} />
            <span className={styles.navLogoText}>AREA</span>
          </Link>
          <div className={styles.navLinks}>
            <Link to="/about" className={styles.navLink}>
              {t('home.nav.about')}
            </Link>
            <Link to="/login" className={styles.navLink}>
              {t('home.nav.login')}
            </Link>
            <Link to="/register" className={styles.navLinkPrimary}>
              {t('home.nav.signUp')}
            </Link>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>{t('home.hero.badge')}</span>
          </div>

          <div className={styles.heroLogo}>
            <img src="/logo.svg" alt="AREA" />
          </div>

          <Text variant="title" style={{ marginBottom: 16 }}>
            {t('home.hero.title')}{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-brand-primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('home.hero.titleGradient')}
            </span>
          </Text>

          <Text variant="body" color="muted" style={{ marginBottom: 32 }}>
            {t('home.hero.description')}
            <br />
            {t('home.hero.descriptionLine2')}
          </Text>

          <div className={styles.ctaButtons}>
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<FiArrowRight />}>
                {t('home.hero.getStarted')}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="lg">
                {t('home.hero.learnMore')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className={styles.heroBackground}>
          <div className={styles.heroBgCircle1}></div>
          <div className={styles.heroBgCircle2}></div>
          <div className={styles.heroBgCircle3}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            {t('home.howItWorks.badge')}
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">{t('home.howItWorks.title')}</Text>
          </div>
          <Text variant="body" color="muted">
            {t('home.howItWorks.subtitle')}
          </Text>
        </div>

        <div className={styles.featureGrid}>
          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiSettings />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>
                {t('home.howItWorks.step1.number')}
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('home.howItWorks.step1.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.howItWorks.step1.description')}
              </Text>
            </div>
          </Card>

          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiZap />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>
                {t('home.howItWorks.step2.number')}
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('home.howItWorks.step2.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.howItWorks.step2.description')}
              </Text>
            </div>
          </Card>

          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiTarget />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>
                {t('home.howItWorks.step3.number')}
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('home.howItWorks.step3.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.howItWorks.step3.description')}
              </Text>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>{t('home.benefits.badge')}</div>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">{t('home.benefits.title')}</Text>
          </div>
          <Text variant="body" color="muted">
            {t('home.benefits.subtitle')}
          </Text>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>
                {t('home.benefits.easyToUse.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.benefits.easyToUse.description')}
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>
                {t('home.benefits.powerfulIntegrations.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.benefits.powerfulIntegrations.description')}
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>
                {t('home.benefits.saveTime.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.benefits.saveTime.description')}
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>
                {t('home.benefits.stayOrganized.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.benefits.stayOrganized.description')}
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>
                {t('home.benefits.alwaysReliable.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.benefits.alwaysReliable.description')}
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>
                {t('home.benefits.securePrivate.title')}
              </Text>
              <Text variant="body" color="muted">
                {t('home.benefits.securePrivate.description')}
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">{t('home.cta.title')}</Text>
          </div>
          <Text variant="body" color="muted" style={{ marginBottom: 24 }}>
            {t('home.cta.description')}
          </Text>
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<FiArrowRight />}>
              {t('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <img src="/logo.svg" alt="AREA" className={styles.footerLogo} />
            <span className={styles.footerBrandText}>AREA</span>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/about" className={styles.footerLink}>
              {t('home.nav.about')}
            </Link>
            <Link to="/login" className={styles.footerLink}>
              {t('home.nav.login')}
            </Link>
            <Link to="/register" className={styles.footerLink}>
              {t('home.nav.signUp')}
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <Text variant="caption" color="muted">
            © {new Date().getFullYear()} AREA. All rights reserved.
          </Text>
        </div>
      </footer>
    </div>
  );
}
