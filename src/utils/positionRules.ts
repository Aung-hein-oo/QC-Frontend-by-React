export const POSITION_RULES: Record<string, string> = {
  "Admin": "all",
  "Chairman": "all",
  "CEO": "all",
  "Vice President": "all",
  "Director": "all",
  "General Manager": "all",
  "Deputy General Manager": "division",
  "Senior Executive Manager": "department",
  "Executive Manager": "department",
  "Manager": "team",
  "Senior Project Manager": "team",
  "Project Manager": "team",
  "Deputy Project Manager": "team",
};

export const getScope = (position: string): string => {
  return POSITION_RULES[position] || "self";
};