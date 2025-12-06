/**
 * Calculate risk score based on likelihood and impact
 * @param {number} likelihood - Likelihood value (1-5)
 * @param {number} impact - Impact value (1-5)
 * @returns {number} Risk score
 */
function calculateRiskScore(likelihood, impact) {
  return likelihood * impact;
}

/**
 * Determine risk level based on risk score
 * @param {number} riskScore - Calculated risk score
 * @returns {string} Risk level (Critical, High, Medium, Low)
 */
function getRiskLevel(riskScore) {
  if (riskScore >= 20) return 'Critical';
  if (riskScore >= 12) return 'High';
  if (riskScore >= 6) return 'Medium';
  return 'Low';
}

/**
 * Get color code for risk level
 * @param {string} riskLevel - Risk level
 * @returns {string} Color code
 */
function getRiskColor(riskLevel) {
  const colors = {
    'Critical': '#dc3545',  // Red
    'High': '#fd7e14',      // Orange
    'Medium': '#ffc107',    // Yellow
    'Low': '#28a745'        // Green
  };
  return colors[riskLevel] || '#6c757d';
}

module.exports = {
  calculateRiskScore,
  getRiskLevel,
  getRiskColor
};
