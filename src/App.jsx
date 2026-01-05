import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from './components/Form';
import { Preview } from './components/Preview';

function App() {
  const methods = useForm({
    defaultValues: {
      company: {
        name: 'JASIQ Labs',
        address: '123 Business Street, Tech City, 100001',
        logo: '',
      },
      employee: {
        name: 'John Doe',
        designation: 'Software Engineer',
        employeeId: 'EMP001',
        department: 'Engineering',
        bankAccount: '1234567890',
        panNumber: 'ABCDE1234F',
        ifscCode: 'HDFC0001234',
      },
      salaryDetails: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        workingDays: 30,
        presentDays: 26,
        earnings: [
          { name: 'Basic Salary', amount: 50000 },
          { name: 'HRA', amount: 20000 },
        ],
        deductions: [
          { name: 'Professional Tax', amount: 200 },
          { name: 'TDS', amount: 5000 },
        ],
      },
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Salary Slip Generator</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Salary Details</h2>
              <Form />
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Salary Slip Preview</h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <Preview isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </FormProvider>
  );
}

export default App;
