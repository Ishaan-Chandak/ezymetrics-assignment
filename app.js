const fs = require('fs');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const Campaign = require('./models/Campaign');
const { Parser } = require('json2csv');
const metrics = require('./reports/metrics')
const pdf = require('./reports/pdf')
const emailService = require('./mail/email');
app.use(express.json());

mongoose.connect('mongodb+srv://ishaa:1234567890@cluster0.tieb5.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const path = require('path');

const leader = {
    firstName: "Ishaan",
    lastName: "Chandak",
    email: "ishaanchandak3@gmail.com",
}

// Route to fetch leads
app.get('/api/leads', (req, res) => {
    const leads = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/leads.json')));
    res.json(leads);
});

// Route to fetch campaigns
app.get('/api/campaigns', (req, res) => {
    const campaigns = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/campaigns.json')));
    res.json(campaigns);
});

// Route to load data to the mongo-db database
app.get('/api/load-data', async (req, res) => {
    try {
        const leads = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/leads.json')));
        const campaigns = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/campaigns.json')));

        // Clear existing data
        await Lead.deleteMany({});
        await Campaign.deleteMany({});

        // Insert new data
        await Lead.insertMany(leads);
        await Campaign.insertMany(campaigns);

        res.status(200).send('Data loaded successfully');
    } catch (error) {
        res.status(500).send('Error loading data');
    }
});

// PDF report generation
app.get('/api/report/csv', async (req, res) => {
    try {
        // Fetch leads and campaigns from the database
        const leads = await Lead.find();
        const campaigns = await Campaign.find();

        // Calculate metrics
        const leadConversionRate = metrics.calculateLeadConversionRate(leads);
        const leadToOpportunityRatio = metrics.calculateLeadToOpportunityRatio(leads);
        const leadsPerSalesRep = metrics.calculateLeadsPerSalesRep(leads);
        const leadClosureTime = metrics.calculateLeadClosureTime(leads);
        const pipelineHealth = metrics.calculatePipelineHealth(leads);
        const leadAcquisitionCost = metrics.calculateLeadAcquisitionCost(1000, leads);
        const topHighValueLeads = metrics.getTopHighValueLeads(leads);
        const leadChurnRate = metrics.calculateLeadChurnRate(leads);
        const campaignPerformace = metrics.calculateCampaignsPerformance(campaigns)

        // Prepare data for CSV
        const reportData = [
            { Metric: 'Lead Conversion Rate', Value: leadConversionRate + "%" },
            { Metric: 'Lead-to-Opportunity Ratio', Value: leadToOpportunityRatio },
            { Metric: 'Leads per Sales Rep', Value: JSON.stringify(leadsPerSalesRep) },
            { Metric: 'Lead Closure Time', Value: JSON.stringify(leadClosureTime) },
            { Metric: 'Pipeline Health', Value: pipelineHealth + "%" },
            { Metric: 'Lead Acquisition Cost', Value: leadAcquisitionCost },
            { Metric: 'Top 5 High-Value Leads', Value: JSON.stringify(topHighValueLeads) },
            { Metric: 'Churn Rate', Value: leadChurnRate},
            { Metric: 'Total Leads Campaigns brought', Value: campaignPerformace }
        ];

        // Parse data to CSV
        const csvParser = new Parser();
        const csv = csvParser.parse(reportData);

        // Create PDF
        await pdf.generatePDFReport(reportData)

        // Send Mail to the leader of the firm if the churn percentage is higher than 50%
        if (leadChurnRate > 20) {
            const subject = "Increase in Churn Rate"
            const text = "Dear " + leader.firstName + ", \n\nThe overall churn rate of the firm has increased above 50%"
            const emailSent = await emailService.sendEmailNotification(leader.email, subject, text)
            if (emailSent) {
                console.log('Email sent successfully');
            } else {
                console.log('Failed to send email');
            }
        }

        // Set headers and send the CSV file
        res.header('Content-Type', 'text/csv');
        res.attachment('report.csv');
        res.send(csv);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error generating report');
    }
}); 