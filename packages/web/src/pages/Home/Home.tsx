import { Link, Navigate } from 'react-router-dom';
import {
  FiZap,
  FiSettings,
  FiTarget,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, Text } from '@/components/ui';
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
            <span>Automate Everything</span>
          </div>

          <div className={styles.heroLogo}>
            <img src="/logo.svg" alt="AREA" />
          </div>

          <Text variant="title" style={{ marginBottom: 16 }}>
            Automate Your{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-brand-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Digital Life
            </span>
          </Text>

          <Text variant="body" color="muted" style={{ marginBottom: 32 }}>
            Connect your favorite services and create powerful automations.
            <br />
            When an action happens, trigger a reaction automatically.
          </Text>

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
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">Three simple steps to automate anything</Text>
          </div>
          <Text variant="body" color="muted">
            No coding required. Create powerful automations in minutes.
          </Text>
        </div>

        <div className={styles.featureGrid}>
          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiSettings />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>01</div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>Connect Services</Text>
              <Text variant="body" color="muted">
                Link your email, social media, and productivity tools in just a
                few clicks
              </Text>
            </div>
          </Card>

          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiZap />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>02</div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>Create Actions</Text>
              <Text variant="body" color="muted">
                Set triggers like "new email" or "new tweet" to start your
                automation
              </Text>
            </div>
          </Card>

          <Card padding="lg" hoverable>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FiTarget />
                <div className={styles.featureIconBg}></div>
              </div>
              <div className={styles.featureNumber}>03</div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>Set Reactions</Text>
              <Text variant="body" color="muted">
                Define what happens: send notification, create task, and much
                more
              </Text>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Why Choose AREA?</div>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">The smart way to automate your workflow</Text>
          </div>
          <Text variant="body" color="muted">
            Everything you need to boost your productivity
          </Text>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>Easy to use</Text>
              <Text variant="body" color="muted">
                No coding required - create automations with our intuitive
                interface
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>Powerful integrations</Text>
              <Text variant="body" color="muted">
                Connect all your favorite tools and services in one place
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>Save time</Text>
              <Text variant="body" color="muted">
                Automate repetitive tasks and focus on what matters most
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>Stay organized</Text>
              <Text variant="body" color="muted">
                Keep everything in sync across all your apps and services
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>Always reliable</Text>
              <Text variant="body" color="muted">
                Your automations run 24/7 with 99.9% uptime guarantee
              </Text>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <FiCheck />
            </div>
            <div className={styles.benefitContent}>
              <Text variant="subtitle" style={{ marginBottom: 4 }}>Secure & private</Text>
              <Text variant="body" color="muted">
                Enterprise-grade security keeps your data safe and encrypted
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">Ready to Get Started?</Text>
          </div>
          <Text variant="body" color="muted" style={{ marginBottom: 24 }}>
            Join thousands of users automating their digital life.
          </Text>
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
          <Text variant="caption" color="muted">
            © {new Date().getFullYear()} AREA. All rights reserved.
          </Text>
        </div>
      </footer>
    </div>
  );
}
