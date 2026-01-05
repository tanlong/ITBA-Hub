
import { RoadmapItem, QuizQuestion } from './types';

export const INITIAL_ROADMAP: RoadmapItem[] = [
  {
    id: '1',
    titleEn: 'BA Planning & Monitoring',
    titleVi: 'BA Planning & Monitoring',
    descriptionEn: 'Establish the tasks, techniques, and tools needed to manage requirements.',
    descriptionVi: 'Thiết lập các tác vụ, kỹ thuật và công cụ cần thiết để quản lý yêu cầu.',
    contentEn: 'This knowledge area describes the tasks that business analysts perform to organize and coordinate the efforts of business analysts and stakeholders. These tasks produce outputs that are used as a key input and guidelines for the other tasks throughout the BABOK® Guide.\n\nKey Tasks:\n1. Plan Business Analysis Approach\n2. Plan Stakeholder Engagement\n3. Plan Business Analysis Governance\n4. Plan Business Analysis Information Management\n5. Identify Business Analysis Performance Improvements',
    contentVi: 'Vùng kiến thức này mô tả các nhiệm vụ mà các nhà phân tích nghiệp vụ thực hiện để tổ chức và phối hợp nỗ lực của các nhà phân tích nghiệp vụ và các bên liên quan. Các nhiệm vụ này tạo ra các kết quả đầu ra được sử dụng làm đầu vào chính và hướng dẫn cho các nhiệm vụ khác trong suốt Hướng dẫn BABOK®.\n\nCác nhiệm vụ chính:\n1. Lập kế hoạch phương pháp tiếp cận BA\n2. Lập kế hoạch thu hút sự tham gia của Stakeholders\n3. Lập kế hoạch quản trị BA\n4. Lập kế hoạch quản lý thông tin BA\n5. Xác định các cải tiến hiệu suất BA',
    order: 1,
  },
  {
    id: '2',
    titleEn: 'Elicitation & Collaboration',
    titleVi: 'Elicitation & Collaboration',
    descriptionEn: 'Prepare, conduct, and confirm elicitation activities with Stakeholders.',
    descriptionVi: 'Chuẩn bị, thực hiện và xác nhận các hoạt động khơi gợi yêu cầu với Stakeholders.',
    contentEn: 'Elicitation and Collaboration describes the tasks that business analysts perform to prepare for and conduct elicitation activities and confirm the results obtained. It also describes the communication with stakeholders once the business analysis information is elicited and the ongoing collaboration with them throughout the business analysis activities.',
    contentVi: 'Khơi gợi và Hợp tác mô tả các nhiệm vụ mà các nhà phân tích nghiệp vụ thực hiện để chuẩn bị và thực hiện các hoạt động khơi gợi và xác nhận kết quả thu được. Nó cũng mô tả việc giao tiếp với các bên liên quan sau khi thông tin phân tích nghiệp vụ được khơi gợi và sự hợp tác liên tục với họ trong suốt các hoạt động phân tích nghiệp vụ.',
    order: 2,
  },
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionEn: 'What is the primary goal of the "Elicitation & Collaboration" knowledge area?',
    questionVi: 'Mục tiêu chính của vùng kiến thức "Elicitation & Collaboration" là gì?',
    optionsEn: [
      'To define the solution scope',
      'To draw UML diagrams',
      'To obtain information from Stakeholders',
      'To manage project budget'
    ],
    optionsVi: [
      'Để xác định solution scope',
      'Để vẽ UML diagrams',
      'Để thu thập thông tin từ Stakeholders',
      'Để quản lý project budget'
    ],
    correctAnswerIndex: 2,
    explanationEn: 'Elicitation & Collaboration focuses on obtaining information from stakeholders and confirming the results. It involves ongoing communication and relationship building throughout the Business Analysis process. This ensures that the requirements gathered truly reflect the needs of the business and its users.',
    explanationVi: 'Elicitation & Collaboration tập trung vào việc thu thập thông tin từ stakeholders và xác nhận kết quả. Nó bao gồm giao tiếp liên tục và xây dựng mối quan hệ trong suốt quá trình Business Analysis. Điều này đảm bảo rằng các yêu cầu được thu thập phản ánh đúng nhu cầu của doanh nghiệp và người dùng.'
  }
];

export const TRANSLATIONS = {
  en: {
    appTitle: 'ITBA Mastery Hub',
    roadmap: 'Learning Roadmap',
    quiz: 'Practice Quiz',
    admin: 'Manage Content',
    languageToggle: 'Tiếng Việt',
    addStep: 'Add Step',
    addQuestion: 'Add Question',
    import: 'Import Data',
    export: 'Export Data',
    generateAI: 'Generate with AI',
    startQuiz: 'Start Quiz (5 Questions)',
    next: 'Next',
    finish: 'Finish',
    correct: 'Correct!',
    incorrect: 'Incorrect!',
    explanation: 'Detailed Explanation',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    details: 'Details',
    editRoadmap: 'Edit Roadmap Step',
    title: 'Title',
    description: 'Description (Short)',
    detailedContent: 'Detailed Content (Markdown supported)',
    order: 'Order',
  },
  vi: {
    appTitle: 'Trung tâm CNTT BA',
    roadmap: 'Lộ trình Học tập',
    quiz: 'Trắc nghiệm',
    admin: 'Quản lý Nội dung',
    languageToggle: 'English',
    addStep: 'Thêm Bước',
    addQuestion: 'Thêm Câu hỏi',
    import: 'Nhập Dữ liệu',
    export: 'Xuất Dữ liệu',
    generateAI: 'Tạo bằng AI',
    startQuiz: 'Bắt đầu (5 câu)',
    next: 'Tiếp theo',
    finish: 'Hoàn thành',
    correct: 'Chính xác!',
    incorrect: 'Sai rồi!',
    explanation: 'Mô tả Chi tiết',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    back: 'Quay lại',
    details: 'Chi tiết',
    editRoadmap: 'Sửa Bước Lộ trình',
    title: 'Tiêu đề',
    description: 'Mô tả (Ngắn)',
    detailedContent: 'Nội dung Chi tiết (Hỗ trợ Markdown)',
    order: 'Thứ tự',
  }
};
