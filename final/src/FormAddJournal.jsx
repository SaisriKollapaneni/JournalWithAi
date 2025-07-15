import {  useState } from "react";
import { useEntries } from "./PostContext"; 

function FormAddJournal() {
  const { onAddEntry } = useEntries();
  const [entry, setEntry] = useState({
    todo: "",
    wins: "",
    emotions: "",
    reflection: "",
  });

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleSubmit = function (e) {
    e.preventDefault();
   const { todo, wins, emotions, reflection } = entry;
    if (!todo || !wins || !emotions || !reflection)
      return;

    const newEntry = {
      id: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
      todo: todo.split(",").map((item) => item.trim()),
      wins: wins.split(",").map((item) => item.trim()),
      emotions: emotions.split(",").map((item) => item.trim()),
      reflection,
    };
    debugger;
    onAddEntry(newEntry);
    setEntry({
      todo: "",
      wins: "",
      emotions: "",
      reflection: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md grid gap-4"
    >
      <textarea
        name="todo"
        value={entry.todo}
        onChange={handleChange}
        placeholder="To-do (comma-separated)"
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
      /> <br />

      <textarea
        name="wins"
        value={entry.wins}
        onChange={handleChange}
        placeholder="Wins of the Day(comma-separated)"
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-green-200"
      />

      <textarea
        name="emotions"
        value={entry.emotions}
        onChange={handleChange}
        placeholder="How are you feeling?"
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-pink-200"
      />

      <textarea
        name="reflection"
        value={entry.reflection}
        onChange={handleChange}
        placeholder="What could have been better?"
        className="w-full border rounded-lg px-4 py-2 text-sm h-24 resize-none focus:outline-none focus:ring focus:ring-red-200"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
      >
        Add Journal Entry
      </button>
    </form>
  );
}

export default FormAddJournal;