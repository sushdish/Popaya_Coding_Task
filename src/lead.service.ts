// src/services/lead.service.ts
import { injectable } from "inversify";
import { User } from "../src/entities/User"; 
import * as fs from 'fs';
import { join } from 'path';

const FILE_PATH = join(__dirname, "./data/sample_lead_data.json"); 

@injectable()
export class LeadService {
    private leads: User[] = [];

    
    loadLeadsFromJSON(leadsData: any) {
        console.log("Loading leads from JSON...");
        let validLeads = 0;
        let invalidLeads = 0;
    
        leadsData.forEach((lead: any) => {
            const normalizedPhone = this.normalizePhoneNumber(lead.phone);
            lead.phone = normalizedPhone;
    
            if (User.isValidPhoneNumber(lead.phone) && User.isValidEmail(lead.email)) {
                const cleanedLead = new User(
                    lead.lead_id,
                    lead.name,
                    lead.email,
                    lead.phone,
                    lead.property_type,
                    User.cleanBudget(lead.budget),
                    lead.location,
                    lead.preferred_property_type,
                    lead.contact_date,
                    lead.inquiry_notes
                );
                this.addLead(cleanedLead);
                validLeads++;
            } else {
                invalidLeads++;
            }
        });
    
        console.log('Loaded leads:', this.leads);  // Add this log to ensure leads are loaded
        this.saveLeadsToFile();
        return {
            message: 'Leads loaded and saved successfully',
            totalLeads: leadsData.length,
            validLeads,
            invalidLeads
        };
    }

    addLead(newLead: User) {
        const duplicate = this.leads.find(lead => lead.phone === newLead.phone);
        if (!duplicate) {
            this.leads.push(newLead);
            console.log('Added lead:', newLead);  // Log the added lead
        } else {
            console.log('Duplicate lead found:', newLead);  // Log if duplicate
        }
    }

    getLeads() {
        return this.leads;
    }

    normalizePhoneNumber(phone: string): string {
        return phone.replace(/[^\d]/g, '');  // Make sure this logic removes all non-numeric characters
    }
    
    getLeadProfile(phone: string): User | null {
        console.log('All leads:', this.leads);  // Log all leads
        const normalizedPhone = this.normalizePhoneNumber(phone);
        console.log('Normalized phone:', normalizedPhone);
        
        return this.leads.find(lead => lead.phone === normalizedPhone) || null;
    }

    getLeadSummary() {
        const totalLeads = this.leads.length;
        const uniqueLocations = [...new Set(this.leads.map(lead => lead.location))].length;
        const rentalLeads = this.leads.filter(lead => lead.property_type === 'rental');
        const saleLeads = this.leads.filter(lead => lead.property_type === 'sale');
        const avgRentalBudget = rentalLeads.reduce((acc, lead) => acc + lead.budget, 0) / rentalLeads.length;
        const avgSaleBudget = saleLeads.reduce((acc, lead) => acc + lead.budget, 0) / saleLeads.length;

        return {
            totalLeads,
            uniqueLocations,
            avgRentalBudget,
            avgSaleBudget
        };
    }

    
    saveLeadsToFile() {
        if (this.leads.length > 0) {  // Only save if there is valid data
            const jsonData = JSON.stringify(this.leads, null, 2);
            fs.promises.writeFile(FILE_PATH, jsonData, 'utf-8')
                .then(() => console.log('Leads saved successfully'))
                .catch(err => console.error('Error saving leads:', err));
        } else {
            console.log('No leads data to save.');
        }
    }
}