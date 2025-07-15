import {  useEffect, useState } from "react";
import { PostProvider, useEntries } from "./PostContext";
import FormAddJournal from "./FormAddJournal";
import "./style.css";
import { api } from "./lib/api";

function App() {
  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  const [isFakeDark, setIsFakeDark] = useState(false);
  

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );


  return (
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>
      <PostProvider>
        <Header />
        <Main />
      </PostProvider>
      <footer> Have a good day! ✌️</footer>
    </section>
  );
}

function Header() {
  // 3) CONSUMING CONTEXT VALUE
  const { onClearEntries } = useEntries();

  return (
    <header>
      <h1>
        My Daily Inspirational Journal
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearEntries}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = useEntries();

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = useEntries();

  return <p>✍🏼 {posts.length} journals found</p>;
}

const Main = function Main() {
  return (
    <main>
      <FormAddJournal/>
      <Entries />
    </main>
  );
};

function Entries() {
  return (
    <section>
      <List />
    </section>
  );
}



function List() {
  const { posts, updateSelected } = useEntries();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFeedback = async () => {
    if (!selected) return;
    setLoading(true);
    const res = await api.post("/generate-feedback", selected);
    const updated = { ...selected, feedback: res.data.feedback };
    updateSelected(updated);
    setSelected(updated); // update local modal
    setLoading(false);
  };

  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={i} onClick={() => setSelected(post)}>
            <h3>{post.id}</h3>
            <p><strong>Todos:</strong> {post.todo}</p><br/>
            <p><strong>Wins:</strong> {post.wins}</p><br/>
            <p><strong>Emotions:</strong> {post.emotions}</p><br/>
            <p><strong>Reflection:</strong> {post.reflection}</p> <br/>
            {post.feedback && <p><strong>AI Feedback:</strong> {post.feedback}</p>}
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", width: "90%", maxWidth: "400px" }}>
            <h3>{selected.id}</h3>
            <p><strong>Todos:</strong> {selected.todo.join(", ")}</p>
            <p><strong>Wins:</strong> {selected.wins.join(", ")}</p>
            <p><strong>Emotions:</strong> {selected.emotions.join(", ")}</p>
            <p><strong>Reflection:</strong> {selected.reflection}</p>
            {selected.feedback && (
              <p><strong>AI Feedback:</strong> {selected.feedback}</p>
            )} <br/>
            {!selected.feedback && (
              <button onClick={getFeedback} disabled={loading} style={{ marginTop: "1rem", marginRight: "1rem" }}>
                {loading ? "Thinking..." : "Get AI Feedback"}
              </button>
            )}
            <button onClick={() => {setSelected(null);setLoading(false);}}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
