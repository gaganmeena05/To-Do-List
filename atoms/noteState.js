const { atom, selector } = require("recoil");

export const noteState = atom({
  key: "noteState",
  default: [],
});

export const filterState = atom({
  key: "TodoListFilter",
  default: "All",
});

export const filteredTodoListState = selector({
  key: "FilteredTodoList",
  get: ({ get }) => {
    const filter = get(filterState);
    const notes = get(noteState);

    switch (filter) {
      case "Active":
        return notes.filter((item) => item.status==="active");
      case "Completed":
        return notes.filter((item) => item.status==="completed");
      default:
        return notes;
    }
  },
});

