// Calculate risk score
export const calculateRiskScore = (likelihood, impact) => {
  return likelihood * impact;
};

// Get risk level based on score
export const getRiskLevel = (score) => {
  if (score >= 20) return 'Critical';
  if (score >= 12) return 'High';
  if (score >= 6) return 'Medium';
  return 'Low';
};

// Get color for risk level
export const getRiskColor = (level) => {
  const colors = {
    'Critical': '#dc3545',
    'High': '#fd7e14',
    'Medium': '#ffc107',
    'Low': '#28a745'
  };
  return colors[level] || '#6c757d';
};

// Get background color for risk level (lighter version)
export const getRiskBackgroundColor = (level) => {
  const colors = {
    'Critical': '#f8d7da',
    'High': '#fff3cd',
    'Medium': '#fff8e1',
    'Low': '#d4edda'
  };
  return colors[level] || '#e9ecef';
};

// Asset categories
export const ASSET_CATEGORIES = [
  'Hardware',
  'Software',
  'Data',
  'Personnel',
  'Facilities'
];

// Threat categories
export const THREAT_CATEGORIES = [
  'Cyber',
  'Internal',
  'External',
  'Physical',
  'Technical'
];

// Vulnerability categories
export const VULNERABILITY_CATEGORIES = [
  'Technical',
  'Configuration',
  'Process',
  'Design',
  'Physical'
];

// Treatment types
export const TREATMENT_TYPES = [
  'Mitigate',
  'Accept',
  'Transfer',
  'Avoid'
];

// Treatment statuses
export const TREATMENT_STATUSES = [
  'Planned',
  'In Progress',
  'Completed'
];

// Likelihood scale
export const LIKELIHOOD_SCALE = [
  { value: 1, label: 'Rare' },
  { value: 2, label: 'Unlikely' },
  { value: 3, label: 'Possible' },
  { value: 4, label: 'Likely' },
  { value: 5, label: 'Almost Certain' }
];

// Impact scale
export const IMPACT_SCALE = [
  { value: 1, label: 'Negligible' },
  { value: 2, label: 'Minor' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Major' },
  { value: 5, label: 'Catastrophic' }
];

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Format currency
export const formatCurrency = (value) => {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
};
