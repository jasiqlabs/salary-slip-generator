const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  'Ten',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const scale = ['', 'Thousand', 'Million', 'Billion'];

function convertLessThanOneThousand(num) {
  if (num === 0) return '';
  
  const result = [];
  
  // Handle hundreds place
  if (num >= 100) {
    result.push(ones[Math.floor(num / 100)] + ' Hundred');
  }
  
  // Handle tens and ones places
  const remainder = num % 100;
  if (remainder > 0) {
    if (remainder < 20) {
      result.push(ones[remainder]);
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;
      result.push(tens[ten] + (one > 0 ? '-' + ones[one] : ''));
    }
  }
  
  return result.join(' ');
}

export function numberToWords(num) {
  if (num === 0) return 'Zero';
  
  const numStr = Math.floor(num).toString();
  const length = numStr.length;
  let chunks = [];
  
  // Split number into chunks of 3 digits from right to left
  for (let i = length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    chunks.unshift(numStr.slice(start, i));
  }
  
  const words = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = parseInt(chunks[i]);
    if (chunk === 0) continue;
    
    const chunkWords = convertLessThanOneThousand(chunk);
    if (chunkWords) {
      const scaleWord = scale[chunks.length - 1 - i];
      words.push(chunkWords + (scaleWord ? ' ' + scaleWord : ''));
    }
  }
  
  return words.join(' ').trim() ;
}
