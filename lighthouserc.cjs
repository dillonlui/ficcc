module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/styleguide/',
        'http://localhost:4321/404.html',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*://[^/]+/$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.75 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
          },
        },
        {
          matchingUrlPattern: '.*/styleguide/.*',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.5 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
          },
        },
        {
          matchingUrlPattern: '.*/404\\.html$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.75 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:seo': ['warn', { minScore: 0.8 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
          },
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
