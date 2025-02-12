import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(value: number) {
  const temp = Math.floor(value / 1000);
  return `$${temp}K`;
}

export const formatUriParams = (params: any) => {
  if (Object.entries(params).length == 0) return "";
  return (
    "?" +
    Object.entries(params)
      .filter(([_, val]) => {
        if (val + "" == "0") {
          return true;
        } else {
          return val != undefined && val != null && val != "";
        }
      })
      .map(([key, val]) => `${key}=${val}`)
      .join("&")
  );
};

export function paginateArray(
  items: any[],

  currentPage: number = 1,
  perPage: number = 20
) {
  // Ensure currentPage is at least 1
  currentPage = Math.max(currentPage, 1);

  // Calculate total pages
  const totalItems = items.length;
  const lastPage = Math.ceil(totalItems / perPage);

  // Ensure currentPage doesn't exceed lastPage
  currentPage = Math.min(currentPage, lastPage);

  // Calculate start and end index for slicing
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Get the paginated data
  const data = items.slice(startIndex, endIndex);

  console.log(currentPage);

  return {
    currentPage,
    data,
    lastPage,
    perPage,
    total: items.length,
  };
}

export function readableDate(date: Date) {
  const today = format(new Date(), "MMM, dd yyyy");
  if (format(date, "MMM, dd yyyy") == today) {
    return format(date, "HH:mm");
  } else {
    return format(date, "MMM, dd yyyy");
  }
}

export function fullReadableDate(date: Date) {
  const today = format(new Date(), "MMM, dd yyyy");
  if (format(date, "MMM, dd yyyy") == today) {
    return format(date, "HH:mm");
  } else {
    return format(date, "MMM, dd yyyy, HH:mm");
  }
}

export function formatSize(sizeInKb: number) {
  if (sizeInKb >= 1024) {
    const sizeInMb = (sizeInKb / 1024).toFixed(2);
    return `${sizeInMb} MB`;
  } else {
    return `${sizeInKb} KB`;
  }
}

const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];

export const getEmailSuggestions = (input: string): string[] => {
  // Split the input by '@' to differentiate the username and domain
  const [username, domainPart] = input.split("@");

  const suggestions: string[] = [];

  // Case 1: User has typed a complete valid email or a partial username
  if (domainPart) {
    // If a domain is typed, filter based on the domain
    emailDomains.forEach((domain) => {
      if (domain.startsWith(domainPart)) {
        suggestions.push(`${username}@${domain}`);
      }
    });
  } else {
    // Case 2: User has typed just a username or starts with '@'
    emailDomains.forEach((domain) => {
      if (username) {
        // Propose usernames with all the available domains
        suggestions.push(`${username}@${domain}`);
      } else {
        // If there's no username yet, suggest only domains
        suggestions.push(domain);
      }
    });
  }

  // Case 3: If a complete valid email is typed, return the exact input
  if (input.includes("@") && !suggestions.some((s) => s === input)) {
    suggestions.push(input);
  }

  return suggestions;
};

export function getTextDimensions(text: any, fontSize: any) {
  // Create a temporary div element
  const div = document.createElement("div");

  // Apply the desired styles to the element
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "nowrap";
  div.style.fontSize = `${fontSize}`;

  // Set the text content
  div.textContent = text;

  // Append the div to the body
  document.body.appendChild(div);

  // Measure the dimensions
  const dimensions = {
    width: div.offsetWidth,
    height: div.offsetHeight,
  };

  // Remove the div from the body
  document.body.removeChild(div);

  return dimensions;
}

export function computeCharsByWidth(containerWidth: number, fontSize: number) {
  // Approximate width of a single character (assumes average character width is half of fontSize)
  const charWidth = fontSize * 0.5; // Adjust as needed for specific font families

  // Number of characters that fit in the container width
  return Math.floor(containerWidth / charWidth);
}

export const formatDollars = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
