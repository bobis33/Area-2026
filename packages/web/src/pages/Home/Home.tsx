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
import { Button, Card } from '@/components/ui';
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

          <h1 className={styles.heroTitle}>
            {t('home.hero.title')}
            <span className={styles.heroTitleGradient}>
              {' '}
              {t('home.hero.titleGradient')}
            </span>
          </h1>

          <p className={styles.heroDescription}>
            {t('home.hero.description')}
            <br />
            {t('home.hero.descriptionLine2')}
          </p>

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
          <h2 className={styles.sectionTitle}>{t('home.howItWorks.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('home.howItWorks.subtitle')}
          </p>
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
              <h3 className={styles.featureTitle}>
                {t('home.howItWorks.step1.title')}
              </h3>
              <p className={styles.featureDescription}>
                {t('home.howItWorks.step1.description')}
              </p>
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
              <h3 className={styles.featureTitle}>
                {t('home.howItWorks.step2.title')}
              </h3>
              <p className={styles.featureDescription}>
                {t('home.howItWorks.step2.description')}
              </p>
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
              <h3 className={styles.featureTitle}>
                {t('home.howItWorks.step3.title')}
              </h3>
              <p className={styles.featureDescription}>
                {t('home.howItWorks.step3.description')}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>{t('home.benefits.badge')}</div>
          <h2 className={styles.sectionTitle}>{t('home.benefits.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('home.benefits.subtitle')}
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>
                {t('home.benefits.easyToUse.title')}
              </h3>
              <p className={styles.benefitDescription}>
                {t('home.benefits.easyToUse.description')}
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>
                {t('home.benefits.powerfulIntegrations.title')}
              </h3>
              <p className={styles.benefitDescription}>
                {t('home.benefits.powerfulIntegrations.description')}
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>
                {t('home.benefits.saveTime.title')}
              </h3>
              <p className={styles.benefitDescription}>
                {t('home.benefits.saveTime.description')}
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>
                {t('home.benefits.stayOrganized.title')}
              </h3>
              <p className={styles.benefitDescription}>
                {t('home.benefits.stayOrganized.description')}
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>
                {t('home.benefits.alwaysReliable.title')}
              </h3>
              <p className={styles.benefitDescription}>
                {t('home.benefits.alwaysReliable.description')}
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>
                {t('home.benefits.securePrivate.title')}
              </h3>
              <p className={styles.benefitDescription}>
                {t('home.benefits.securePrivate.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{t('home.cta.title')}</h2>
          <p className={styles.ctaDescription}>{t('home.cta.description')}</p>
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
              {t('home.footer.about')}
            </Link>
            <Link to="/login" className={styles.footerLink}>
              {t('home.footer.login')}
            </Link>
            <Link to="/register" className={styles.footerLink}>
              {t('home.footer.signUp')}
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            {t('home.footer.copyright', {
              year: new Date().getFullYear().toString(),
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}
