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
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const scale = ['', 'Thousand', 'Lakh', 'Crore'];

export function numberToWords(num) {
  if (num === 0) return 'Zero';
  
  let numStr = Math.floor(num).toString();
  const start = numStr.length % 2 === 0 ? 0 : 1;
  
  let chunks = [];
  for (let i = start; i < numStr.length; i += 2) {
    chunks.push(numStr.substr(i, 2));
  }
  
  if (start === 1) {
    chunks[0] = '0' + chunks[0];
  }
  
  chunks = chunks.reverse();
  
  let words = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = parseInt(chunks[i]);
    
    if (chunk === 0) continue;
    
    const chunkWords = [];
    
    // Handle hundreds place
    if (chunk >= 100) {
      chunkWords.push(ones[Math.floor(chunk / 100)] + ' Hundred');
    }
    
    // Handle tens and ones places
    const remainder = chunk % 100;
    if (remainder > 0) {
      if (remainder < 20) {
        chunkWords.push(ones[remainder]);
      } else {
        const ten = Math.floor(remainder / 10);
        const one = remainder % 10;
        chunkWords.push(tens[ten] + (one > 0 ? ' ' + ones[one] : ''));
      }
    }
    
    // Add scale word if needed
    if (i < scale.length) {
      chunkWords.push(scale[i]);
    }
    
    words.unshift(chunkWords.join(' '));
  }
  
  return words.join(' ').trim();
}
