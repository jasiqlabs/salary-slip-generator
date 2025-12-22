import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

export const Form = () => {
  const { register, control, watch, setValue } = useFormContext();
  
  const { fields: earningFields, append: appendEarning, remove: removeEarning } = useFieldArray({
    control,
    name: 'salaryDetails.earnings',
  });

  const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({
    control,
    name: 'salaryDetails.deductions',
  });

  const addEarning = () => {
    appendEarning({ name: '', amount: 0 });
  };

  const addDeduction = () => {
    appendDeduction({ name: '', amount: 0 });
  };

  const calculateTotal = (type) => {
    const items = watch(`salaryDetails.${type}`);
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const totalEarnings = calculateTotal('earnings');
  const totalDeductions = calculateTotal('deductions');
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-md font-medium">Company Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              {...register('company.name')}
              className="w-full"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <textarea
              {...register('company.address')}
              rows={2}
              className="w-full"
              placeholder="Enter company address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              {...register('company.logo')}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    // Update the form with the base64 string of the image
                    setValue('company.logo', event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Employee Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
            <input
              type="text"
              {...register('employee.name')}
              className="w-full"
              placeholder="Enter employee name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              {...register('employee.designation')}
              className="w-full"
              placeholder="Enter designation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input
              type="text"
              {...register('employee.employeeId')}
              className="w-full"
              placeholder="Enter employee ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              {...register('employee.department')}
              className="w-full"
              placeholder="Enter department"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Salary Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              {...register('salaryDetails.month')}
              className="w-full"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              {...register('salaryDetails.year', { valueAsNumber: true })}
              className="w-full"
              min={2000}
              max={2100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
            <input
              type="number"
              {...register('salaryDetails.workingDays', { valueAsNumber: true })}
              className="w-full"
              min={1}
              max={31}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Present Days</label>
            <input
              type="number"
              {...register('salaryDetails.presentDays', { valueAsNumber: true })}
              className="w-full"
              min={0}
              max={31}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Earnings</h4>
            <button
              type="button"
              onClick={addEarning}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Earning
            </button>
          </div>
          <div className="space-y-2">
            {earningFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <input
                  type="text"
                  {...register(`salaryDetails.earnings.${index}.name`)}
                  className="flex-1"
                  placeholder="Earning type"
                />
                <input
                  type="number"
                  {...register(`salaryDetails.earnings.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                  className="w-32"
                  placeholder="Amount"
                  min={0}
                  step="0.01"
                />
                <button
                  type="button"
                  onClick={() => removeEarning(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Deductions</h4>
            <button
              type="button"
              onClick={addDeduction}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Deduction
            </button>
          </div>
          <div className="space-y-2">
            {deductionFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <input
                  type="text"
                  {...register(`salaryDetails.deductions.${index}.name`)}
                  className="flex-1"
                  placeholder="Deduction type"
                />
                <input
                  type="number"
                  {...register(`salaryDetails.deductions.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                  className="w-32"
                  placeholder="Amount"
                  min={0}
                  step="0.01"
                />
                <button
                  type="button"
                  onClick={() => removeDeduction(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-lg font-semibold">₹{totalEarnings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Deductions</p>
              <p className="text-lg font-semibold">₹{totalDeductions.toFixed(2)}</p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-gray-500">Net Pay</p>
              <p className="text-xl font-bold text-blue-600">₹{netPay.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
