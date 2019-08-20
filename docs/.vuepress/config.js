module.exports = {
    title: 'Skills as a Service',
    description: 'Innovative approach to application training!',
    markdown: {
        toc: {
            includeLevel: [2, 3, 4, 5],
        },
    },
    themeConfig: {
        // logo: '/assets/img/logo.png',
        nav: [
            { text: 'Overview', link: '/overview/' },
            { text: 'Dashboard User Guide', link: '/dashboard/user-guide/' },
            { text: 'Quick Start', link: '/quick-start/' },
        ],
        // displayAllHeaders: true,
        sidebarDepth: 2,
        sidebar: [
            '/overview/',
            '/quick-start/',
            '/dashboard/install-guide',
            {
                title: 'Dashboard User Guide',
                collapsable: true,
                children: [
                    '/dashboard/user-guide/',
                    '/dashboard/user-guide/projects',
                    '/dashboard/user-guide/subjects',
                    '/dashboard/user-guide/skills',
                    '/dashboard/user-guide/levels',
                    '/dashboard/user-guide/badges',
                    '/dashboard/user-guide/icons',
                    '/dashboard/user-guide/dependencies',
                    '/dashboard/user-guide/users',
                    '/dashboard/user-guide/metrics',
                    '/dashboard/user-guide/programmatic-interface',
                    '/dashboard/user-guide/inception',
                ]
            },
            '/skills-client/',
            '/report-events/'

        ],
        lastUpdated: 'Last Updated',
        home: true,
    }
}
