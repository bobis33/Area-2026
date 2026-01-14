import { Link, Navigate } from 'react-router-dom';
import {
  FiZap,
  FiSettings,
  FiTarget,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import styles from './Home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();

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
              About
            </Link>
            <Link to="/login" className={styles.navLink}>
              Login
            </Link>
            <Link to="/register" className={styles.navLinkPrimary}>
              Sign Up
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <FiZap className={styles.heroBadgeIcon} />
            <span>Automate Everything</span>
          </div>

          <div className={styles.heroLogo}>
            <img src="/logo.svg" alt="AREA" />
          </div>

          <h1 className={styles.heroTitle}>
            Automate Your
            <span className={styles.heroTitleGradient}> Digital Life</span>
          </h1>

          <p className={styles.heroDescription}>
            Connect your favorite services and create powerful automations.
            <br />
            When an action happens, trigger a reaction automatically.
          </p>

          <div className={styles.ctaButtons}>
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<FiArrowRight />}>
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="lg">
                Learn More
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
          <div className={styles.sectionBadge}>How It Works</div>
          <h2 className={styles.sectionTitle}>
            Three simple steps to automate anything
          </h2>
          <p className={styles.sectionSubtitle}>
            No coding required. Create powerful automations in minutes.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiSettings />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>01</div>
              <h3 className={styles.featureTitle}>Connect Services</h3>
              <p className={styles.featureDescription}>
                Link your email, social media, and productivity tools in just a
                few clicks
              </p>
            </div>
          </Card>

          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiZap />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>02</div>
              <h3 className={styles.featureTitle}>Create Actions</h3>
              <p className={styles.featureDescription}>
                Set triggers like "new email" or "new tweet" to start your
                automation
              </p>
            </div>
          </Card>

          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiTarget />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>03</div>
              <h3 className={styles.featureTitle}>Set Reactions</h3>
              <p className={styles.featureDescription}>
                Define what happens: send notification, create task, and much
                more
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Why Choose AREA?</div>
          <h2 className={styles.sectionTitle}>
            The smart way to automate your workflow
          </h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to boost your productivity
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>Easy to use</h3>
              <p className={styles.benefitDescription}>
                No coding required - create automations with our intuitive
                interface
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>Powerful integrations</h3>
              <p className={styles.benefitDescription}>
                Connect all your favorite tools and services in one place
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>Save time</h3>
              <p className={styles.benefitDescription}>
                Automate repetitive tasks and focus on what matters most
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>Stay organized</h3>
              <p className={styles.benefitDescription}>
                Keep everything in sync across all your apps and services
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>Always reliable</h3>
              <p className={styles.benefitDescription}>
                Your automations run 24/7 with 99.9% uptime guarantee
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>Secure & private</h3>
              <p className={styles.benefitDescription}>
                Enterprise-grade security keeps your data safe and encrypted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>
            <FiZap />
          </div>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of users automating their digital life.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<FiArrowRight />}>
              Create Your Account
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
              About
            </Link>
            <Link to="/login" className={styles.footerLink}>
              Login
            </Link>
            <Link to="/register" className={styles.footerLink}>
              Sign Up
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} AREA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
