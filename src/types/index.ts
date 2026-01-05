export interface SalaryComponent {
  name: string;
  amount: number;
}

export interface CompanyInfo {
  name: string;
  address: string;
  logo: string;
}

export interface EmployeeInfo {
  name: string;
  designation: string;
  employeeId: string;
  department: string;
  bankAccount: string;
  panNumber: string;
  ifscCode:string;
}

export interface SalaryDetails {
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  earnings: SalaryComponent[];
  deductions: SalaryComponent[];
}

export interface SalarySlipData {
  company: CompanyInfo;
  employee: EmployeeInfo;
  salaryDetails: SalaryDetails;
}

export type SalarySlipFormData = SalarySlipData;
