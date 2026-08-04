const fs = require('fs');
const path = require('path');

try {
  let content = fs.readFileSync('dethiFE.txt', 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  content = content.replace(/\\rightarrow/g, '→').replace(/\\le/g, '≤').replace(/\$/g, '');
  
  const lines = content.split(/\r?\n/);
  const questions = [];
  let currentQ = null;
  let state = 'NONE'; 
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    
    // Check for inline answers like "D. some text * Answer: B" or "D. text Đáp án: A"
    let answerInlineMatch = line.match(/(.*?)(\*?\s*(?:Đáp án|Answer):\s*[A-Z].*)/i);
    let inlineAnswerLine = null;
    if (answerInlineMatch && !line.match(/^(\*\s*)?(Đáp án|Answer):/i)) {
        line = answerInlineMatch[1].trim();
        inlineAnswerLine = answerInlineMatch[2].trim();
    }

    const cauMatch = line.match(/^Câu\s+(\d+)[:\.]?(.*)/i);
    if (cauMatch) {
      if (currentQ) questions.push(currentQ);
      currentQ = {
        id: parseInt(cauMatch[1]),
        text: cauMatch[2].trim(),
        options: [],
        correctAnswers: [],
        explanation: ''
      };
      state = 'QUESTION';
    } else if (currentQ) {
      if (line.match(/^(\*\s*)?(Đáp án|Answer):/i)) {
        state = 'ANSWER';
        const ansMatch = line.match(/[A-Z](?=\.|\s|,|$)/g);
        if (ansMatch) {
            currentQ.correctAnswers = [...new Set(ansMatch)].filter(c => ['A','B','C','D','E','F'].includes(c));
        } else {
            const specificMatch = line.match(/(?:Đáp án|Answer):\s*([A-Z])/i);
            if(specificMatch) currentQ.correctAnswers.push(specificMatch[1].toUpperCase());
        }
      } else if (line.match(/^(\*\s*)?Giải thích:/i)) {
        state = 'EXPLANATION';
        // Sometimes explanation has text on same line
        const expMatch = line.match(/^(\*\s*)?Giải thích:(.*)/i);
        if (expMatch && expMatch[2].trim()) {
           currentQ.explanation += expMatch[2].trim();
        }
      } else if (line.match(/^(\*\s*)?[A-F]\./)) {
        state = 'OPTIONS';
        currentQ.options.push(line.replace(/^(\*\s*)/, ''));
      } else {
        if (state === 'QUESTION') {
          currentQ.text += (currentQ.text ? '\n' : '') + line;
        } else if (state === 'OPTIONS') {
          currentQ.options[currentQ.options.length - 1] += '\n' + line;
        } else if (state === 'EXPLANATION') {
          currentQ.explanation += (currentQ.explanation ? '\n' : '') + line;
        } else if (state === 'ANSWER') {
          // In case answer spans multiple lines or has explanation on same line but we didn't catch it
          // Check if there is an inline "Giải thích" in the answer line
          const inlineExpMatch = line.match(/(.*?)(\*\s*)?Giải thích:(.*)/i);
          if (inlineExpMatch) {
             state = 'EXPLANATION';
             currentQ.explanation += inlineExpMatch[3].trim();
          }
        }
      }
    }

    if (inlineAnswerLine && currentQ) {
      state = 'ANSWER';
      const ansMatch = inlineAnswerLine.match(/[A-Z](?=\.|\s|,|$)/g);
      if (ansMatch) {
          currentQ.correctAnswers = [...new Set(ansMatch)].filter(c => ['A','B','C','D','E','F'].includes(c));
      } else {
          const specificMatch = inlineAnswerLine.match(/(?:Đáp án|Answer):\s*([A-Z])/i);
          if(specificMatch) currentQ.correctAnswers.push(specificMatch[1].toUpperCase());
      }
      
      // Also check if inlineAnswerLine contains explanation
      const inlineExpMatch = inlineAnswerLine.match(/(.*?)(\*\s*)?Giải thích:(.*)/i);
      if (inlineExpMatch) {
          state = 'EXPLANATION';
          currentQ.explanation += inlineExpMatch[3].trim();
      }
    }
  }
  
  if (currentQ) {
    questions.push(currentQ);
  }
  
  console.log(`Parsed ${questions.length} questions.`);
  const missingAns = questions.filter(q => q.correctAnswers.length === 0);
  console.log(`Questions missing answers: ${missingAns.length}`);
  
  const destPath = path.join(__dirname, 'exam-app', 'src', 'data', 'questions.json');
  fs.writeFileSync(destPath, JSON.stringify(questions, null, 2));
  console.log('Saved to', destPath);
} catch (e) {
  console.error(e);
}
