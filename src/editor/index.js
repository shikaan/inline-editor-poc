import React, {createRef} from "react"
import ReactDOM from "react-dom"
import {createClient} from "contentful-management"
import * as showdown from 'showdown'

import './editor.css'
import ReactMarkdown from "react-markdown"

const client = createClient({
  accessToken: process.env.REACT_APP_CMA_TOKEN
})

const converter = new showdown.Converter()

export function withInlineEditor(WrappedComponent, options) {
  const {entryId, field, locale} = options

  return class extends React.Component {

    ref = createRef()
    state = {
      editable: false,
      entry: null
    }

    async componentDidMount(){
      const entry = await client
        .getSpace('xzhn6jh2dizn')
        .then(space => space.getEnvironment('master'))
        .then(environment => environment.getEntry(entryId))

      this.setState({entry})
    }

    toggleEditable = async () => {
      const isSaving = this.state.editable
      let newEntry = this.state.entry

      if (isSaving) {
        this.state.entry.fields[field][locale] = converter.makeMarkdown(ReactDOM.findDOMNode(this.ref.current).innerHTML)
        newEntry = await this.state.entry.update()
      }

      this.setState({editable: !isSaving, entry: newEntry})
    }

    render() {
      const {editable, entry} = this.state

      const markdown = entry && entry.fields && entry.fields[field] && entry.fields[field][locale]

      const fabClassName = `fab ${editable ? 'fab--save' : 'fab--edit'}`

      return (
        <>
          <button onClick={this.toggleEditable} className={fabClassName}>{editable ? '💾' : '✏'}️</button>
          <WrappedComponent
            {...this.props}
            ref={this.ref}
            html={converter.makeHtml(markdown)}
            markdown={markdown}
            entry={entry}
            editable={editable} />
        </>
      )
    }
  }
}