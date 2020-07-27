import React, {useEffect, useState, createRef, useMemo, useCallback, useContext} from "react";
import './GitHub.css'
import {loadConfig} from "./utils"
import {AuthContext} from "./AuthContext"

const Config = loadConfig('GITHUB_CLIENT_ID')

const useClickOutside = (ref, callback) => {
  const wrappedCallback = useCallback(function (e) {
    if (ref.current.contains(e.target)) {
      return
    }
    callback(e)
  }, [ref, callback])

  useEffect(() => {
    document.addEventListener("mousedown", wrappedCallback)

    return () => {
      document.removeEventListener("mousedown", wrappedCallback)
    }
  }, [ref, wrappedCallback])
}

const getGithubCode = () => {
  return new URLSearchParams(window.location.search).get('code')
}

const getGithubUrl = () => {
  const params = new URLSearchParams({
    'client_id': Config.ClientId,
    'scope': 'user'
  })
  return 'https://github.com/login/oauth/authorize?' + params.toString()
}

const useGithubUser = (githubCode) => {
  const [user, setUser] = useState(null)

  const contextUser = useContext(AuthContext)

  if (!user && contextUser?.login) {
    setUser(contextUser)
  }

  useEffect(() => {
    if (githubCode) {
      fetch('.netlify/functions/github-oauth', {
        method: 'POST',
        body: JSON.stringify({githubCode})
      })
        .then(res => res.json())
        .then(json =>
          fetch('https://api.github.com/user', {
            headers: new Headers({
              Authorization: `token ${json.access_token}`
            })
          })
        )
        .then(res => res.json())
        .then(setUser)
    }
  }, [githubCode])

  return user
}

export function Github({children}) {
  const dialogRef = createRef()
  const githubCode = useMemo(getGithubCode, [])
  const githubURL = useMemo(getGithubUrl, [])
  const githubUser = useGithubUser(githubCode)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useClickOutside(dialogRef, () => setIsDialogOpen(false))

  return (
    <AuthContext.Provider value={githubUser}>
      {
        githubUser
          ? (
            <a
              href={`https://github.com/settings/connections/applications/${Config.ClientId}`}
              className="fab fab--logged"
              title={`Logged in as ${githubUser.login}`}>
              <img className="fab__avatar" alt={githubUser.login} src={githubUser.avatar_url}/>
            </a>
          )
          : (
            <button onClick={() => setIsDialogOpen(true)} className="fab fab--login">
              <span role="img" aria-label="login">🔑️</span>
            </button>
          )
      }
      <dialog ref={dialogRef} className="dialog" open={isDialogOpen}>
        <h1>Github Login</h1>
        <p>
          Click on the following link to login with GitHub
        </p>
        <a href={githubURL}>Login</a>
      </dialog>
      {children}
    </AuthContext.Provider>
  )
}