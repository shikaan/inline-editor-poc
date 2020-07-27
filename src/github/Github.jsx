import React, {useEffect, useState, createRef, useMemo, useCallback} from "react";
import './GitHub.css'
import {loadConfig} from "./utils"

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

export function Github() {
  const dialogRef = createRef()
  const githubCode = useMemo(getGithubCode, [])
  const githubURL = useMemo(getGithubUrl, [])
  const [user, setUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useClickOutside(dialogRef, () => setIsDialogOpen(false))

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
  })

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)} className="fab fab--login">
        <span role="img" aria-label="login">🔑️</span>
      </button>
      <dialog ref={dialogRef} className="dialog" open={isDialogOpen}>
        <h1>Github Login</h1>
        <p>
          Click on the following link to login with GitHub
        </p>
        <a href={githubURL}>Login</a>
      </dialog>
    </>
  )
}