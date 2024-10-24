// 1. Lead Conversion Rate
const calculateLeadConversionRate = (leads) => {
    const totalLeads = leads.length;
    const closedLeads = leads.filter(lead => lead.status === 'Closed').length;
    return (closedLeads / totalLeads) * 100;
};

// 2. Lead-to-Opportunity Ratio
const calculateLeadToOpportunityRatio = (leads) => {
    const qualifiedLeads = leads.filter(lead => lead.status === 'Qualified').length;
    return (qualifiedLeads / leads.length);
};

// 3. Leads Assigned per Sales Rep
const calculateLeadsPerSalesRep = (leads) => {
    const repCount = leads.reduce((acc, lead) => {
        acc[lead.salesRep] = (acc[lead.salesRep] || 0) + 1;
        return acc;
    }, {});
    return repCount;
};

// 4. Lead Closure Time
const calculateLeadClosureTime = (leads) => {
    let totalClosureTime = 0;
    let closedLeadsCount = 0;
    let closureTimeArray = []
    leads.forEach(lead => {
        if (lead.status === 'Qualified' && lead.closedAt) {
            const createdAt = new Date(lead.createdAt);
            const closedAt = new Date(lead.closedAt);
            const closureTime = (closedAt - createdAt)
            closureTimeArray.push({
                leadID: lead.leadId,
                ClosureTime: closureTime
            })
            closedLeadsCount++;
        }
    });

    return closureTimeArray
};

// 5. Pipeline Health
const calculatePipelineHealth = (leads) => {
    const pipelineLeads = leads.filter(lead => ['Qualified', 'Interested'].includes(lead.status)).length;
    return (pipelineLeads / leads.length) * 100;
};

// 6. Lead Acquisition Cost (for Campaigns) - Assuming a campaign budget here
const calculateLeadAcquisitionCost = (campaignBudget, leads) => {
    return campaignBudget / leads.length;
};

// 7. Top 5 High-Value Leads (by Lead Score)
const getTopHighValueLeads = (leads) => {
    const top5 = leads.sort((a, b) => b.leadScore - a.leadScore).slice(0, 5)
    return top5.map(lead => ({
        leadId: lead.leadId,
        leadScore: lead.leadScore
      }));;
};

// 8. Lead Churn Rate
const calculateLeadChurnRate = (leads) => {
    const lostLeads = leads.filter(lead => lead.status === 'Lost').length;
    return (lostLeads / leads.length) * 100;
};

let totalLeadCampaign = 0
function calculateTotal(item) {
    console.log(item.leadsGenerated);
    totalLeadCampaign += item.leadsGenerated || 0; 
}

// 9. Total Leads in every campaign
const calculateCampaignsPerformance = (campaigns) => {
    totalLeadCampaign = 0; 
    campaigns.forEach(calculateTotal);
    return totalLeadCampaign;
};

module.exports = {calculateLeadConversionRate, calculateLeadToOpportunityRatio, calculateLeadsPerSalesRep, calculateLeadClosureTime, calculatePipelineHealth, calculateLeadAcquisitionCost, getTopHighValueLeads, calculateLeadChurnRate, calculateCampaignsPerformance};