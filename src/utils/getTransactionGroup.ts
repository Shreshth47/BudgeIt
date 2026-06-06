export function getTransactionGroup(timestamp:number){
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-1);
  if(date.toLocaleDateString()===today.toLocaleDateString()) return "TODAY";
  if(date.toLocaleDateString()===yesterday.toLocaleDateString()) return "YESTERDAY";

  return date.toLocaleDateString(
    "en-IN",{
      day:"numeric",
      month: "short"
    }
  );
}