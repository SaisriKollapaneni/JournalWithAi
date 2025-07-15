import { createContext, useContext, useMemo, useState,useEffect } from "react";
import { api } from "./lib/api";

// 1) CREATE A CONTEXT
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
  api.get("/entries").then(res => setPosts(res.data));
}, []);

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.id} ${post.todo} ${post.wins} ${post.emotions} ${post.reflection}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddEntry(entry) {
    setPosts((entries) => [entry, ...entries]);
    console.log(posts)
  }

  function updateSelected(updatedPost) {
    setPosts((entries) =>
      entries.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }

  function handleClearEntries() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddEntry: handleAddEntry,
      updateSelected,
      onClearEntries: handleClearEntries,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);

  return (
    // 2) PROVIDE VALUE TO CHILD COMPONENTS
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

function useEntries() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

export { PostProvider, useEntries };
