import { APIResponse } from "./types";

export const data: APIResponse = {
  files: [
    {
      name: "Project_Proposal.docx",
      created: "1693000000", // Example Unix timestamp for created date
      modified: "1695244800",
      imagepath: "/images/project_proposal.png",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      name: "Financial_Report_Q3.pdf",
      created: "1692900000", // Example Unix timestamp for created date
      modified: "1695158400",
      imagepath: "/images/financial_report_q3.png",
      mime: "application/pdf",
    },
    {
      name: "Homework1_Handout.pdf",
      created: "1692700000",
      modified: "1694909200",
      imagepath: "/images/homework1_handout.png",
      mime: "application/pdf",
    },
    {
      name: "Meeting_Notes_August.pdf",
      created: "1692500000",
      modified: "1694822800",
      imagepath: "/images/meeting_notes_august.png",
      mime: "application/pdf",
    },
    {
      name: "Todo_List.xlsx",
      created: "1692400000",
      modified: "1694650000",
      imagepath: "/images/todo_list.png",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    {
      name: "Ideas_For_Presentation.pptx",
      created: "1692300000",
      modified: "1694571200",
      imagepath: "/images/ideas_for_presentation.png",
      mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    },
  ],
};
