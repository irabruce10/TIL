import { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function Loader() {
  return <p className="message">Loading.....</p>;
}

function App() {
  const [openForm, setOpenForm] = useState(false);

  const [facts, setFacts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");
      if (currentCategory !== "all")
        query = query.eq("category", currentCategory);

      let { data: facts, error } = await query.limit(1000);
      if (!error) setFacts(facts);
      else alert("There was an error getting Data from the database");
      setIsLoading(false);
    }

    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header openForm={openForm} setOpenForm={setOpenForm} />

      {openForm ? (
        <NewFactForm setFacts={setFacts} setOpenForm={setOpenForm} />
      ) : (
        ""
      )}

      <main className="main">
        <Category setCurrentCategory={setCurrentCategory} />

        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Header({ openForm, setOpenForm }) {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">
          <img src="./images/log.png" alt="Today I Learned Logo" />
          <h1>TIL</h1>
        </a>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setOpenForm(!openForm)}>
        {openForm ? "Close" : "Share a Fact"}{" "}
      </button>
    </header>
  );
}

function NewFactForm({ setFacts, setOpenForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("https://www.google.com");
  const [category, setCategory] = useState("");

  async function addHandle(e) {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // const newFact = {
      //   id: Date.now(),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();

      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      setText("");
      setCategory("");
      setSource("");
      setOpenForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={addHandle}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => {
          return (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          );
        })}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}
function Category({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}>
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => {
          return (
            <li className="category" key={cat.name}>
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
                onClick={() => setCurrentCategory(cat.name)}>
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return <p>No facts for this Category. Create the First One..!</p>;
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the Database.Add your Own!</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  async function handleVotes(columname) {
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({
        [columname]: fact[columname] + 1,
      })
      .eq("id", fact.id)
      .select();

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noopener noreferrer">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}>
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVotes("votesInteresting")}>
          👍 {fact.votesInteresting}
        </button>
        <button onClick={() => handleVotes("votesMindblowing")}>
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVotes("votesFalse")}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
