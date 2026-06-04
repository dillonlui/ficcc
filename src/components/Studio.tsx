import { StudioProvider, StudioLayout } from 'sanity';
import config from '../../sanity.config';

export default function Studio() {
  if (config.projectId === 'placeholder') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#f8f4ed',
        color: '#2d2823',
      }}>
        <div style={{ maxWidth: '42rem' }}>
          <h1 style={{ marginBlockEnd: '1rem' }}>Sanity Studio is not configured</h1>
          <p style={{ lineHeight: 1.6 }}>
            Add <code>PUBLIC_SANITY_PROJECT_ID</code> and <code>PUBLIC_SANITY_DATASET</code>
            {' '}to the environment, then rebuild the site.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Server-side content fetching also needs <code>SANITY_PROJECT_ID</code> and
            {' '}<code>SANITY_DATASET</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StudioProvider config={config}>
      <StudioLayout />
    </StudioProvider>
  );
}
