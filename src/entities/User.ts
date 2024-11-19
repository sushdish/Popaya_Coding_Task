export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public property_type: 'sale' | 'rental',
        public budget: number,
        public location: string,
        public preferred_property_type: 'apartment' | 'house' | 'condo', 
        public contact_date: string, 
        public inquiry_notes: string
    ) { }

    static isValidPhoneNumber(phone: string): boolean {
      
        const regex = /^[+]?(\d{1,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;
        return regex.test(phone);
    }

    static isValidEmail(email: string): boolean {
  
        const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return regex.test(email);
    }

    static cleanBudget(budget: any): number {
      
        return typeof budget === 'number' && budget > 0 ? budget : 0;
    }
}