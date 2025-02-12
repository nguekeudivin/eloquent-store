import { ReactNode } from "react";
import {
  FileText,
  FileSpreadsheet,
  Image,
  FileArchive,
  File,
} from "lucide-react";

// Function to get file icon based on the file extension
export const getFileIcon = (fileName: string, className: string): ReactNode => {
  // Extract file extension
  const extension = fileName.split(".").pop()?.toLowerCase();

  // Map extensions to Lucide icons
  const fileIcons: Record<string, ReactNode> = {
    pdf: <FileText className={`${className} text-red-500`} />,
    doc: <FileText className={`${className} text-blue-500`} />,
    docx: <FileText className={`${className} text-blue-500`} />,
    xls: <FileSpreadsheet className={`${className} text-green-500`} />,
    xlsx: <FileSpreadsheet className={`${className} text-green-500`} />,
    jpg: <Image className={`${className} text-yellow-500`} />,
    jpeg: <Image className={`${className} text-yellow-500`} />,
    png: <Image className={`${className} text-yellow-500`} />,
    gif: <Image className={`${className} text-purple-500`} />,
    zip: <FileArchive className={`${className} text-gray-500`} />,
    rar: <FileArchive className={`${className} text-gray-500`} />,
    txt: <FileText className={`${className} text-gray-500`} />,
    default: <File className={`${className} text-gray-500`} />, // Default icon
  };

  // Return the corresponding icon or the default icon
  return fileIcons[extension as string] || fileIcons.default;
};
