import React, {useContext} from "react"
import {withInlineEditor} from "./editor"
import './Article.css'
import {AuthContext} from "./github"

class Title extends React.Component {
  render() {
    const {content, editable} = this.props

    return <header className="article__title" contentEditable={editable}>{content}</header>
  }
}

const InlineTitle = withInlineEditor(Title, {entryId: '31TNnjHlfaGUoMOwU0M2og', field: 'title', locale: 'en-US'})

class Body extends React.Component {
  render() {
    const {editable, html} = this.props

    return <section className="article__body" contentEditable={editable} dangerouslySetInnerHTML={{__html: html}}/>
  }
}

const InlineBody = withInlineEditor(Body, {entryId: '31TNnjHlfaGUoMOwU0M2og', field: 'body', locale: 'en-US'})

function Article() {
  const user = useContext(AuthContext)

  return (
    <article>
      <InlineTitle enabled={!!user?.login} />
      <InlineBody enabled={!!user?.login} />
    </article>
  )
}

export default Article