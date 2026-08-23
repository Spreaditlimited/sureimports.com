export type SolutionPage = {
  slug: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  searchIntent: string[];
  heroPoints: string[];
  audience: string;
  challengeTitle: string;
  challenge: string;
  outcomes: Array<{ title: string; text: string }>;
  capabilities: Array<{ title: string; text: string }>;
  specifications?: Array<{ label: string; value: string }>;
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
  sourceUrl?: string;
  sourceLabel?: string;
  productName?: string;
};

export const solutionPages: SolutionPage[] = [
  {
    slug: 'hytera-body-cameras',
    eyebrow: 'Professional body-worn video',
    title: 'Hytera body cameras for accountable field operations',
    shortTitle: 'Hytera body cameras',
    description:
      'Compare Hytera body-worn cameras for evidence capture, live supervision and secure enterprise deployment in Nigeria and across Africa.',
    searchIntent: [
      'Hytera body cameras Nigeria',
      'body camera supplier Nigeria',
    ],
    heroPoints: [
      'Professional field recording',
      'Connected and record-only options',
      'Designed around secure evidence handling',
    ],
    audience:
      'Banks, security providers, public agencies, transport operators and industrial teams',
    challengeTitle: 'A camera is only one part of an accountable operation',
    challenge:
      'A credible deployment must define how footage is captured, transferred, retained, accessed, reviewed and shared. Sure Imports designs the camera fleet together with docking, evidence software, storage, permissions, training and lifecycle support.',
    outcomes: [
      {
        title: 'Clearer incident records',
        text: 'Capture video, audio and photographs with devices designed for demanding frontline use.',
      },
      {
        title: 'Operational choice',
        text: 'Select streamlined evidence capture or connected command with live visibility and voice coordination.',
      },
      {
        title: 'Controlled evidence',
        text: 'Move recordings into a governed evidence environment instead of unmanaged memory cards and folders.',
      },
    ],
    capabilities: [
      {
        title: 'SC580 Connected Command',
        text: 'Smart 4G body camera for live video, positioning, push-to-talk and central supervision.',
      },
      {
        title: 'GC550 Standard Evidence',
        text: 'Compact 2K body camera for straightforward, high-quality evidence capture.',
      },
      {
        title: 'Complete ecosystem',
        text: 'Combine cameras with EDS30 docking and Hytera Digital Evidence Management.',
      },
      {
        title: 'Deployment support',
        text: 'Fleet sizing, storage planning, configuration, training, warranty and ongoing support.',
      },
    ],
    process: [
      'Define users, sites and incident types',
      'Select connected or record-only operation',
      'Size docking, storage and retention',
      'Pilot with representative users',
      'Deploy, train and govern',
    ],
    faqs: [
      {
        question: 'Which Hytera body camera is right for my organisation?',
        answer:
          'Choose the SC580 when live streaming, location and push-to-talk are operational requirements. Choose the GC550 when the priority is compact 2K capture and controlled evidence intake at a lower system complexity.',
      },
      {
        question: 'Can the system support multiple sites?',
        answer:
          'Yes. The deployment can be designed around multiple collection points and a central evidence environment, subject to network, storage and access requirements.',
      },
      {
        question: 'Do you sell single cameras?',
        answer:
          'Single-device requirements can be assessed, but Sure Imports is focused on supported organisational deployments where evidence handling and lifecycle requirements are clear.',
      },
    ],
    relatedSlugs: [
      'hytera-sc580',
      'hytera-gc550',
      'digital-evidence-management',
    ],
    sourceUrl:
      'https://www.hytera.com/en/product-new/body-worn-camera/body-worn-camera-solution.page',
    sourceLabel: 'Hytera body-worn camera solution',
  },
  {
    slug: 'hytera-sc580',
    eyebrow: 'Connected command',
    title: 'Hytera SC580 smart 4G body camera',
    shortTitle: 'Hytera SC580',
    productName: 'Hytera SC580 Smart 4G Body Camera',
    description:
      'Deploy the Hytera SC580 for body-worn recording, live 4G or WLAN video, positioning and push-to-talk coordination in Nigeria.',
    searchIntent: ['Hytera SC580 Nigeria', '4G body camera Nigeria'],
    heroPoints: [
      'Live video over 4G or WLAN',
      'Push-to-talk and positioning',
      'Record and stream simultaneously',
    ],
    audience:
      'Operations that need command-centre visibility and immediate field coordination',
    challengeTitle:
      'Give supervisors context while an incident is still unfolding',
    challenge:
      'The SC580 combines body-worn evidence capture with connected field communications. It can record high-definition footage locally while sending a compressed live stream to authorised command personnel.',
    outcomes: [
      {
        title: 'Real-time visibility',
        text: 'Stream on-site video to the command and dispatch centre over cellular or WLAN connectivity.',
      },
      {
        title: 'One field device',
        text: 'Use push-to-talk voice coordination without requiring every user to carry a separate radio.',
      },
      {
        title: 'Complete incident context',
        text: 'Pre-event recording can preserve activity that occurred before manual activation.',
      },
    ],
    capabilities: [
      {
        title: 'Stabilised recording',
        text: 'Six-axis stabilisation supports clearer footage while the wearer is moving.',
      },
      {
        title: 'Low-light options',
        text: 'Infrared and starlight configurations are available subject to the selected model.',
      },
      {
        title: 'Field resilience',
        text: 'IP68 protection and a design intended for full-shift professional use.',
      },
      {
        title: 'Secure workflow',
        text: 'Integrates with Hytera docking, DEM and compatible command-and-dispatch services.',
      },
    ],
    specifications: [
      { label: 'Video', value: 'Up to 1080p at 30 fps' },
      { label: 'Battery', value: '3,200 mAh; configuration dependent' },
      { label: 'Connectivity', value: '4G LTE, WLAN, Bluetooth 5.1' },
      { label: 'Positioning', value: 'GPS, BDS, GLONASS and A-GPS' },
      { label: 'Protection', value: 'IP68' },
      { label: 'Storage', value: '16 GB, 32 GB, 64 GB or 128 GB options' },
    ],
    process: [
      'Validate mobile network coverage',
      'Define live-video and PTT user groups',
      'Configure command permissions',
      'Pilot bandwidth and battery performance',
      'Roll out with DEM retention policies',
    ],
    faqs: [
      {
        question: 'Can the SC580 record and stream at the same time?',
        answer:
          'Yes. Hytera describes a dual-stream workflow that retains high-quality footage locally while transmitting compressed video.',
      },
      {
        question: 'Does live video require mobile data?',
        answer:
          'Live operation requires suitable 4G/LTE or WLAN connectivity and a compatible platform. We assess coverage, data usage and command infrastructure during solution design.',
      },
      {
        question: 'Is night vision included?',
        answer:
          'Available capabilities depend on the exact SC580 configuration. The final quotation and datasheet will identify infrared or starlight options explicitly.',
      },
    ],
    relatedSlugs: [
      'live-command-and-dispatch',
      'digital-evidence-management',
      'hytera-eds30-docking-station',
    ],
    sourceUrl:
      'https://www.hytera.com/eu/terminal.page/products_terminal_body-worn-camera_sc580',
    sourceLabel: 'Official Hytera SC580 information',
  },
  {
    slug: 'hytera-gc550',
    eyebrow: 'Standard evidence capture',
    title: 'Hytera GC550 compact 2K body camera',
    shortTitle: 'Hytera GC550',
    productName: 'Hytera GC550 2K Mini Body Camera',
    description:
      'Deploy the compact Hytera GC550 2K body camera for straightforward field recording and controlled digital evidence collection.',
    searchIntent: ['Hytera GC550 Nigeria', '2K body camera Nigeria'],
    heroPoints: [
      'Ultra-compact body-worn design',
      'Clear 2K recording',
      'Physical slide-to-record control',
    ],
    audience:
      'Teams that prioritise dependable recording and central evidence collection without live command',
    challengeTitle:
      'Make evidence capture simple enough for consistent daily use',
    challenge:
      'The GC550 focuses on comfortable wear, quick activation and high-resolution recording. It is suited to organisations that want a controlled evidence workflow without adding live cellular command to every device.',
    outcomes: [
      {
        title: 'Less wearer burden',
        text: 'The camera weighs under 120 grams and is smaller than a standard business card.',
      },
      {
        title: 'Fast activation',
        text: 'A physical sliding switch provides an immediate, tactile way to start and confirm recording.',
      },
      {
        title: 'Useful detail',
        text: '2K video and a wide field of view help preserve important visual context.',
      },
    ],
    capabilities: [
      {
        title: 'Flexible wearing',
        text: 'Compatible carrying accessories support epaulette or front-pocket use.',
      },
      {
        title: 'Night operation',
        text: 'Infrared capability supports evidence capture in low-light environments.',
      },
      {
        title: 'Efficient shifts',
        text: 'Low-power design supports extended FHD recording during daytime operations.',
      },
      {
        title: 'Central collection',
        text: 'Pair with compatible docking and DEM for governed transfer and retention.',
      },
    ],
    specifications: [
      { label: 'Video', value: 'Up to 2K recording' },
      { label: 'Weight', value: 'Less than 120 g' },
      { label: 'Storage', value: 'Project configuration dependent' },
      { label: 'Operation', value: 'Physical slide-to-record switch' },
    ],
    process: [
      'Map shifts and recording demand',
      'Select storage and carrying options',
      'Size docking locations',
      'Configure evidence categories',
      'Train users and supervisors',
    ],
    faqs: [
      {
        question: 'Does the GC550 provide live 4G streaming?',
        answer:
          'The GC550 is positioned here as the streamlined recording option. Use the SC580 solution when live 4G command visibility is required.',
      },
      {
        question: 'How is footage collected?',
        answer:
          'Compatible docking infrastructure can acquire recordings and move them into the organisation’s evidence-management workflow.',
      },
      {
        question: 'Can we start with a pilot?',
        answer:
          'Yes. A controlled pilot is recommended to validate wearing position, recording policy, docking throughput and supervisor workflows.',
      },
    ],
    relatedSlugs: [
      'hytera-sc580',
      'hytera-eds30-docking-station',
      'digital-evidence-management',
    ],
    sourceUrl:
      'https://www.hytera.com/en/product-new/body-worn-camera/body-worn-camera/gc550.html',
    sourceLabel: 'Official Hytera GC550 information',
  },
  {
    slug: 'digital-evidence-management',
    eyebrow: 'Evidence from field to review',
    title: 'Hytera Digital Evidence Management for secure, auditable footage',
    shortTitle: 'Digital Evidence Management',
    productName: 'Hytera Digital Evidence Management Platform',
    description:
      'Centralise, protect, search, review and share body-camera footage with Hytera Digital Evidence Management for Nigerian organisations.',
    searchIntent: [
      'digital evidence management Nigeria',
      'body camera evidence software',
    ],
    heroPoints: [
      'Centralised evidence repository',
      'Permissions and audit trails',
      'On-premises or cloud deployment options',
    ],
    audience:
      'Organisations that must preserve evidence integrity, privacy and operational control at scale',
    challengeTitle:
      'Recording is easy. Governing the evidence is the real system.',
    challenge:
      'Digital Evidence Management creates a controlled environment for footage, audio, photographs and supporting documents. It replaces ad-hoc downloads with a traceable workflow for intake, categorisation, access, review, retention and sharing.',
    outcomes: [
      {
        title: 'Preserve integrity',
        text: 'Encryption, digital signatures and activity logging help protect evidence from capture through review.',
      },
      {
        title: 'Find evidence faster',
        text: 'Search by user, recording location, metadata or tags and link related material to cases.',
      },
      {
        title: 'Control disclosure',
        text: 'Permissions, traceable sharing and redaction support more responsible access to sensitive recordings.',
      },
    ],
    capabilities: [
      {
        title: 'Case and evidence linkage',
        text: 'Organise related recordings and documents around an incident or investigation.',
      },
      {
        title: 'Auditability',
        text: 'Record evidence-related activities and produce a traceable history of access and actions.',
      },
      {
        title: 'Redaction',
        text: 'Create redacted copies of video, audio, faces, licence plates or other sensitive details.',
      },
      {
        title: 'Scalable deployment',
        text: 'Support on-premises or cloud architecture, capacity growth and multi-site collection.',
      },
    ],
    process: [
      'Map evidence flows and stakeholders',
      'Define retention and legal holds',
      'Design roles and permissions',
      'Size storage and resilience',
      'Test intake, review and disclosure',
    ],
    faqs: [
      {
        question: 'Can Hytera DEM be deployed on premises?',
        answer:
          'Yes. Hytera describes both on-premises and cloud deployment options. The appropriate design depends on sovereignty, connectivity, resilience and operating-cost requirements.',
      },
      {
        question: 'Can administrators control who sees footage?',
        answer:
          'Yes. User- and function-based permissions can be designed around organisational roles and evidence responsibilities.',
      },
      {
        question: 'Does DEM support non-camera files?',
        answer:
          'Current Hytera materials describe support for video, audio, photographs, documents and evidence from other compatible sources. Exact integrations must be confirmed during solution design.',
      },
    ],
    relatedSlugs: [
      'hytera-eds30-docking-station',
      'hytera-sc580',
      'body-cameras-for-government',
    ],
    sourceUrl:
      'https://www.hytera.com/en/product-new/body-worn-camera/management-platform/dem.html',
    sourceLabel: 'Official Hytera DEM information',
  },
  {
    slug: 'hytera-eds30-docking-station',
    eyebrow: 'Evidence intake',
    title: 'Hytera EDS30 portable eight-bay docking station',
    shortTitle: 'Hytera EDS30',
    productName: 'Hytera EDS30 Portable Docking Station',
    description:
      'Collect evidence and charge up to eight compatible body cameras simultaneously with the portable Hytera EDS30 docking station.',
    searchIntent: [
      'Hytera EDS30 Nigeria',
      'body camera docking station Nigeria',
    ],
    heroPoints: [
      'Eight-camera simultaneous acquisition',
      'Charging during evidence transfer',
      'Portable multi-site design',
    ],
    audience:
      'Distributed teams that need predictable evidence intake at branches, posts or temporary locations',
    challengeTitle: 'Make the end of every shift a controlled handover',
    challenge:
      'The docking layer turns device return into a repeatable operational process. The EDS30 can acquire evidence and charge eight compatible cameras at once while showing device status on its integrated display.',
    outcomes: [
      {
        title: 'Faster turnaround',
        text: 'Acquire data from eight body cameras simultaneously while replenishing device power.',
      },
      {
        title: 'Portable collection',
        text: 'A 7.5 kg form factor supports movement between sites when fixed infrastructure is unsuitable.',
      },
      {
        title: 'Visible status',
        text: 'A 10.1-inch touchscreen shows acquisition and charging progress and supports media playback.',
      },
    ],
    capabilities: [
      {
        title: 'WLAN upload',
        text: 'Transfer acquired evidence onwards through a suitable wireless network.',
      },
      {
        title: 'Expandable storage',
        text: 'Hytera specifies local storage configurations up to 48 TB, plus cloud options.',
      },
      {
        title: 'Independent operation',
        text: 'Integrated computing and operating system support portable evidence intake.',
      },
      {
        title: 'Fleet design',
        text: 'We size docking quantities against shift changes, locations, upload windows and resilience requirements.',
      },
    ],
    specifications: [
      {
        label: 'Camera bays',
        value: '8 simultaneous acquisition and charging bays',
      },
      { label: 'Display', value: '10.1-inch HD touchscreen' },
      { label: 'Weight', value: '7.5 kg' },
      {
        label: 'Network',
        value: 'Gigabit Ethernet and 802.11 a/b/g/n/ac WLAN',
      },
      { label: 'Local storage', value: 'Up to 48 TB, configuration dependent' },
      { label: 'Operating range', value: '-10°C to +45°C' },
    ],
    process: [
      'Count devices returning per shift',
      'Map collection locations',
      'Measure network upload windows',
      'Define local buffering needs',
      'Add spare capacity and recovery procedures',
    ],
    faqs: [
      {
        question: 'How many cameras can an EDS30 handle at once?',
        answer:
          'The EDS30 supports simultaneous acquisition and charging for eight compatible body cameras.',
      },
      {
        question: 'Can it operate at remote sites?',
        answer:
          'Its portable design and local computing make it suitable for distributed collection, subject to power, storage and onward network requirements.',
      },
      {
        question: 'How many docking stations do we need?',
        answer:
          'The answer depends on fleet size, shift-change concentration, evidence volume and transfer speed. Sure Imports models this during the assessment.',
      },
    ],
    relatedSlugs: [
      'digital-evidence-management',
      'hytera-sc580',
      'hytera-gc550',
    ],
    sourceUrl: 'https://www.hytera.com/eu/products/ids-system/eds30',
    sourceLabel: 'Official Hytera EDS30 information',
  },
  {
    slug: 'live-command-and-dispatch',
    eyebrow: 'Real-time operations',
    title: 'Live body-camera command and dispatch',
    shortTitle: 'Live command and dispatch',
    description:
      'Connect field body cameras to authorised dispatchers for live video, location awareness and voice coordination.',
    searchIntent: [
      'live streaming body camera Nigeria',
      'body camera command centre',
    ],
    heroPoints: [
      'Live field video',
      'Location-aware supervision',
      'Push-to-talk coordination',
    ],
    audience:
      'Control rooms managing dispersed personnel, high-risk incidents or time-sensitive response',
    challengeTitle:
      'Move from reviewing incidents to supporting them in real time',
    challenge:
      'Connected command gives supervisors current field context while preserving local evidence. The design brings together SC580 cameras, mobile connectivity, dispatch services, workstations, roles and escalation procedures.',
    outcomes: [
      {
        title: 'Better situational awareness',
        text: 'Authorised dispatchers can see selected live feeds and understand what field personnel are facing.',
      },
      {
        title: 'Faster coordination',
        text: 'Voice communication and location information help teams direct support with less ambiguity.',
      },
      {
        title: 'Evidence continuity',
        text: 'Connected operation complements rather than replaces high-quality local recording and DEM intake.',
      },
    ],
    capabilities: [
      {
        title: 'Command workstations',
        text: 'Design dispatcher positions, monitors and audio peripherals around operational responsibilities.',
      },
      {
        title: 'Connectivity planning',
        text: 'Assess SIMs, APNs, WLAN, coverage, bandwidth and data consumption.',
      },
      {
        title: 'Permission design',
        text: 'Limit live-view and dispatch capabilities to authorised roles and groups.',
      },
      {
        title: 'Operational runbooks',
        text: 'Define activation, escalation, incident and service-recovery procedures.',
      },
    ],
    process: [
      'Identify live-use scenarios',
      'Map coverage and bandwidth',
      'Design dispatcher roles',
      'Pilot live video and PTT',
      'Train and measure operational response',
    ],
    faqs: [
      {
        question: 'Does every camera need live connectivity?',
        answer:
          'No. Connected cameras can be assigned only to sites, roles or incident types that benefit from live visibility.',
      },
      {
        question: 'What happens when network coverage drops?',
        answer:
          'The operational design should preserve local recording and define how footage is later transferred. Exact behaviour depends on the configured camera and platform.',
      },
      {
        question: 'Can we add live command after starting with recording?',
        answer:
          'A phased design may be possible. Compatibility, licences, mobile connectivity and command infrastructure should be planned from the outset.',
      },
    ],
    relatedSlugs: [
      'hytera-sc580',
      'digital-evidence-management',
      'body-cameras-for-security-companies',
    ],
  },
  ...[
    {
      slug: 'body-cameras-for-banks',
      industry: 'banks and financial institutions',
      title: 'Body-camera systems for banks and financial institutions',
      description:
        'Body-worn camera and digital evidence solutions for bank security, cash operations, facilities and incident accountability.',
      audience:
        'Bank security, facilities, operations, risk, compliance and technology teams',
      uses: [
        'Security and facility incidents',
        'Cash-movement and sensitive-area operations',
        'Dispute investigation and staff protection',
      ],
    },
    {
      slug: 'body-cameras-for-security-companies',
      industry: 'private security companies',
      title: 'Body cameras for private security companies',
      description:
        'Equip security personnel with body cameras, central evidence handling and optional live command visibility.',
      audience:
        'Guarding companies, control rooms, supervisors and enterprise security contractors',
      uses: [
        'Guard accountability and service verification',
        'Live escalation from client locations',
        'Complaint and incident investigation',
      ],
    },
    {
      slug: 'body-cameras-for-government',
      industry: 'government and public safety',
      title: 'Body-camera and evidence systems for government',
      description:
        'Plan scalable body-worn camera, docking and digital evidence deployments for public-sector and enforcement operations.',
      audience:
        'Government agencies, public safety, enforcement, customs and regulatory teams',
      uses: [
        'Field enforcement and inspection',
        'Public-facing incident records',
        'Auditable evidence and inter-agency review',
      ],
    },
    {
      slug: 'body-cameras-for-transport-and-logistics',
      industry: 'transport and logistics',
      title: 'Body cameras for transport and logistics operations',
      description:
        'Improve incident visibility and evidence capture across transport, delivery, fleet, terminal and logistics environments.',
      audience:
        'Transport operators, logistics providers, terminals, fleet managers and field supervisors',
      uses: [
        'Driver and field-team incidents',
        'Cargo handover and dispute records',
        'Terminal, depot and roadside operations',
      ],
    },
    {
      slug: 'body-cameras-for-oil-gas-and-industry',
      industry: 'oil, gas and industrial operations',
      title: 'Body cameras for oil, gas and industrial teams',
      description:
        'Capture and manage field evidence across industrial sites, utilities, inspections and high-accountability operations.',
      audience:
        'Oil and gas operators, utilities, manufacturers, inspectors and industrial security teams',
      uses: [
        'Site security and contractor incidents',
        'Inspection and maintenance records',
        'Remote supervision and safety review',
      ],
    },
  ].map(({ slug, industry, title, description, audience, uses }) => ({
    slug,
    eyebrow: 'Industry solution',
    title,
    shortTitle: title,
    description,
    searchIntent: [
      `body cameras for ${industry} Nigeria`,
      `body worn camera solution ${industry}`,
    ],
    heroPoints: uses,
    audience,
    challengeTitle: `Build accountability into ${industry} field operations`,
    challenge: `Body-worn video is most useful when it is connected to a clear operational policy. Sure Imports designs the device fleet, evidence intake, retention, access, training and support around the real incidents and governance responsibilities of ${industry}.`,
    outcomes: [
      {
        title: 'Objective incident context',
        text: 'Give authorised reviewers a clearer record of interactions and field conditions.',
      },
      {
        title: 'Safer, more accountable teams',
        text: 'Support personnel with visible recording practices and defined escalation workflows.',
      },
      {
        title: 'Governed evidence',
        text: 'Protect sensitive footage through controlled intake, permissions, audit and retention.',
      },
    ],
    capabilities: [
      {
        title: 'Fit-for-purpose devices',
        text: 'Choose compact evidence capture or connected live-command body cameras by role.',
      },
      {
        title: 'Multi-site collection',
        text: 'Position docking and upload capacity around branches, posts, depots or facilities.',
      },
      {
        title: 'Evidence governance',
        text: 'Define categories, retention, review, export and disclosure responsibilities.',
      },
      {
        title: 'Lifecycle support',
        text: 'Plan training, spares, warranty, upgrades and service continuity.',
      },
    ],
    process: [
      'Run a stakeholder workshop',
      'Define use cases and recording policy',
      'Design a representative pilot',
      'Review evidence and privacy controls',
      'Deploy in measured phases',
    ],
    faqs: [
      {
        question: `Can the solution be adapted for ${industry}?`,
        answer:
          'Yes. Camera allocation, retention, permissions, live features and training are configured around the organisation’s operating model rather than treated as a generic package.',
      },
      {
        question: 'Should we begin with a pilot?',
        answer:
          'Yes. A representative pilot helps validate policy, wearing, connectivity, docking throughput, evidence review and staff adoption before wider deployment.',
      },
      {
        question: 'Can Sure Imports respond to an RFP or tender?',
        answer:
          'Yes. Share the scope and submission timeline so we can review technical, commercial, delivery, training and support requirements.',
      },
    ],
    relatedSlugs: [
      'hytera-body-cameras',
      'digital-evidence-management',
      'live-command-and-dispatch',
    ],
  })),
];

export const solutionPageBySlug = new Map(
  solutionPages.map((page) => [page.slug, page]),
);
