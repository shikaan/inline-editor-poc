import React, {useEffect, useState, createRef, useMemo} from "react";
import './GitHub.css'
import {loadConfig} from "./utils"

const Config = loadConfig('GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET')

const useClickOutside = (ref, callback) => {
  function wrappedCallback(e) {
    if (ref.current.contains(e.target)) {
      return
    }
    callback(e)
  }

  useEffect(() => {
    document.addEventListener("mousedown", wrappedCallback)

    return () => {
      document.removeEventListener("mousedown", wrappedCallback)
    }
  }, [ref])
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useClickOutside(dialogRef, () => setIsDialogOpen(false))

  useEffect(() => {
    if (githubCode) {
      console.log('Got GithubCode', githubCode)

      // use token to fetch the user
      // make it part of the context
    }
  })

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)} className="fab fab--login">🔑️</button>
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