import React from "react"
import {withInlineEditor} from "./editor"
import './Article.css'

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

class Article extends React.Component {
  render() {
    return (
      <article>
        <InlineTitle/>
        <InlineBody/>
      </article>
    )
  }
}

export default Article