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
        string filePath = @"E:\app\onThi\BE\DocxParser\parsed.txt";
        string[] lines = File.ReadAllLines(filePath);

        List<ParsedQuestion> part1Questions = new List<ParsedQuestion>();
        List<ParsedQuestion> part2Questions = new List<ParsedQuestion>();

        List<string> part2Answers = new List<string>();

        List<string> part1Explanations = new List<string>();
        List<string> part2Explanations = new List<string>();

        // We will separate the file into segments based on line index
        // Part 1 Questions: Lines 1 to 736 (0 to 735)
        // Part 2 Questions: Lines 737 to 1299 (736 to 1298)
        // Part 2 Answers: Lines 1300 to 1420 (1299 to 1419)
        // Explanations: Lines 1421 to end (1420+)
        //   - Part 1 Explanations: up to line 1594 (1420 to 1593)
        //   - Part 2 Explanations: line 1595 to end (1594+)

        ParsedQuestion currentQ = null;

        // 1. Parse Part 1 Questions
        for (int i = 0; i < 736; i++)
        {
            string line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            var qMatch = Regex.Match(line, @"^(Q|Câu)\s*(\d+)\.\s*(.*)", RegexOptions.IgnoreCase);
            if (qMatch.Success)
            {
                if (currentQ != null) part1Questions.Add(currentQ);
                currentQ = new ParsedQuestion
                {
                    Text = qMatch.Groups[3].Value,
                    Options = new List<string>(),
                    CorrectAnswers = new List<string>()
                };
            }
            else if (currentQ != null)
            {
                var optMatch = Regex.Match(line, @"^([A-F])\.\s*(.*)");
                var ansMatch = Regex.Match(line, @"^Answer:\s*([A-F,\s]+)", RegexOptions.IgnoreCase);

                if (optMatch.Success)
                {
                    currentQ.Options.Add(optMatch.Groups[2].Value.Trim());
                }
                else if (ansMatch.Success)
                {
                    currentQ.CorrectAnswers = ansMatch.Groups[1].Value
                        .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(a => a.Trim())
                        .ToList();
                }
                else
                {
                    currentQ.Text += "\n" + line;
                }
            }
        }
        if (currentQ != null) part1Questions.Add(currentQ);

        // 2. Parse Part 2 Questions
        currentQ = null;
        for (int i = 736; i < 1299; i++)
        {
            string line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            if (line.Contains("Đề thêm")) continue;

            var qMatch = Regex.Match(line, @"^(Q|Câu)\s*(\d+):\s*(.*)", RegexOptions.IgnoreCase);
            if (qMatch.Success)
            {
                if (currentQ != null) part2Questions.Add(currentQ);
                currentQ = new ParsedQuestion
                {
                    Text = qMatch.Groups[3].Value,
                    Options = new List<string>(),
                    CorrectAnswers = new List<string>()
                };
            }
            else if (currentQ != null)
            {
                var optMatch = Regex.Match(line, @"^([A-F])\.\s*(.*)");
                if (optMatch.Success)
                {
                    currentQ.Options.Add(optMatch.Groups[2].Value.Trim());
                }
                else
                {
                    currentQ.Text += "\n" + line;
                }
            }
        }
        if (currentQ != null) part2Questions.Add(currentQ);

        // 3. Parse Part 2 Answers
        for (int i = 1299; i < 1420; i++)
        {
            string line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line) || line.Contains("ĐÁP ÁN ĐÚNG")) continue;

            // Lines look like: "C (<fmt:formatNumber>)"
            var ansMatch = Regex.Match(line, @"^([A-F,\s]+)");
            if (ansMatch.Success)
            {
                part2Answers.Add(ansMatch.Groups[1].Value.Trim());
            }
        }

        // Apply Part 2 Answers to Part 2 Questions
        for (int i = 0; i < part2Questions.Count; i++)
        {
            if (i < part2Answers.Count)
            {
                part2Questions[i].CorrectAnswers = part2Answers[i]
                    .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(a => a.Trim())
                    .ToList();
            }
        }

        // 4. Parse Explanations
        List<string> activeList = part1Explanations;
        string currentExp = "";

        for (int i = 1420; i < lines.Length; i++)
        {
            string line = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(line)) continue;

            if (i == 1594) // line 1595 starts Part 2 explanations
            {
                if (currentExp != "")
                {
                    activeList.Add(currentExp.Trim());
                    currentExp = "";
                }
                activeList = part2Explanations;
            }

            var expHeaderMatch = Regex.Match(line, @"^(Q|Câu)\s*(\d+)(?:\s*\([^)]+\))?\.\s*Đáp\s*án\s*([A-F,\s]+)(?::\s*(.*))?", RegexOptions.IgnoreCase);
            if (expHeaderMatch.Success)
            {
                if (currentExp != "")
                {
                    activeList.Add(currentExp.Trim());
                }
                currentExp = line;
            }
            else if (currentExp != "")
            {
                currentExp += "\n" + line;
            }
        }
        if (currentExp != "")
        {
            activeList.Add(currentExp.Trim());
        }

        // Match Explanations to Questions by index
        for (int i = 0; i < part1Questions.Count; i++)
        {
            if (i < part1Explanations.Count)
            {
                part1Questions[i].Explanation = part1Explanations[i];
            }
        }

        for (int i = 0; i < part2Questions.Count; i++)
        {
            if (i < part2Explanations.Count)
            {
                part2Questions[i].Explanation = part2Explanations[i];
            }
        }

        // Add ID prefix starting from 1 to all questions
        List<ParsedQuestion> allQuestions = new List<ParsedQuestion>();
        int id = 1;
        foreach (var q in part1Questions)
        {
            q.Id = id++;
            allQuestions.Add(q);
        }

        foreach (var q in part2Questions)
        {
            q.Id = id++;
            // Specific check for Q16 (which is question 16 in Part 2)
            // Wait, what is the index of Q16 in part2Questions?
            // "Câu 16" in Part 2 is index 15.
            if (q.Id == part1Questions.Count + 16)
            {
                q.Text += "\n![Chemical Tracking System Use Case](/images/swr302_q16.png)";
            }
            allQuestions.Add(q);
        }

        // Output JSON
        var jsonOptions = new JsonSerializerOptions { WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping };
        string json = JsonSerializer.Serialize(allQuestions, jsonOptions);
        File.WriteAllText(@"E:\app\onThi\BE\DocxParserApp\swr302_questions.json", json);
        Console.WriteLine($"Successfully matched {allQuestions.Count} questions in total. Written to JSON.");
    }
}

class ParsedQuestion
{
    public int Id { get; set; }
    public string Text { get; set; }
    public List<string> Options { get; set; }
    public List<string> CorrectAnswers { get; set; }
    public string Explanation { get; set; }
}
