using System;
using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        string wduPath = @"E:\app\onThi\BE\DocxParser\wdu_paragraphs.txt";
        string ansPath = @"E:\app\onThi\BE\DocxParser\ans_paragraphs.txt";

        string[] wduLines = File.ReadAllLines(wduPath);
        string[] ansLines = File.ReadAllLines(ansPath);

        // 1. Parse WDU Questions (Main & Supplementary)
        var (mainQList, suppQList) = ParseWduDoc(wduLines);
        Console.WriteLine($"Extracted {mainQList.Count} Main Questions and {suppQList.Count} Supp Questions from WDU.docx");

        // 2. Parse Answer Tables from Answer&Explain.docx (lines 1..410)
        var (tableAnswersMain, tableAnswersSupp) = ParseAnswerTables(ansLines);
        Console.WriteLine($"Parsed {tableAnswersMain.Count} table answers for Main, {tableAnswersSupp.Count} for Supp.");

        // 3. Parse Detailed Explanations from Answer&Explain.docx (lines 345..end)
        var (expMain, expSupp) = ParseDetailedExplanations(ansLines);
        Console.WriteLine($"Parsed {expMain.Count} detailed explanations for Main, {expSupp.Count} for Supp.");

        // 4. Merge answers and explanations into Main Questions
        foreach (var q in mainQList)
        {
            if (q.CorrectAnswers.Count == 0 && tableAnswersMain.TryGetValue(q.DocNumber, out var tAns))
            {
                q.CorrectAnswers = tAns;
            }
            if (q.CorrectAnswers.Count == 0 && expMain.TryGetValue(q.DocNumber, out var expObj) && expObj.CorrectAnswers.Count > 0)
            {
                q.CorrectAnswers = expObj.CorrectAnswers;
            }

            if (expMain.TryGetValue(q.DocNumber, out var expData))
            {
                q.Explanation = expData.ExplanationText;
            }

            if (string.IsNullOrWhiteSpace(q.Explanation) && q.CorrectAnswers.Count > 0)
            {
                q.Explanation = $"Đáp án đúng: {string.Join(", ", q.CorrectAnswers)}.";
            }
        }

        // 5. Merge answers and explanations into Supp Questions
        foreach (var q in suppQList)
        {
            if (q.CorrectAnswers.Count == 0 && tableAnswersSupp.TryGetValue(q.DocNumber, out var tAns))
            {
                q.CorrectAnswers = tAns;
            }
            if (q.CorrectAnswers.Count == 0 && expSupp.TryGetValue(q.DocNumber, out var expObj) && expObj.CorrectAnswers.Count > 0)
            {
                q.CorrectAnswers = expObj.CorrectAnswers;
            }

            if (expSupp.TryGetValue(q.DocNumber, out var expData))
            {
                q.Explanation = expData.ExplanationText;
            }

            if (string.IsNullOrWhiteSpace(q.Explanation) && q.CorrectAnswers.Count > 0)
            {
                q.Explanation = $"Đáp án đúng: {string.Join(", ", q.CorrectAnswers)}.";
            }
        }

        // 6. Embed Images
        // Question 82 of Main
        var q82 = mainQList.FirstOrDefault(q => q.DocNumber == 82);
        if (q82 != null)
        {
            q82.Text += "\n![Minh họa](/images/wdu_q82.png)";
        }

        // Question 20 of Supp
        var suppQ20 = suppQList.FirstOrDefault(q => q.DocNumber == 20);
        if (suppQ20 != null)
        {
            suppQ20.Text += "\n![Minh họa](/images/wdu_q20_supp.png)";
        }

        // Question 21 of Supp
        var suppQ21 = suppQList.FirstOrDefault(q => q.DocNumber == 21);
        if (suppQ21 != null)
        {
            suppQ21.Text += "\n![Minh họa](/images/wdu_q21_supp.png)";
        }

        // 7. Re-index all questions sequentially
        List<ParsedQuestion> finalQuestions = new List<ParsedQuestion>();
        int currentId = 1;

        foreach (var q in mainQList)
        {
            q.Id = currentId++;
            finalQuestions.Add(q);
        }

        foreach (var q in suppQList)
        {
            q.Id = currentId++;
            finalQuestions.Add(q);
        }

        Console.WriteLine($"\nTotal Final Questions: {finalQuestions.Count}");

        int missingAnswersCount = finalQuestions.Count(q => q.CorrectAnswers.Count == 0);
        int missingExplanationsCount = finalQuestions.Count(q => string.IsNullOrWhiteSpace(q.Explanation));
        int missingOptionsCount = finalQuestions.Count(q => q.Options.Count == 0);

        Console.WriteLine($"Questions missing answers: {missingAnswersCount}");
        Console.WriteLine($"Questions missing explanations: {missingExplanationsCount}");
        Console.WriteLine($"Questions missing options: {missingOptionsCount}");

        foreach (var q in finalQuestions)
        {
            if (q.CorrectAnswers.Count == 0)
            {
                Console.WriteLine($"[WARN - Missing Answer] ID {q.Id} (Doc Q{q.DocNumber} Supp:{q.IsSupp})");
            }
            if (string.IsNullOrWhiteSpace(q.Explanation))
            {
                Console.WriteLine($"[WARN - Missing Explanation] ID {q.Id} (Doc Q{q.DocNumber} Supp:{q.IsSupp})");
            }
        }

        // 8. Output JSON to all required locations
        var jsonOptions = new JsonSerializerOptions 
        { 
            WriteIndented = true, 
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping 
        };

        var outputData = finalQuestions.Select(q => new
        {
            id = q.Id,
            text = q.Text.Trim(),
            options = q.Options.Select(o => o.Trim()).ToList(),
            correctAnswers = q.CorrectAnswers,
            explanation = q.Explanation.Trim()
        }).ToList();

        string json = JsonSerializer.Serialize(outputData, jsonOptions);

        string pathDocxParserApp = @"E:\app\onThi\BE\DocxParserApp\wdu_questions.json";
        string pathExamApi = @"E:\app\onThi\BE\ExamApi\wdu_questions.json";
        string pathExamApp = @"E:\app\onThi\app\exam-app\src\data\wdu_questions.json";

        File.WriteAllText(pathDocxParserApp, json);
        File.WriteAllText(pathExamApi, json);
        File.WriteAllText(pathExamApp, json);

        Console.WriteLine($"Saved JSON to:\n  - {pathDocxParserApp}\n  - {pathExamApi}\n  - {pathExamApp}");

        // 9. Copy image files to app/exam-app/public/images/
        string destImgDir = @"E:\app\onThi\app\exam-app\public\images";
        Directory.CreateDirectory(destImgDir);

        string srcImg1 = @"E:\app\onThi\BE\DocxParser\wdu_unzip\word\media\image1.png";
        string srcImg3 = @"E:\app\onThi\BE\DocxParser\wdu_unzip\word\media\image3.png";
        string srcImg2 = @"E:\app\onThi\BE\DocxParser\wdu_unzip\word\media\image2.png";

        File.Copy(srcImg1, Path.Combine(destImgDir, "wdu_q82.png"), true);
        File.Copy(srcImg3, Path.Combine(destImgDir, "wdu_q20_supp.png"), true);
        File.Copy(srcImg2, Path.Combine(destImgDir, "wdu_q21_supp.png"), true);

        Console.WriteLine("Copied 3 image files to public/images/");
    }

    static (List<ParsedQuestion> main, List<ParsedQuestion> supp) ParseWduDoc(string[] lines)
    {
        List<ParsedQuestion> mainList = new List<ParsedQuestion>();
        List<ParsedQuestion> suppList = new List<ParsedQuestion>();

        bool isSupp = false;
        ParsedQuestion curQ = null;

        for (int i = 0; i < lines.Length; i++)
        {
            string line = CleanLine(lines[i]);
            if (string.IsNullOrWhiteSpace(line)) continue;

            if (line.Contains("PHẦN CÂU HỎI BỔ SUNG") || line.Contains("Phần bổ sung"))
            {
                if (curQ != null)
                {
                    if (curQ.IsSupp) suppList.Add(curQ); else mainList.Add(curQ);
                    curQ = null;
                }
                isSupp = true;
            }

            var qMatch = Regex.Match(line, @"^(Câu|CÂU)\s+(\d+)\s*[:\.]?\s*(.*)", RegexOptions.IgnoreCase);
            if (qMatch.Success)
            {
                int qNum = int.Parse(qMatch.Groups[2].Value);
                string text = qMatch.Groups[3].Value;

                bool newIsSupp = isSupp;
                if (qNum == 1 && (mainList.Count > 50 || (curQ != null && curQ.DocNumber > 50)))
                {
                    newIsSupp = true;
                    isSupp = true;
                }

                if (curQ != null)
                {
                    if (curQ.IsSupp) suppList.Add(curQ); else mainList.Add(curQ);
                }

                curQ = new ParsedQuestion
                {
                    DocNumber = qNum,
                    IsSupp = newIsSupp,
                    Text = text,
                    Options = new List<string>(),
                    CorrectAnswers = new List<string>()
                };
            }
            else if (curQ != null)
            {
                var optMatch = Regex.Match(line, @"^([A-F])\.\s*(.*)");
                var ansMatch = Regex.Match(line, @"^Đáp án:\s*([A-F,\s]+)", RegexOptions.IgnoreCase);

                if (optMatch.Success)
                {
                    curQ.Options.Add(line);
                }
                else if (ansMatch.Success)
                {
                    var letters = ansMatch.Groups[1].Value.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var l in letters)
                    {
                        if (l.Length == 1 && l[0] >= 'A' && l[0] <= 'F')
                            curQ.CorrectAnswers.Add(l.ToUpper());
                    }
                }
                else if (curQ.Options.Count == 0)
                {
                    curQ.Text += "\n" + line;
                }
                else
                {
                    curQ.Options[curQ.Options.Count - 1] += "\n" + line;
                }
            }
        }
        if (curQ != null)
        {
            if (curQ.IsSupp) suppList.Add(curQ); else mainList.Add(curQ);
        }

        return (mainList, suppList);
    }

    static (Dictionary<int, List<string>> main, Dictionary<int, List<string>> supp) ParseAnswerTables(string[] lines)
    {
        var mainDict = new Dictionary<int, List<string>>();
        var suppDict = new Dictionary<int, List<string>>();

        int mode = 1;

        for (int i = 0; i < 410 && i < lines.Length; i++)
        {
            string line = CleanLine(lines[i]);
            if (string.IsNullOrWhiteSpace(line)) continue;

            if (line.Contains("Danh sách 27 câu hỏi bổ sung") || line.Contains("Phần 4:"))
            {
                mode = 2;
            }

            if (int.TryParse(line, out int num))
            {
                for (int j = i + 1; j < i + 4 && j < lines.Length; j++)
                {
                    string nextLine = CleanLine(lines[j]);
                    var letters = Regex.Matches(nextLine, @"\b[A-F]\b")
                        .Cast<Match>()
                        .Select(m => m.Value.ToUpper())
                        .Distinct()
                        .ToList();

                    if (letters.Count > 0)
                    {
                        var targetDict = (mode == 2 || (mode == 1 && num <= 27 && lines[i].Contains("bổ sung"))) ? suppDict : mainDict;
                        if (!targetDict.ContainsKey(num))
                        {
                            targetDict[num] = letters;
                        }
                        break;
                    }
                }
            }
        }

        return (mainDict, suppDict);
    }

    static (Dictionary<int, ExpData> main, Dictionary<int, ExpData> supp) ParseDetailedExplanations(string[] lines)
    {
        var mainDict = new Dictionary<int, ExpData>();
        var suppDict = new Dictionary<int, ExpData>();

        ExpData curExp = null;
        int curNum = -1;
        bool curIsSupp = false;

        for (int i = 0; i < lines.Length; i++)
        {
            string line = CleanLine(lines[i]);
            if (string.IsNullOrWhiteSpace(line)) continue;

            var headerMatch = Regex.Match(line, @"^(Câu|CÂU)\s+(\d+)\s*(\(Phần bổ sung\))?\s*[:\.]?\s*(.*)", RegexOptions.IgnoreCase);
            if (headerMatch.Success)
            {
                int qNum = int.Parse(headerMatch.Groups[2].Value);
                bool isSupp = headerMatch.Groups[3].Success || line.Contains("Phần bổ sung");

                if (curExp != null && curNum != -1)
                {
                    var targetDict = curIsSupp ? suppDict : mainDict;
                    if (!targetDict.ContainsKey(curNum))
                    {
                        targetDict[curNum] = curExp;
                    }
                }

                curNum = qNum;
                curIsSupp = isSupp;
                curExp = new ExpData
                {
                    DocNumber = qNum,
                    IsSupp = isSupp,
                    ExplanationText = line
                };
            }
            else if (curExp != null)
            {
                var ansMatch = Regex.Match(line, @"^Đáp án đúng:\s*([A-F,\s]+)", RegexOptions.IgnoreCase);
                if (ansMatch.Success)
                {
                    var letters = ansMatch.Groups[1].Value.Split(new[] { ',', ' ', '(', ')' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var l in letters)
                    {
                        if (l.Length == 1 && l[0] >= 'A' && l[0] <= 'F')
                        {
                            if (!curExp.CorrectAnswers.Contains(l.ToUpper()))
                                curExp.CorrectAnswers.Add(l.ToUpper());
                        }
                    }
                }

                curExp.ExplanationText += "\n" + line;
            }
        }

        if (curExp != null && curNum != -1)
        {
            var targetDict = curIsSupp ? suppDict : mainDict;
            if (!targetDict.ContainsKey(curNum))
            {
                targetDict[curNum] = curExp;
            }
        }

        return (mainDict, suppDict);
    }

    static string CleanLine(string raw)
    {
        int cPos = raw.IndexOf(": ");
        if (cPos >= 0 && cPos < 10) raw = raw.Substring(cPos + 2);
        return raw.Trim();
    }
}

class ParsedQuestion
{
    public int Id { get; set; }
    public int DocNumber { get; set; }
    public bool IsSupp { get; set; }
    public string Text { get; set; } = "";
    public List<string> Options { get; set; } = new();
    public List<string> CorrectAnswers { get; set; } = new();
    public string Explanation { get; set; } = "";
}

class ExpData
{
    public int DocNumber { get; set; }
    public bool IsSupp { get; set; }
    public List<string> CorrectAnswers { get; set; } = new();
    public string ExplanationText { get; set; } = "";
}
