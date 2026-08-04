using System;
using System.IO;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string xml = File.ReadAllText(@"E:\app\onThi\BE\DocxParser\word\document.xml");
        var matches = Regex.Matches(xml, @"<w:p(?:\s+[^>]*)?>(.*?)<\/w:p>");
        using (var writer = new StreamWriter(@"E:\app\onThi\BE\DocxParser\parsed.txt"))
        {
            foreach(Match m in matches)
            {
                var pContent = m.Groups[1].Value;
                if (pContent.Contains("<w:drawing>")) {
                    writer.WriteLine("[IMAGE_PLACEHOLDER]");
                }
                
                var texts = Regex.Matches(pContent, @"<w:t(?:\s+[^>]*)?>(.*?)<\/w:t>");
                string line = "";
                foreach(Match t in texts)
                {
                    line += t.Groups[1].Value;
                }
                if (!string.IsNullOrWhiteSpace(line) || pContent.Contains("<w:drawing>")) 
                {
                    writer.WriteLine(line.Trim());
                }
            }
        }
    }
}
