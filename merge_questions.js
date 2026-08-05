const fs = require('fs');

const mdPath = 'E:/ky_5/SWR/FE/FE_Questions_Answers.md';
const jsonPath = 'E:/app/onThi/BE/ExamApi/swr302_questions.json';

// Utility to normalize string for matching
function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseMarkdown() {
    const lines = fs.readFileSync(mdPath, 'utf8').split('\n');
    const questions = [];
    let currentQ = null;
    let state = 'IDLE'; // IDLE, TEXT, OPTIONS, EXPL

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith('### Câu ')) {
            if (currentQ) questions.push(currentQ);
            currentQ = {
                Text: '',
                Options: [],
                CorrectAnswers: [],
                Explanation: ''
            };
            state = 'TEXT';
            continue;
        }

        if (!currentQ) continue;

        if (line.match(/^[A-F]\.\s/)) {
            state = 'OPTIONS';
            // clean the prefix A. B. C. if we want it to match existing options
            // Actually the current DB options don't have A. prefix? Wait!
            // Let's check `swr302_questions.json` options.
            // In DB: "It reduces development time..."
            // In Markdown: "A. It reduces development time..."
            // We should strip the "X. " prefix to match the current DB format!
            const optText = line.replace(/^[A-F]\.\s*/, '').trim();
            currentQ.Options.push(optText);
            continue;
        }

        if (line.startsWith('**Đáp án chính xác:**')) {
            state = 'ANSWER';
            let ansStr = line.replace('**Đáp án chính xác:**', '').trim();
            let answers = ansStr.split(/[,&]/).map(s => s.trim().toUpperCase()).filter(s => s);
            currentQ.CorrectAnswers = answers;
            continue;
        }

        if (line.startsWith('**Giải thích:**')) {
            state = 'EXPL';
            currentQ.Explanation = line + '\n';
            continue;
        }

        if (state === 'TEXT') {
            if (line.startsWith('---') || line.startsWith('>')) continue;
            currentQ.Text += (currentQ.Text ? '\n' : '') + line;
        } else if (state === 'EXPL') {
            if (line.startsWith('---')) continue;
            currentQ.Explanation += line + '\n';
        }
    }
    if (currentQ) questions.push(currentQ);
    return questions;
}

function mergeQuestions(parsedQs) {
    let existingQs = [];
    if (fs.existsSync(jsonPath)) {
        existingQs = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }

    let nextId = existingQs.length > 0 ? Math.max(...existingQs.map(q => q.Id || 0)) + 1 : 1;
    let updatedCount = 0;
    let addedCount = 0;

    for (let pq of parsedQs) {
        let normPq = normalizeText(pq.Text.substring(0, 50));
        if (normPq.length < 5) continue;

        // Try to match based on the first 50 chars of alphanumeric text
        let matched = existingQs.find(eq => {
            let normEq = normalizeText(eq.Text);
            return normEq.includes(normPq) || normPq.includes(normEq.substring(0, 50));
        });

        if (matched) {
            if (pq.Explanation) {
                matched.Explanation = pq.Explanation.trim();
                updatedCount++;
            }
        } else {
            existingQs.push({
                Id: nextId++,
                Text: pq.Text.trim(),
                Options: pq.Options,
                CorrectAnswers: pq.CorrectAnswers,
                Explanation: pq.Explanation ? pq.Explanation.trim() : null
            });
            addedCount++;
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(existingQs, null, 2));
    console.log(`Merge completed! Updated: ${updatedCount}, Added: ${addedCount}, Total: ${existingQs.length}`);
}

try {
    console.log('Parsing markdown...');
    const parsed = parseMarkdown();
    console.log(`Found ${parsed.length} questions in Markdown.`);
    
    console.log('Merging with JSON...');
    mergeQuestions(parsed);
} catch (e) {
    console.error('Error:', e);
}
