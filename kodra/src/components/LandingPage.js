import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function LandingPage({ onNavigate, darkMode, setDarkMode }) {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: '🔍',
      title: t('landing.feature.analysis.title', 'Deep Code Analysis'),
      description: t('landing.feature.analysis.desc', 'Instant feedback on security vulnerabilities, performance bottlenecks, and logic errors in your GitHub repos.')
    },
    {
      icon: '🎯',
      title: t('landing.feature.missions.title', 'Gamified Missions'),
      description: t('landing.feature.missions.desc', 'Turn your code issues into interactive learning missions. Fix bugs and earn XP to level up your skills.')
    },
    {
      icon: '🧠',
      title: t('landing.feature.skills.title', 'Skill Gap Detection'),
      description: t('landing.feature.skills.desc', 'AI analyzes your coding patterns to identify exactly what concepts you need to learn next.')
    },
    {
      icon: '🤖',
      title: t('landing.feature.mentor.title', 'AI Pair Programmer'),
      description: t('landing.feature.mentor.desc', 'Get real-time guidance and code explanations from your personal AI mentor while you code.')
    },
    {
      icon: '📊',
      title: t('landing.feature.health.title', 'Repo Health Dashboard'),
      description: t('landing.feature.health.desc', 'Visualize your codebase health with intuitive charts tracking maintainability and complexity over time.')
    },
    {
      icon: '🚀',
      title: t('landing.feature.career.title', 'Career Readiness'),
      description: t('landing.feature.career.desc', 'Build a portfolio of verified fixes and improvements to showcase your real-world engineering skills.')
    }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Full Stack Developer',
      image: '👨‍💻',
      location: 'San Francisco, CA',
      quote: 'Kodra found a critical security flaw in my auth flow that I missed. The mission to fix it taught me so much about JWTs!'
    },
    {
      name: 'Priya Sharma',
      role: 'Backend Engineer',
      image: '👩‍💻',
      location: 'Bangalore, India',
      quote: 'I love the gamified missions. Fixing legacy code used to be boring, but now it feels like leveling up in a game.'
    },
    {
      name: 'James Wilson',
      role: 'Student @ MIT',
      image: '🎓',
      location: 'Boston, MA',
      quote: 'Kodra helped me bridge the gap between theory and practice. My code quality has improved drastically.'
    },
    {
      name: 'Sarah Lee',
      role: 'DevOps Engineer',
      image: '🚀',
      location: 'London, UK',
      quote: 'The repository health dashboard gives me a clear view of technical debt. A must-have tool for any serious dev team.'
    }
  ];

  const stats = [
    { number: '1M+', label: t('landing.stats.lines', 'Lines Analyzed') },
    { number: '5000+', label: t('landing.stats.bugs', 'Bugs Fixed') },
    { number: '2000+', label: t('landing.stats.devs', 'Developers Helped') },
    { number: '500+', label: t('landing.stats.repos', 'Connected Repos') }
  ];

  const companies = [
    { name: 'GitHub', logo: '🐱' },
    { name: 'GitLab', logo: '🦊' },
    { name: 'Bitbucket', logo: '🗑️' },
    { name: 'VS Code', logo: '📝' },
    { name: 'React', logo: '⚛️' },
    { name: 'Spring', logo: '🍃' },
    { name: 'Python', logo: '🐍' },
    { name: 'Java', logo: '☕' }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const dynamicContainerStyle = {
    ...containerStyle,
    background: darkMode
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
    color: darkMode ? '#ffffff' : '#062b3c'
  };

  const dynamicTextStyle = {
    color: darkMode ? '#e2e8f0' : '#6b7785'
  };

  return (
    <div style={dynamicContainerStyle}>
      {/* Landing Navigation */}
      <nav style={navStyle}>
        <div style={navBrandStyle}>🚀 Kodra.ai</div>
        <div style={navActionsStyle}>
          <LanguageSelector />
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px',
              padding: '8px', borderRadius: '50%',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }}
          >
            {darkMode ? '🌙' : '🌞'}
          </button>
          <button
            onClick={() => onNavigate('login')}
            style={navLoginButtonStyle}
          >
            {t('auth.login', 'Sign In')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <div style={heroTextStyle}>
            <h1 style={{ ...heroTitleStyle, color: darkMode ? '#ffffff' : '#062b3c' }}>
              {t('landing.hero.title', 'Master Coding with')} <span style={brandHighlightStyle}>{t('landing.hero.highlight', 'AI-Driven Missions')}</span>
            </h1>
            <p style={{ ...heroSubtitleStyle, ...dynamicTextStyle }}>
              {t('landing.hero.subtitle', 'Connect your GitHub. We analyze your code, find gaps, and generate personalized coding missions to help you become a better developer.')}
            </p>
            <div style={heroButtonsStyle}>
              <button
                onClick={() => onNavigate('register')}
                style={primaryButtonStyle}
              >
                🚀 {t('landing.hero.cta', 'Start Analyzing')}
              </button>
              <button
                onClick={() => onNavigate('login')}
                style={secondaryButtonStyle}
              >
                👤 {t('auth.login', 'Sign In')}
              </button>
            </div>

            {/* Quick Stats */}
            <div style={quickStatsStyle}>
              {stats.map((stat, index) => (
                <div key={index} style={statItemStyle}>
                  <div style={statNumberStyle}>{stat.number}</div>
                  <div style={{ ...statLabelStyle, ...dynamicTextStyle }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={heroImageStyle}>
            <div style={heroIllustrationStyle}>
              💻🔍🚀✨
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={{ ...sectionTitleStyle, color: darkMode ? '#fff' : '#062b3c' }}>{t('landing.features.title', 'Why Kodra.ai?')}</h2>
          <p style={{ ...sectionSubtitleStyle, ...dynamicTextStyle }}>
            {t('landing.features.subtitle', 'The smartest way to level up your engineering skills')}
          </p>
        </div>

        <div style={featuresGridStyle}>
          {features.map((feature, index) => (
            <div key={index} style={{ ...featureCardStyle, background: darkMode ? '#1e293b' : 'white' }}>
              <div style={featureIconStyle}>{feature.icon}</div>
              <h3 style={{ ...featureTitleStyle, color: darkMode ? '#fff' : '#062b3c' }}>{feature.title}</h3>
              <p style={{ ...featureDescStyle, ...dynamicTextStyle }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies Section */}
      <section style={{ ...companiesSectionStyle, background: darkMode ? '#0f172a' : 'white' }}>
        <h3 style={companiesTitleStyle}>{t('landing.companies.title', 'Supported Technologies')}</h3>
        <div style={companiesGridStyle}>
          {companies.map((company, index) => (
            <div key={index} style={{ ...companyItemStyle, background: darkMode ? '#334155' : '#f8f9fa' }}>
              <span style={companyLogoStyle}>{company.logo}</span>
              <span style={{ ...companyNameStyle, color: darkMode ? '#fff' : '#062b3c' }}>{company.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ ...testimonialsSectionStyle, background: darkMode ? '#1e293b' : '#f8f9fa' }}>
        <h2 style={{ ...sectionTitleStyle, color: darkMode ? '#fff' : '#062b3c' }}>{t('landing.testimonials.title', 'Developer Stories')}</h2>
        <p style={{ ...sectionSubtitleStyle, ...dynamicTextStyle }}>{t('landing.testimonials.subtitle', 'See how others are mastering their craft')}</p>

        <div style={testimonialContainerStyle}>
          <div style={{ ...testimonialCardStyle, background: darkMode ? '#334155' : 'white' }}>
            <div style={testimonialHeaderStyle}>
              <div style={testimonialAvatarStyle}>
                {testimonials[currentTestimonial].image}
              </div>
              <div style={testimonialInfoStyle}>
                <h4 style={{ ...testimonialNameStyle, color: darkMode ? '#fff' : '#062b3c' }}>
                  {testimonials[currentTestimonial].name}
                </h4>
                <p style={testimonialRoleStyle}>
                  {testimonials[currentTestimonial].role}
                </p>
                <p style={testimonialLocationStyle}>
                  📍 {testimonials[currentTestimonial].location}
                </p>
              </div>
            </div>
            <blockquote style={{ ...testimonialQuoteStyle, color: darkMode ? '#e2e8f0' : '#062b3c' }}>
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
          </div>

          {/* Testimonial Navigation */}
          <div style={testimonialNavStyle}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  ...testimonialDotStyle,
                  background: index === currentTestimonial ? '#00b4d8' : '#ddd'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSectionStyle}>
        <div style={ctaContentStyle}>
          <h2 style={ctaTitleStyle}>{t('landing.cta.title', 'Ready to Level Up?')}</h2>
          <p style={ctaSubtitleStyle}>
            {t('landing.cta.subtitle', 'Connect your GitHub repository and get your first mission today.')}
          </p>
          <button
            onClick={() => onNavigate('register')}
            style={ctaButtonStyle}
          >
            🌟 {t('landing.cta.button', 'Start Coding')}
          </button>
          <p style={ctaNoticeStyle}>
            ✅ {t('landing.cta.notice', 'Free for Open Source • Instant Analysis • Secure Integration')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={footerBrandStyle}>
            <h3 style={footerLogoStyle}>🚀 Kodra.ai</h3>
            <p style={footerTaglineStyle}>
              {t('footer.tagline', 'Empowering developers to write better code through AI-driven insights and gamified missions.')}
            </p>
          </div>

          <div style={footerLinksStyle}>
            <div style={footerColumnStyle}>
              <h4 style={footerColumnTitleStyle}>{t('footer.features', 'Platform')}</h4>
              <ul style={footerListStyle}>
                <li><button onClick={() => onNavigate('analysis')} style={footerLinkStyle}>{t('navigation.analysis', 'Code Analysis')}</button></li>
                <li><button onClick={() => onNavigate('missions')} style={footerLinkStyle}>{t('navigation.missions', 'Missions')}</button></li>
              </ul>
            </div>

            <div style={footerColumnStyle}>
              <h4 style={footerColumnTitleStyle}>{t('footer.resources', 'Resources')}</h4>
              <ul style={footerListStyle}>
                <li><button onClick={() => onNavigate('chat')} style={footerLinkStyle}>{t('navigation.chat', 'AI Mentor')}</button></li>
                <li><button onClick={() => onNavigate('blog')} style={footerLinkStyle}>{t('navigation.blog', 'Engineering Blog')}</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={footerBottomStyle}>
          <p style={footerCopyrightStyle}>
            © 2025 Kodra.ai. {t('footer.copyright', 'Built with ❤️ for Developers.')}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Styles

// --- NAV STYLES (must be defined first) ---
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
};

const navBrandStyle = {
  fontSize: '24px',
  fontWeight: '800',
  color: '#00b4d8',
  cursor: 'pointer'
};

const navActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const navLoginButtonStyle = {
  padding: '8px 20px',
  borderRadius: '20px',
  border: '2px solid #00b4d8',
  background: 'transparent',
  color: '#00b4d8',
  fontWeight: '600',
  cursor: 'pointer'
};

const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
};

const heroSectionStyle = {
  padding: '120px 24px 80px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const heroContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 60,
  flexWrap: 'wrap'
};

const heroTextStyle = {
  flex: 1,
  minWidth: 300
};

const heroTitleStyle = {
  fontSize: 48,
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: 24,
  color: '#062b3c'
};

const brandHighlightStyle = {
  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const heroSubtitleStyle = {
  fontSize: 18,
  lineHeight: 1.6,
  color: '#6b7785',
  marginBottom: 32,
  maxWidth: 500
};

const heroButtonsStyle = {
  display: 'flex',
  gap: 16,
  marginBottom: 48,
  flexWrap: 'wrap'
};

const primaryButtonStyle = {
  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
  color: 'white',
  border: 'none',
  padding: '16px 32px',
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 8px 32px rgba(0, 180, 216, 0.3)',
  transition: 'all 0.3s ease'
};

const secondaryButtonStyle = {
  background: 'transparent',
  color: '#0077b6',
  border: '2px solid #0077b6',
  padding: '14px 32px',
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const quickStatsStyle = {
  display: 'flex',
  gap: 32,
  flexWrap: 'wrap'
};

const statItemStyle = {
  textAlign: 'center'
};

const statNumberStyle = {
  fontSize: 24,
  fontWeight: 800,
  color: '#00b4d8',
  marginBottom: 4
};

const statLabelStyle = {
  fontSize: 12,
  color: '#6b7785',
  fontWeight: 500
};

const heroImageStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  minWidth: 300
};

const heroIllustrationStyle = {
  fontSize: 120,
  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: 20
};

const sectionStyle = {
  padding: '80px 24px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const sectionHeaderStyle = {
  textAlign: 'center',
  marginBottom: 64
};

const sectionTitleStyle = {
  fontSize: 36,
  fontWeight: 700,
  color: '#062b3c',
  marginBottom: 16
};

const sectionSubtitleStyle = {
  fontSize: 18,
  color: '#6b7785',
  maxWidth: 600,
  margin: '0 auto'
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: 32
};

const featureCardStyle = {
  background: 'white',
  padding: 32,
  borderRadius: 16,
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease'
};

const featureIconStyle = {
  fontSize: 48,
  marginBottom: 16
};

const featureTitleStyle = {
  fontSize: 20,
  fontWeight: 600,
  color: '#062b3c',
  marginBottom: 12
};

const featureDescStyle = {
  color: '#6b7785',
  lineHeight: 1.6
};

const companiesSectionStyle = {
  padding: '60px 24px',
  background: 'white',
  textAlign: 'center'
};

const companiesTitleStyle = {
  fontSize: 18,
  color: '#6b7785',
  marginBottom: 32,
  fontWeight: 500
};

const companiesGridStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 40,
  flexWrap: 'wrap',
  maxWidth: '800px',
  margin: '0 auto'
};

const companyItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  background: '#f8f9fa',
  borderRadius: 8
};

const companyLogoStyle = {
  fontSize: 20
};

const companyNameStyle = {
  fontWeight: 500,
  color: '#062b3c'
};

const testimonialsSectionStyle = {
  padding: '80px 24px',
  background: '#f8f9fa',
  textAlign: 'center'
};

const testimonialContainerStyle = {
  maxWidth: 600,
  margin: '0 auto'
};

const testimonialCardStyle = {
  background: 'white',
  padding: 40,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  marginBottom: 32
};

const testimonialHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 24,
  textAlign: 'left'
};

const testimonialAvatarStyle = {
  fontSize: 48,
  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
  borderRadius: '50%',
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const testimonialInfoStyle = {
  flex: 1
};

const testimonialNameStyle = {
  fontSize: 18,
  fontWeight: 600,
  color: '#062b3c',
  margin: '0 0 4px 0'
};

const testimonialRoleStyle = {
  fontSize: 14,
  color: '#00b4d8',
  fontWeight: 500,
  margin: '0 0 4px 0'
};

const testimonialLocationStyle = {
  fontSize: 12,
  color: '#6b7785',
  margin: 0
};

const testimonialQuoteStyle = {
  fontSize: 16,
  lineHeight: 1.6,
  color: '#062b3c',
  fontStyle: 'italic',
  margin: 0,
  textAlign: 'left'
};

const testimonialNavStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: 12
};

const testimonialDotStyle = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.3s ease'
};

const ctaSectionStyle = {
  padding: '80px 24px',
  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
  textAlign: 'center'
};

const ctaContentStyle = {
  maxWidth: 600,
  margin: '0 auto'
};

const ctaTitleStyle = {
  fontSize: 36,
  fontWeight: 700,
  color: 'white',
  marginBottom: 16
};

const ctaSubtitleStyle = {
  fontSize: 18,
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: 32,
  lineHeight: 1.6
};

const ctaButtonStyle = {
  background: 'white',
  color: '#0077b6',
  border: 'none',
  padding: '16px 40px',
  borderRadius: 12,
  fontSize: 18,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease',
  marginBottom: 16
};

const ctaNoticeStyle = {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.8)'
};

const footerStyle = {
  background: '#062b3c',
  color: 'white'
};

const footerContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '60px 24px 40px',
  display: 'flex',
  gap: 60,
  flexWrap: 'wrap'
};

const footerBrandStyle = {
  flex: 1,
  minWidth: 300
};

const footerLogoStyle = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 16
};

const footerTaglineStyle = {
  color: 'rgba(255, 255, 255, 0.8)',
  lineHeight: 1.6,
  maxWidth: 300
};

const footerLinksStyle = {
  display: 'flex',
  gap: 60,
  flexWrap: 'wrap'
};

const footerColumnStyle = {
  minWidth: 150
};

const footerColumnTitleStyle = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 16
};

const footerListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const footerLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  padding: '4px 0',
  fontSize: 14,
  display: 'block',
  textAlign: 'left',
  marginBottom: 8,
  transition: 'color 0.3s ease'
};

const footerBottomStyle = {
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '20px 24px',
  textAlign: 'center'
};

const footerCopyrightStyle = {
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: 14,
  margin: 0
};