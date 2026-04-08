module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx serve dist/client -l 4321',
      startServerReadyPattern: 'Accepting connections',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/en/',
        'http://localhost:4321/en/about/',
        'http://localhost:4321/en/sermons/',
        'http://localhost:4321/en/contact/',
        'http://localhost:4321/en/visit/',
        'http://localhost:4321/en/give/',
        'http://localhost:4321/zh/',
        'http://localhost:4321/styleguide/',
        'http://localhost:4321/404.html',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertMatrix: [
        // CJK pages: font subsetting generates ~240KB CSS (K001), scores ~0.55 under 4G throttle
        {
          matchingUrlPattern: '.*/zh(/.*)?$',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.5 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
          },
        },
        // Styleguide: dev-only page, heavy CJK rendering
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
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:seo': ['warn', { minScore: 0.8 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
          },
        },
        // Production EN pages: 0.70 floor accounts for font loading under simulated 4G.
        // TBT=0, CLS≈0 — perf gap is purely FCP/LCP from font+CSS download.
        // Raising to 0.90 requires critical CSS extraction or font subsetting rework.
        // Excludes /zh/, /styleguide/, and /404.html which have their own thresholds.
        {
          matchingUrlPattern: '^(?!.*/zh/)(?!.*/styleguide/)(?!.*/404).*$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
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
