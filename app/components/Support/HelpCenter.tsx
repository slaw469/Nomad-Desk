// app/components/Support/HelpCenter.tsx
import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📋' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'booking', name: 'Booking & Reservations', icon: '📅' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'payments', name: 'Payments & Billing', icon: '💳' },
    { id: 'workspace-owners', name: 'Workspace Owners', icon: '🏢' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
  ];

  const articles: HelpArticle[] = [
    {
      id: '1',
      title: 'How to create your first booking',
      category: 'getting-started',
      content: `
        <h3>Step 1: Search for a workspace</h3>
        <p>Use our search feature to find workspaces in your desired location. You can filter by:</p>
        <ul>
          <li>Workspace type (library, café, co-working space)</li>
          <li>Amenities (Wi-Fi, power outlets, quiet zones)</li>
          <li>Price range</li>
          <li>Distance from your location</li>
        </ul>
        
        <h3>Step 2: Select your workspace</h3>
        <p>Click on any workspace to view detailed information including photos, reviews, and availability.</p>
        
        <h3>Step 3: Choose your time slot</h3>
        <p>Select your preferred date and time. Available slots will be highlighted in green.</p>
        
        <h3>Step 4: Complete your booking</h3>
        <p>Fill in your booking details and confirm your reservation. You'll receive a confirmation email with all the details.</p>
      `,
      tags: ['booking', 'first-time', 'tutorial'],
    },
    {
      id: '2',
      title: 'Understanding workspace types',
      category: 'getting-started',
      content: `
        <h3>Libraries</h3>
        <p>Usually free to use, perfect for quiet study sessions. Most libraries offer:</p>
        <ul>
          <li>Free Wi-Fi and power outlets</li>
          <li>Quiet study areas</li>
          <li>Group study rooms (may require booking)</li>
          <li>Extended hours during exam periods</li>
        </ul>
        
        <h3>Cafés</h3>
        <p>Great for casual work sessions. Typically require a purchase. Features include:</p>
        <ul>
          <li>Relaxed atmosphere</li>
          <li>Food and beverages available</li>
          <li>Background music and ambient noise</li>
          <li>Social environment</li>
        </ul>
        
        <h3>Co-working Spaces</h3>
        <p>Professional work environments with hourly or daily rates. They offer:</p>
        <ul>
          <li>High-speed internet</li>
          <li>Meeting rooms</li>
          <li>Printing facilities</li>
          <li>Networking opportunities</li>
        </ul>
      `,
      tags: ['workspace-types', 'libraries', 'cafes', 'coworking'],
    },
    {
      id: '3',
      title: 'Managing your bookings',
      category: 'booking',
      content: `
        <h3>Viewing your bookings</h3>
        <p>Access all your bookings from your dashboard. You can see:</p>
        <ul>
          <li>Upcoming reservations</li>
          <li>Past bookings</li>
          <li>Cancelled bookings</li>
        </ul>
        
        <h3>Modifying bookings</h3>
        <p>You can modify most bookings up to 2 hours before your reserved time:</p>
        <ul>
          <li>Change the date or time</li>
          <li>Update the number of people</li>
          <li>Add special requests</li>
        </ul>
        
        <h3>Cancelling bookings</h3>
        <p>Cancellations are free when made more than 2 hours in advance. Late cancellations may incur fees for paid workspaces.</p>
      `,
      tags: ['booking', 'cancellation', 'modification'],
    },
    {
      id: '4',
      title: 'Setting up your profile',
      category: 'account',
      content: `
        <h3>Profile Information</h3>
        <p>Complete your profile to get personalized workspace recommendations:</p>
        <ul>
          <li>Add your work preferences</li>
          <li>Set your default location</li>
          <li>Choose your preferred workspace types</li>
          <li>Upload a profile photo</li>
        </ul>
        
        <h3>Study Preferences</h3>
        <p>Help us recommend the perfect workspaces by setting:</p>
        <ul>
          <li>Preferred noise level (silent, quiet, moderate, lively)</li>
          <li>Favorite workspace environments</li>
          <li>Preferred group size</li>
          <li>Best working hours</li>
        </ul>
        
        <h3>Privacy Settings</h3>
        <p>Control your privacy with options to:</p>
        <ul>
          <li>Make your profile private</li>
          <li>Control who can see your activity</li>
          <li>Manage notification preferences</li>
        </ul>
      `,
      tags: ['profile', 'preferences', 'privacy'],
    },
    {
      id: '5',
      title: 'Troubleshooting common issues',
      category: 'troubleshooting',
      content: `
        <h3>Can't find workspaces in my area</h3>
        <p>Try these solutions:</p>
        <ul>
          <li>Expand your search radius</li>
          <li>Check your location permissions</li>
          <li>Try searching by city name instead of GPS</li>
          <li>Contact us to suggest new areas for expansion</li>
        </ul>
        
        <h3>Booking confirmation not received</h3>
        <p>If you haven't received your confirmation email:</p>
        <ul>
          <li>Check your spam/junk folder</li>
          <li>Verify your email address in your profile</li>
          <li>Check your booking status in your dashboard</li>
          <li>Contact support if the issue persists</li>
        </ul>
        
        <h3>App running slowly</h3>
        <p>To improve performance:</p>
        <ul>
          <li>Clear your browser cache</li>
          <li>Check your internet connection</li>
          <li>Try refreshing the page</li>
          <li>Use the latest version of your browser</li>
        </ul>
      `,
      tags: ['troubleshooting', 'technical-issues', 'performance'],
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchQuery === ''
      || article.title.toLowerCase().includes(searchQuery.toLowerCase())
      || article.content.toLowerCase().includes(searchQuery.toLowerCase())
      || article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: 'Inter, sans-serif',
    } as React.CSSProperties,
    header: {
      padding: '20px 40px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4A6FDC',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    hero: {
      background: 'linear-gradient(135deg, #4A6FDC 0%, #2DD4BF 100%)',
      padding: '80px 40px',
      textAlign: 'center' as const,
      color: 'white',
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '15px',
    },
    heroSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      marginBottom: '30px',
    },
    searchBox: {
      maxWidth: '500px',
      margin: '0 auto',
      position: 'relative' as const,
    },
    searchInput: {
      width: '100%',
      padding: '15px 50px 15px 20px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '10px',
      outline: 'none',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    searchIcon: {
      position: 'absolute' as const,
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9CA3AF',
    },
    main: {
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '40px',
    },
    sidebar: {
      background: '#F8FAFC',
      padding: '30px',
      borderRadius: '16px',
      height: 'fit-content',
      position: 'sticky' as const,
      top: '120px',
    },
    sidebarTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '20px',
    },
    categoryList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    categoryItem: {
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    content: {
      minHeight: '400px',
    },
    articleGrid: {
      display: 'grid',
      gap: '20px',
    },
    articleCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    articleTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '8px',
    },
    articlePreview: {
      color: '#4B5563',
      fontSize: '0.9rem',
      lineHeight: '1.5',
    },
    articleTags: {
      display: 'flex',
      gap: '8px',
      marginTop: '15px',
      flexWrap: 'wrap' as const,
    },
    tag: {
      padding: '4px 8px',
      backgroundColor: '#E0E7FF',
      color: '#4A6FDC',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    articleView: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    articleHeader: {
      borderBottom: '2px solid #F1F5F9',
      paddingBottom: '20px',
      marginBottom: '30px',
    },
    articleViewTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#2A3347',
      marginBottom: '10px',
    },
    backToArticles: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4A6FDC',
      textDecoration: 'none',
      fontWeight: '500',
      marginBottom: '20px',
      cursor: 'pointer',
    },
    articleContent: {
      color: '#4B5563',
      lineHeight: '1.7',
      fontSize: '1rem',
    },
    noResults: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: '#9CA3AF',
    },
  };

  if (selectedArticle) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <Link to="/" style={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </header>

        <main style={styles.main}>
          <div style={styles.articleView}>
            <div
              style={styles.backToArticles}
              onClick={() => setSelectedArticle(null)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Help Center
            </div>

            <div style={styles.articleHeader}>
              <h1 style={styles.articleViewTitle}>{selectedArticle.title}</h1>
              <div style={styles.articleTags}>
                {selectedArticle.tags.map((tag) => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div
              style={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Help Center</h1>
        <p style={styles.heroSubtitle}>
          Find answers to your questions and learn how to make the most of Nomad Desk
        </p>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      <main style={styles.main}>
        <div style={styles.contentGrid}>
          <aside style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Categories</h3>
            <div style={styles.categoryList}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    ...styles.categoryItem,
                    backgroundColor: selectedCategory === category.id ? '#4A6FDC' : 'transparent',
                    color: selectedCategory === category.id ? 'white' : '#4B5563',
                  }}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </div>
              ))}
            </div>
          </aside>

          <div style={styles.content}>
            {filteredArticles.length > 0 ? (
              <div style={styles.articleGrid}>
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    style={styles.articleCard}
                    onClick={() => setSelectedArticle(article)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4A6FDC';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h3 style={styles.articleTitle}>{article.title}</h3>
                    <p style={styles.articlePreview}>
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                      ...
                    </p>
                    <div style={styles.articleTags}>
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noResults}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or browse by category</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;
