import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { inject } from "inversify";
import { UserService } from "../services/user.service";
import { LeadService } from "../lead.service";
import * as fs from 'fs';
import * as path from 'path';

const FILE_PATH = path.join(__dirname, '../data/sample_lead_data.json');

@controller('/leads')
export class UserController {
    constructor(
        @inject(LeadService) private leadService: LeadService
    ) {}

    @httpPost('/analyze')
    async analyzeLeads(req: Request, res: Response) {
        try {
            const data = await fs.promises.readFile(FILE_PATH, 'utf-8');
            const leadsData = JSON.parse(data);
            
            const response = this.leadService.loadLeadsFromJSON(leadsData);

            return res.status(200).json(response);
        } catch (error) {
            console.error('Error reading or processing lead data:', error);
            return res.status(500).json({ message: 'Error analyzing leads.' });
        }
    }

    @httpGet('/lead/:leadPhoneNumber')
async getLeadByPhoneNumber(req: Request, res: Response) {
    const incomingPhone = req.params.leadPhoneNumber;
    console.log('Received phone number:', incomingPhone);

    const normalizedPhone = this.leadService.normalizePhoneNumber(incomingPhone);
    console.log('Normalized incoming phone:', normalizedPhone);

    // Ensure leads are loaded before performing the search
    try {
        if (this.leadService.getLeads().length === 0) {
            // Load the leads data from file only if necessary
            try {
                const data = await fs.promises.readFile(FILE_PATH, 'utf-8');
                const leadsData = JSON.parse(data);
                this.leadService.loadLeadsFromJSON(leadsData);
            } catch (error) {
                console.error('Error reading the leads file:', error);
                return res.status(500).json({ message: 'Error loading leads data.' });
            }
        }

        const leadProfile = this.leadService.getLeadProfile(normalizedPhone);
        if (leadProfile) {
            console.log('Found lead:', leadProfile);
            return res.status(200).json(leadProfile);
        } else {
            console.log('Lead not found for phone:', normalizedPhone);
            return res.status(404).json({ message: 'Lead not found.' });
        }
    } catch (error) {
        console.error('Error in processing the request:', error);
        return res.status(500).json({ message: 'Error processing the request.' });
    }
}

@httpGet('/leadSummary')
async getLeadSummary(req: Request, res: Response) {
    console.log("Anything");
    
    // Log the loaded leads
    console.log('Leads:', this.leadService.getLeads());
    
    const summary = this.leadService.getLeadSummary();
    return res.status(200).json(summary);
}
}