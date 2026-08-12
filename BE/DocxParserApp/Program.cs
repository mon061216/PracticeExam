using System;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        string jsonPath = @"E:\app\onThi\BE\DocxParserApp\wdu_questions.json";
        string jsonText = File.ReadAllText(jsonPath);

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var questions = JsonSerializer.Deserialize<List<QuestionModel>>(jsonText, options);

        if (questions == null)
        {
            Console.WriteLine("Failed to load questions JSON.");
            return;
        }

        var newExplanations = new Dictionary<int, string>
        {
            {
                1,
                "Đáp án đúng: C (Olfactory).\n\n• Vì sao đúng: Khứu giác (Olfactory - mùi hương) rất hiếm khi được sử dụng làm phương thức đầu ra trong các ứng dụng tương tác hiện nay do rào cản kỹ thuật và phần cứng chưa phổ biến.\n\n• Vì sao sai: Thị giác (Visual), Thính giác (Auditory) và Xúc giác (Tactile/Haptic) là ba phương thức đầu ra cực kỳ phổ biến (ví dụ: màn hình, loa, cục rung trên điện thoại hoặc tay cầm chơi game).\n\n• Tổng kết kiến thức: Đầu ra (output modality) của các hệ thống máy tính hiện tại vẫn tập trung tối đa vào thị giác và thính giác. Việc thiết kế tương tác chủ yếu xoay quanh việc kích thích hai giác quan này."
            },
            {
                2,
                "Đáp án đúng: A (True).\n\n• Vì sao đúng: \"Ecological validity\" (Tính hợp lệ sinh thái) đòi hỏi môi trường kiểm thử phải phản ánh chính xác môi trường sử dụng thực tế của sản phẩm. Kiểm thử một app di động được thiết kế cho môi trường ồn ào nhưng lại thực hiện trên máy bàn ở phòng lab yên tĩnh là một sự sai lệch bối cảnh nghiêm trọng.\n\n• Tổng kết kiến thức: Bối cảnh sử dụng ảnh hưởng rất lớn đến hành vi. Để kết quả Usability Test có giá trị, môi trường thử nghiệm phải được thiết lập càng giống với thực tế càng tốt."
            },
            {
                3,
                "Đáp án đúng: E (All of the others).\n\n• Vì sao đúng: Người điều phối (facilitator) có nhiệm vụ giữ nhịp điệu cho buổi động não: họ ngăn chặn việc đi quá xa chủ đề (A), khơi gợi năng lượng khi nhóm bế tắc (B), ngăn việc chỉ trích ý tưởng quá sớm (C) và tránh để nhóm sa đà vào một ý tưởng duy nhất (D).\n\n• Tổng kết kiến thức: Brainstorming không phải là thảo luận tự do. Nó luôn cần một người cầm trịch trung lập để bảo vệ quy tắc cốt lõi: \"Tập trung vào số lượng, trì hoãn sự phán xét\"."
            },
            {
                4,
                "Đáp án đúng: B (False).\n\n• Vì sao đúng: Người dùng chỉ cần xây dựng một \"mô hình nhận thức\" (mental model) đủ để biết thao tác nào sẽ dẫn đến kết quả nào. Họ hoàn toàn KHÔNG cần phải hiểu cấu trúc kỹ thuật (technical underpinnings) bên dưới lớp code của hệ thống đó.\n\n• Tổng kết kiến thức: Giao diện người dùng (UI) tốt đóng vai trò che giấu đi sự phức tạp của kỹ thuật, giúp người dùng dễ dàng thao tác thông qua các phép ẩn dụ (metaphors) quen thuộc trong đời sống."
            },
            {
                5,
                "Đáp án đúng: D (Current values of all system inputs and variables, and rules for operating on those values).\n\n• Vì sao đúng: \"Trạng thái của hệ thống\" (system's state) bao hàm toàn bộ bức tranh hiện tại: bao gồm tất cả các giá trị đầu vào, các biến số tại thời điểm hiện tại và các quy tắc mà hệ thống sử dụng để xử lý những giá trị đó.\n\n• Vì sao sai: Các lựa chọn A, B, C chỉ là những thành phần đơn lẻ (như vị trí người dùng, hoặc quy tắc cung cấp phản hồi), không đủ toàn diện để đại diện cho toàn bộ trạng thái.\n\n• Tổng kết kiến thức: Bất cứ khi nào người dùng tương tác (click, gõ phím), họ đang làm thay đổi các biến số đầu vào, từ đó chuyển hệ thống từ trạng thái này sang một trạng thái khác."
            },
            {
                6,
                "Đáp án đúng: B (False).\n\n• Vì sao đúng: Storyboard (Bảng phân cảnh) sinh ra để mô tả quá trình và ngữ cảnh người dùng tương tác với sản phẩm. Bạn chỉ cần những nét vẽ phác thảo thô sơ (như người que - stick figures) là đã đủ để truyền đạt ý tưởng cốt lõi.\n\n• Tổng kết kiến thức: Trong thiết kế UX, giá trị của Storyboard nằm ở cốt truyện và khả năng truyền tải thông tin, không đòi hỏi tính thẩm mỹ hay kỹ năng hội họa cao cấp."
            },
            {
                7,
                "Đáp án đúng: B (The ability of the user to tell if the system did what the user was trying to do).\n\n• Vì sao đúng: \"Vực thẳm đánh giá\" (Gulf of Evaluation) mô tả khó khăn của người dùng khi nhìn vào phản hồi của hệ thống để xác định xem thao tác họ vừa làm đã thành công hay chưa.\n\n• Vì sao sai: Đánh giá xem hệ thống có hợp với nhu cầu cá nhân hay không (C), hoặc sự khác biệt về xếp hạng app trên cửa hàng (D) không liên quan đến thuật ngữ học thuật về quy trình tương tác hành vi này.\n\n• Tổng kết kiến thức: Thiết kế UX phải cung cấp các phản hồi tức thì và rõ ràng (Ví dụ: báo lỗi màu đỏ, báo thành công màu xanh) để giúp người dùng vượt qua Vực thẳm đánh giá."
            },
            {
                8,
                "Đáp án đúng: B (False).\n\n• Vì sao đúng: Việc thiết lập giá trị mặc định (defaults) sai là một lỗi cực kỳ nghiêm trọng. Trong thực tế hành vi, phần lớn người dùng sẽ lười biếng hoặc không biết cách chỉnh sửa, do đó họ sẽ giữ nguyên mọi cài đặt mặc định của hệ thống.\n\n• Tổng kết kiến thức: \"Sức mạnh của mặc định\" là một vũ khí thiết kế sắc bén. Cài đặt mặc định hợp lý sẽ giúp người dùng tiết kiệm thời gian, công sức và phòng tránh sai sót."
            },
            {
                9,
                "Đáp án đúng: B (False).\n\n• Vì sao đúng: Khi phác thảo (sketching), những ý tưởng đầu tiên trào ra thường rất hiển nhiên và sáo rỗng. Việc bạn \"cạn kiệt ý tưởng lần đầu tiên\" mới chính là lúc bộ não bị ép buộc phải sáng tạo vượt giới hạn để tìm ra những giải pháp đột phá. Do đó, tuyệt đối không được dừng lại.\n\n• Tổng kết kiến thức: Quá trình Ideation (Tìm kiếm ý tưởng) yêu cầu tính kỷ luật để vượt qua vùng an toàn. Các kỹ thuật như \"Crazy 8s\" (vẽ 8 ý tưởng trong 8 phút) sinh ra chính là để ngăn bạn dừng lại quá sớm."
            },
            {
                10,
                "Đáp án đúng: A (An affordance).\n\n• Vì sao đúng: \"Tính gợi năng\" (Affordance) là đặc tính vật lý hoặc thiết kế ngoại hình của một vật thể, tự nó gợi ý cho người dùng cách để thao tác. (Ví dụ: Một tay nắm cửa lồi ra gợi ý hành động nắm và kéo, một nút bấm có đổ bóng gợi ý hành động ấn xuống).\n\n• Vì sao sai: Signpost (biển chỉ dẫn), Signal (tín hiệu), hay Constraint (sự ràng buộc) không mang hàm ý \"ngoại hình vật lý tự gợi ý hành động\".\n\n• Tổng kết kiến thức: Một giao diện có tính affordance cao sẽ cực kỳ trực quan, người dùng có thể nhìn vào là biết phải làm gì ngay mà không cần đọc văn bản hướng dẫn."
            },
            {
                11,
                "Đáp án đúng: B (A schema).\n\n• Vì sao đúng: Trong tâm lý học nhận thức, Lược đồ (Schema) là một mạng lưới hoặc tập hợp các khái niệm, kiến thức có sự liên kết chặt chẽ với nhau và được lưu trữ trong trí nhớ dài hạn.\n\n• Vì sao sai: Gestalt là lý thuyết về tri giác hình ảnh tổng thể. Các lựa chọn Thought (Suy nghĩ) hay Rule (Quy tắc) không phản ánh cấu trúc lưu trữ của trí nhớ.\n\n• Tổng kết kiến thức: Người dùng luôn tiếp cận một sản phẩm mới bằng các \"Schema\" cũ đã có sẵn trong đầu họ (Ví dụ: Thấy biểu tượng bánh răng là biết cài đặt). Thiết kế UX tận dụng các Lược đồ này để rút ngắn thời gian làm quen."
            },
            {
                12,
                "Đáp án đúng: C (Reification).\n\n• Vì sao đúng: Cụ thể hóa/Hiện thực hóa (Reification) là quá trình chuyển đổi một ý tưởng vô hình, trừu tượng trong đầu thành một hình thái vật lý, cụ thể mà con người có thể cảm nhận hoặc chạm vào được.\n\n• Vì sao sai: Assessment (Đánh giá), Communication (Giao tiếp), Reflection (Phản tỉnh) đều không có ý nghĩa biến ý tưởng thành vật thể thực tế.\n\n• Tổng kết kiến thức: Việc làm Nguyên mẫu (Prototyping) chính là ứng dụng phổ biến nhất của khái niệm Reification, giúp các thành viên trong dự án có thứ cầm nắm được để tranh luận."
            },
            {
                13,
                "Đáp án đúng: A (A signifier).\n\n• Vì sao đúng: Dấu hiệu chỉ dẫn (Signifier) là các thành tố như từ ngữ (verbiage) hoặc hình ảnh (imagery) được bổ sung vào để giao tiếp rõ ràng với người dùng về việc điều gì sẽ xảy ra. (Ví dụ: Chữ \"Đẩy\" dán trên cánh cửa bằng kính).\n\n• Vì sao sai: Feedback (phản hồi) chỉ xuất hiện sau khi bạn đã thực hiện hành động. Icon (biểu tượng) chỉ là một dạng nhỏ của signifier.\n\n• Tổng kết kiến thức: Nếu Affordance quyết định một đồ vật có thể làm được gì, thì Signifier chỉ ra cụ thể vị trí và cách thức tương tác. Trên các giao diện cảm ứng phẳng, signifier là yếu tố sống còn vì chúng không có các nút bấm lồi thật sự."
            },
            {
                14,
                "Đáp án đúng: A (The use of keyboard \"accelerator\" shortcuts).\n\n• Vì sao đúng: Nguyên tắc UX \"Tính linh hoạt và hiệu quả\" (Flexibility and efficiency of use) khuyến khích việc tạo ra những phím tắt (accelerator shortcuts) để người dùng có kinh nghiệm (expert users) thao tác nhanh gọn, vượt qua các quy trình menu nhiều bước dành cho người mới.\n\n• Vì sao sai: Loại bỏ các lệnh để tránh lỗi (D) hay ép hiển thị toàn bộ đồ họa (B) đi ngược lại sự linh hoạt tùy biến. Tối ưu thời gian tải trang (C) là vấn đề hiệu suất kỹ thuật.\n\n• Tổng kết kiến thức: Thiết kế tốt phục vụ cả hai đối tượng: nó cho phép người dùng mới làm chậm mà chắc qua giao diện trực quan, đồng thời cho phép người dùng cũ dùng phím tắt (như Ctrl + C) để làm nhanh."
            },
            {
                15,
                "Đáp án đúng: D (Match between system and the real world).\n\n• Vì sao đúng: \"Sự tương đồng giữa hệ thống và thế giới thực\" yêu cầu hệ thống phải giao tiếp bằng ngôn ngữ, từ ngữ và các khái niệm quen thuộc với người dùng. Việc hiển thị mã hệ thống khó hiểu (ví dụ: \"Error code 0x892A\") vi phạm trực tiếp nguyên tắc này.\n\n• Tổng kết kiến thức: Hệ thống phải nói tiếng của con người, không được bắt con người phải học từ vựng của máy móc."
            },
            {
                16,
                "Đáp án đúng: B (You can work out aspects of graphic design such as fonts and color schemes, which have the greatest impact on usability).\n\n• Vì sao đúng: Nguyên mẫu độ trung thực thấp (Lo-fi prototype) thường làm bằng giấy trắng đen hoặc nét phác thảo thô, do đó bạn KHÔNG THỂ dùng nó để làm việc với các yếu tố đồ họa như font chữ hay bảng màu. Do đó, đây không phải là ưu điểm.\n\n• Vì sao sai (Vì đây là những ưu điểm ĐÚNG): Lo-fi rẻ và dễ sửa chữa (D), giúp tìm ra lỗi cấu trúc sớm (A), và người xem dễ đánh giá khách quan hơn vì nó trông giống bản nháp chưa hoàn thiện (C).\n\n• Tổng kết kiến thức: Lo-fi Prototype tập trung kiểm tra Luồng người dùng (User Flow) và Kiến trúc thông tin. Mọi yếu tố trang trí (màu sắc, font) sẽ được dời sang giai đoạn Hi-fi Prototype."
            },
            {
                17,
                "Đáp án đúng: B (Instrument).\n\n• Vì sao đúng: Trong bối cảnh nghiên cứu hàn lâm và thống kê, \"Công cụ\" (Instrument) là thuật ngữ dùng để chỉ bảng câu hỏi thực tế hoặc cấu trúc kịch bản mà bạn trực tiếp sử dụng để thu thập dữ liệu từ con người.\n\n• Vì sao sai: Respondent (Người trả lời khảo sát), Population (Quần thể nghiên cứu) hay Frame (Khung chọn mẫu) đều dùng để chỉ tệp đối tượng con người, không phải bảng câu hỏi."
            },
            {
                18,
                "Đáp án đúng: D (Asking one group of respondents to forward the survey invite to their social networks.).\n\n• Vì sao đúng: Việc yêu cầu người dùng chuyển tiếp (forward) lời mời khảo sát cho mạng lưới bạn bè của họ làm gia TĂNG thêm công sức, tạo thành gánh nặng (burden) tâm lý và thời gian cho họ. Do đó, đây không phải là cách để giảm gánh nặng.\n\n• Vì sao sai (Vì là các cách giảm gánh nặng ĐÚNG): Nhắm đúng đối tượng trải nghiệm (A), làm khảo sát càng ngắn càng tốt (B), và viết câu hỏi dễ hiểu, không đánh đố (C).\n\n• Tổng kết kiến thức: Để tăng tỷ lệ phản hồi khảo sát (response rate), bạn phải loại bỏ mọi rào cản về mặt công sức. Đừng bắt người dùng làm những việc mà bạn có thể tự làm."
            },
            {
                19,
                "Đáp án đúng: B (To reduce recruitment costs).\n\n• Vì sao đúng: \"Panel\" là một tệp dữ liệu gồm những người đã đăng ký sẵn sàng tham gia trả lời khảo sát. Khi sử dụng danh sách này, bạn cắt giảm được khâu chạy quảng cáo tìm người, nhờ đó giảm đáng kể chi phí và thời gian tuyển dụng (recruitment costs).\n\n• Tổng kết kiến thức: Sử dụng Panel là một giải pháp đánh đổi giữa việc tiết kiệm nguồn lực và rủi ro dính phải nhóm người trả lời khảo sát theo thói quen (professional survey-takers) chỉ để kiếm tiền."
            },
            {
                20,
                "Đáp án đúng: A (Launch an exploratory survey to determine UX goals.).\n\n• Vì sao đúng: Khảo sát diện rộng là một công cụ tốn kém. Việc tung ra một bản khảo sát chỉ để... tìm xem mục tiêu UX của dự án là gì là một quy trình làm việc ngược. Bạn phải có mục tiêu TỪ TRƯỚC rồi mới chọn khảo sát làm phương pháp đo lường.\n\n• Vì sao sai (Vì là các cách làm ĐÚNG): Tự phân tích lý do cần số liệu này (B), vạch ra cốt truyện chứng minh vì sao cần dùng khảo sát (C), và phải xác định mục tiêu xong xuôi mới chọn các chỉ số đo lường (D).\n\n• Tổng kết kiến thức: \"Survey is a tool, not a strategy\" (Khảo sát chỉ là công cụ, không phải chiến lược). Hãy bắt đầu với Câu hỏi nghiên cứu (Mục tiêu), sau đó mới tìm đến các phương thức thực thi (Khảo sát/Phỏng vấn)."
            }
        };

        foreach (var q in questions)
        {
            if (newExplanations.ContainsKey(q.Id))
            {
                q.Explanation = newExplanations[q.Id];
            }
        }

        var jsonOutOptions = new JsonSerializerOptions 
        { 
            WriteIndented = true, 
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping 
        };

        string updatedJson = JsonSerializer.Serialize(questions, jsonOutOptions);

        string p1 = @"E:\app\onThi\BE\DocxParserApp\wdu_questions.json";
        string p2 = @"E:\app\onThi\BE\ExamApi\wdu_questions.json";
        string p3 = @"E:\app\onThi\app\exam-app\src\data\wdu_questions.json";

        File.WriteAllText(p1, updatedJson);
        File.WriteAllText(p2, updatedJson);
        File.WriteAllText(p3, updatedJson);

        Console.WriteLine("Successfully updated explanations for Questions 1..20 across all JSON locations.");
    }
}

class QuestionModel
{
    public int Id { get; set; }
    public string Text { get; set; } = "";
    public List<string> Options { get; set; } = new();
    public List<string> CorrectAnswers { get; set; } = new();
    public string Explanation { get; set; } = "";
}
