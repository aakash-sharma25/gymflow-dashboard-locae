// Customer types for QR-based intake system
export type CustomerStatus = 'pending' | 'approved' | 'member';

export interface Customer {
    id: string;
    customerId: string;
    fullName: string;
    email: string;
    phone: string;
    age: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    membershipType: '1-month-trial' | '3-month-basic' | '6-month-standard' | '12-month-premium';
    startDate: string;
    createdAt: string;
    status: CustomerStatus;
    gymId?: string;
}

export interface CustomerFormData {
    fullName: string;
    email: string;
    phone: string;
    age: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    membershipType: '1-month-trial' | '3-month-basic' | '6-month-standard' | '12-month-premium';
    startDate: string;
    gymId?: string;
}

export const MEMBERSHIP_TYPES = {
    '1-month-trial': '1 Month Trial',
    '3-month-basic': '3 Month Basic',
    '6-month-standard': '6 Month Standard',
    '12-month-premium': '12 Month Premium',
} as const;
