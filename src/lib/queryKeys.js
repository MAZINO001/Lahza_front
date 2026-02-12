export const QUERY_KEYS = {
    // Clients
    clients: ['clients'],
    client: (id) => ['client', id],
    clientDetail: (id) => ['clientDetail', id],

    // Projects
    projects: ['projects'],
    project: (id) => ['project', id],
    projectsByClient: (clientId) => ['projects', 'byClient', clientId],

    // Tasks
    tasks: ['tasks'],
    task: (id) => ['task', id],
    tasksByProject: (projectId) => ['tasks', 'byProject', projectId],

    // Invoices
    invoices: ['invoices'],
    invoice: (id) => ['invoice', id],
    invoicesWithoutProjects: ['invoices', 'withoutProjects'],
    invoicesProjects: ['invoices', 'projects'],

    // Quotes
    quotes: ['quotes'],
    quote: (id) => ['quote', id],

    // Payments
    payments: ['payments'],
    payment: (id) => ['payment', id],

    // Documents
    documents: ['documents'],
    document: (id) => ['document', id],

    // Services (FIXED: Added service detail key)
    services: ['services'],
    service: (id) => ['service', id],
    docsByService: (id, type) => ['services', 'docs', id, type], // NEW

    // Offers
    offers: ['offers'],
    offer: (id) => ['offer', id],

    // Dashboard
    dashboard: ['dashboard'],
    dashboardStats: ['dashboard', 'stats'],

    // Profile
    profile: ['profile'],
    profileSettings: ['profile', 'settings'],

    // Notifications
    notifications: ['notifications'],

    // Activity Logs
    activityLogs: ['activityLogs'],

    // Company Info
    companyInfo: ['company-info'],
    certifications: ['certifications'],
    certification: (id) => ['certification', id],

    // Agency
    agency: ['agency'],
    agencyById: (id) => ['agency', id],

    // Subscriptions
    subscriptions: ['subscriptions'],
    subscription: (id) => ['subscription', id],
    subscriptionsByClient: (clientId) => ['subscriptions', 'byClient', clientId],
    subscriptionsByPack: (packId) => ['subscriptions', 'byPack', packId],

    // Plans
    plans: ['plans'],
    plan: (id) => ['plan', id],
    plansByPack: (packId) => ['plans', 'byPack', packId],

    // Packs
    packs: ['packs'],
    pack: (id) => ['pack', id],
};