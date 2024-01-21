import "./App.css";
import { GoChecklist, GoMarkGithub } from "react-icons/go";
import { Container, Topbar, Title, RepoList } from "./styles";
import React, { useState, useRef } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import Repo from "./components/Repo/Repo";
import User from "./components/User/User";

function App() {
  const [user, setUser] = useState({
    prof: {},
    repos: [],
  });

  const [loading, setLoading] = useState(false);

  const inputEl = useRef(null);

  async function search() {
    setLoading(true);
    const { prof, repos } = await getApiData();
    setLoading(false);

    if (prof.message === "Not Found") {
      inputEl.current.focus();
    } else {
      setUser({
        prof,
        repos,
      });
    }
  }

  async function getApiData() {
    const [prof, repos] = await Promise.all([
      fetch(`https://api.github.com/users/${inputEl.current.value}`).then(
        (response) => response.json()
      ),
      fetch(`https://api.github.com/users/${inputEl.current.value}/repos`).then(
        (response) => response.json()
      ),
    ]);

    return { prof, repos };
  }

  function handleEnterKey() {
    const ENTER = 13;
    if (window.event.keyCode === ENTER) {
      search();
      inputEl.current.blur();
    }
  }

  function selectText() {
    inputEl.current.select();
  }

  return (
    <>
      <Container>
        <Topbar>
          <Title>GiThUb RePo</Title>
          <SearchBar
            onKeyPress={handleEnterKey}
            onFocus={selectText}
            searchFunction={search}
            loadingState={loading}
            inputRef={inputEl}
          />
          <a
            href="https://www.linkedin.com/in/pjha2186/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoChecklist size="36px" color="#eee" />
          </a>
        </Topbar>

        {user.prof.id && (
          <>
            <User prof={user.prof} />

            <RepoList>
              {user.repos.map((r) => (
                <li className="repo" key={r.id}>
                  <Repo repo={r} />
                </li>
              ))}
            </RepoList>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
