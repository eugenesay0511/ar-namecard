// Everyone's namecard details. The key is the link for that person:
//   eugenesay  ->  https://<your-site>/eugenesay
// Keys must be lowercase letters, numbers or dashes.
// Empty or missing fields are hidden from the card and left out of the saved contact.
export const people = {
  eugenesay: {
    firstName: "Eugene",
    lastName: "Say",
    position: "Software Developer",
    company: "Apecia",
    email: "eugene_say@apecia.com",
    linkedin: "https://www.linkedin.com/in/eugene-say-541729250",
    website: "https://apecia.com",
  },

  yungsin: {
    firstName: "Yung Sin",
    lastName: "Tan",
    position: "Software Developer",
    company: "Apecia",
    email: "yungsin_tan@apecia.com",
    linkedin: "https://www.linkedin.com/in/yungsintan/",
    website: "https://apecia.com",
  },
};

// Card shown when the link has no name, e.g. https://<your-site>/
// Set to null to show "card not found" instead.
export const DEFAULT_PERSON = "eugenesay";

export function getSlugFromUrl() {
  const base = import.meta.env.BASE_URL;
  const path = window.location.pathname;
  const rest = path.startsWith(base) ? path.slice(base.length) : path;
  return rest.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
}

export function findPerson(slug) {
  const key = slug || DEFAULT_PERSON;
  return key && Object.hasOwn(people, key) ? people[key] : null;
}

export const fullName = (person) =>
  `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim();

const escapeVCard = (value) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

export function buildVCard(person) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(person.lastName ?? "")};${escapeVCard(person.firstName ?? "")};;;`,
    `FN:${escapeVCard(fullName(person))}`,
  ];
  if (person.company) lines.push(`ORG:${escapeVCard(person.company)}`);
  if (person.position) lines.push(`TITLE:${escapeVCard(person.position)}`);
  if (person.phone) lines.push(`TEL;TYPE=CELL:${person.phone}`);
  if (person.email) lines.push(`EMAIL;TYPE=INTERNET:${person.email}`);
  if (person.website) lines.push(`URL:${person.website}`);
  if (person.linkedin) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${person.linkedin}`);
    lines.push(`URL:${person.linkedin}`);
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVCard(person) {
  const blob = new Blob([buildVCard(person)], {
    type: "text/vcard;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fullName(person).replace(/\s+/g, "-")}.vcf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
