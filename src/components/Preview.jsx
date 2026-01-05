import { useRef, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Mail, Share2 } from 'lucide-react';
import { numberToWords } from '../utils/numberToWords';

export const Preview = ({ isGenerating, setIsGenerating }) => {
  const { watch } = useFormContext();
  const previewRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formData = watch();
  const { company, employee, salaryDetails } = formData;

  const totalEarnings = salaryDetails.earnings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalDeductions = salaryDetails.deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netPay = totalEarnings - totalDeductions;
  const monthName = new Date(2000, salaryDetails.month - 1, 1).toLocaleString('default', { month: 'long' });

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`salary-slip-${employee.name}-${monthName}-${salaryDetails.year}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareViaEmail = () => {
    const subject = `Salary Slip - ${employee.name} - ${monthName} ${salaryDetails.year}`;
    const body = `Dear ${employee.name},\n\nPlease find attached your salary slip for ${monthName} ${salaryDetails.year}.\n\nBest regards,\n${company.name}`;
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // const handleShareViaWhatsApp = () => {
  //   const message = `Here's your salary slip for ${monthName} ${salaryDetails.year}.`;
  //   window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  // };

const handleShareViaWhatsApp = async () => {
    if (isGenerating) return; // Prevent double clicks
    setIsGenerating(true);
    
    const message = `Here's your salary slip for ${monthName} ${salaryDetails.year}.`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      // 1. Generate PDF Blob (Same as before)
      if (!previewRef.current) return;
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Salary_Slip_${employee.name}.pdf`, { type: 'application/pdf' });

      // 2. SMART SHARE LOGIC
      if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        // MOBILE: Use native share (Directly attaches file to WhatsApp)
        await navigator.share({
          files: [file],
          title: 'Salary Slip',
          text: message,
        });
      } else {
        // DESKTOP: Download file + Open WhatsApp Web
        // We trigger the download immediately so the user has the file
        pdf.save(`Salary_Slip_${employee.name}.pdf`);
        
        // Then we open WhatsApp Web in a new tab with the message ready
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        
        // Optional: Alert the user so they know what to do
        alert("Because you are on a computer, we have downloaded the PDF. Please drag and drop it into the WhatsApp chat!");
      }

    } catch (error) {
      // Ignore "AbortError" (User closed the share menu)
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Final fallback
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return <div>Loading preview...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
        
        <button
          type="button"
          onClick={handleShareViaEmail}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Mail className="h-3.5 w-3.5 mr-1.5" />
          Email
        </button>
        
        <button
          type="button"
          onClick={handleShareViaWhatsApp}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Share
        </button>
      </div>
      
      <div 
        ref={previewRef} 
        className="bg-white p-8 shadow-sm border border-gray-200 rounded-lg"
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.name} 
                className="h-16 w-auto object-contain mb-2"
              />
            ) : (
              <div className="h-16 w-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm mb-2">
                Company Logo
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-600">{company.address}</p>
          </div>
          
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600">SALARY SLIP</h2>
            <p className="text-sm text-gray-600">
              {monthName} {salaryDetails.year}
            </p>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 my-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Employee Name</h3>
              <p className="text-gray-900">{employee.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Employee ID</h3>
              <p className="text-gray-900">{employee.employeeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Designation</h3>
              <p className="text-gray-900">{employee.designation}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Department</h3>
              <p className="text-gray-900">{employee.department}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bank Account</h3>
              <p className="text-gray-900">{employee.bankAccount}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">IFSC Code</h3>
              <p className="text-gray-900">{employee.ifscCode}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">PAN Number</h3>
              <p className="text-gray-900">{employee.panNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-medium">Earnings</h3>
            <h3 className="font-medium">Amount (₹)</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {salaryDetails.earnings.map((earning, index) => (
              <div key={index} className="flex justify-between py-2 px-4">
                <span>{earning.name}</span>
                <span>{Number(earning.amount).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="flex justify-between py-2 px-4 font-medium bg-gray-50">
              <span>Total Earnings</span>
              <span>{totalEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-medium">Deductions</h3>
            <h3 className="font-medium">Amount (₹)</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {salaryDetails.deductions.map((deduction, index) => (
              <div key={index} className="flex justify-between py-2 px-4">
                <span>{deduction.name}</span>
                <span>{Number(deduction.amount).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="flex justify-between py-2 px-4 font-medium bg-gray-50">
              <span>Total Deductions</span>
              <span>{totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-b-2 border-gray-900 py-4 my-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Net Payable</p>
              <p className="text-lg font-bold text-gray-900">₹{netPay.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {numberToWords(netPay)} Rupees Only
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Working Days: {salaryDetails.workingDays}</p>
              <p className="text-sm text-gray-600">Present Days: {salaryDetails.presentDays}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="h-12 border-b border-gray-200 mb-2"></div>
              <p className="text-sm text-gray-600">Employee Signature</p>
            </div>
            <div className="text-center">
              <div className="h-12 border-b border-gray-200 mb-2"></div>
              <p className="text-sm text-gray-600">Authorized Signatory</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              This is a system generated document and does not require a physical signature.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
