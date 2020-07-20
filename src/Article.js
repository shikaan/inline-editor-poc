import React from "react"
import {withInlineEditor} from "./editor"
import ReactMarkdown from "react-markdown"
import './Article.css'

class Article extends React.Component {
  render() {
    const {markdown, editable, html} = this.props

    return <article className="Article" contentEditable={editable} dangerouslySetInnerHTML={{__html: html}}/>
  }
}

export default withInlineEditor(Article, {entryId: '3K9b0esdy0q0yGqgW2g6Ke', field: 'body', locale: 'en-US'})