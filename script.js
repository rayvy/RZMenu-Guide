const checklistItems = document.querySelectorAll(".checklist input");
const storageKey = "rzmenu-guide-checklist";

const savedState = JSON.parse(localStorage.getItem(storageKey) || "[]");

checklistItems.forEach((item, index) => {
  item.checked = Boolean(savedState[index]);
  item.addEventListener("change", () => {
    const nextState = Array.from(checklistItems, checkbox => checkbox.checked);
    localStorage.setItem(storageKey, JSON.stringify(nextState));
  });
});
