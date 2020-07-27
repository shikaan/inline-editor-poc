import React, {createRef} from "react"
import ReactDOM from "react-dom"
import {createClient} from "contentful-management"
import * as showdown from 'showdown'

import {loadConfig, getClassName} from "./utils"

import './Editor.css'

const Config = loadConfig('CMA_TOKEN', 'SPACE_ID')

const client = createClient({
  accessToken: Config.Token,
})

const converter = new showdown.Converter()

const Control = ({type, onClick, icon}) => {
  const className = getClassName('control', `control--${type}`)

  return <button onClick={onClick} className={className}>{icon}️</button>
}

export function withInlineEditor(WrappedComponent, options) {
  const {entryId, field, locale} = options

  return class Editor extends React.Component {

    ref = createRef()
    state = {
      editable: false,
      entry: null,
      rawHTMLDump: null,
      fieldType: null,
      space: null
    }

    static defaultProps = {
      enabled: false
    }

    async componentDidMount() {
      const space = await client.getSpace(Config.SpaceId)
      const entry = await this._getEntry(space)
      const fieldType = await this._getFieldType(space, entry)

      this.setState({entry, fieldType, space})
    }

    handleCancel = () => {
      ReactDOM.findDOMNode(this.ref.current).innerHTML = this.state.rawHTMLDump;

      this.setState({
        editable: false
      })
    }

    handleEdit = () => {
      this.setState({
        rawHTMLDump: ReactDOM.findDOMNode(this.ref.current).innerHTML,
        editable: true,
      })
    }

    handleSave = async () => {
      const newRawContent = ReactDOM.findDOMNode(this.ref.current).innerHTML

      this.state.entry.fields[field][locale] = this.state.fieldType === 'richText'
        ? converter.makeMarkdown(newRawContent)
        : newRawContent
      let newEntry

      try {
        newEntry = await this.state.entry.update()
      } catch (e) {
        if (e.name !== "VersionMismatch") {
          throw e
        }

        // Refetch the entry and try again on version mismatch
        // TODO: this should not happen and should be handled via app events
        const entry = await this._getEntry(this.state.space);

        newEntry = await entry.update()
      }

      this.setState({editable: false, entry: newEntry, rawHTMLDump: newRawContent})
    }

    render() {
      const {editable, entry} = this.state

      const content = entry && entry.fields && entry.fields[field] && entry.fields[field][locale]
      const markdown = content
      const editorClassName = getClassName('editor', editable ? 'editor--editable' : 'editor--static')

      return this.props.enabled
        ? (
          <div className={editorClassName}>
            {
              !editable ?
                <div className="editor__top-row">
                  <Control icon="✏️" type="edit" onClick={this.handleEdit}/>
                </div>
                : null
            }
            <WrappedComponent
              {...this.props}
              ref={this.ref}
              html={converter.makeHtml(markdown)}
              markdown={markdown}
              content={content}
              entry={entry}
              editable={editable}/>
            {
              editable ?
                <div className="editor__bottom-row">
                  <Control icon="❌️" type="cancel" onClick={this.handleCancel}/>
                  <Control icon="💾️️" type="save" onClick={this.handleSave}/>
                </div>
                : null
            }
          </div>
        )
        : <WrappedComponent
          {...this.props}
          html={converter.makeHtml(markdown)}
          markdown={markdown}
          content={content}
          entry={entry}
        />
    }

    /**
     * @param {import('contentful-management).Space} space
     * @return {Promise<import('contentful-management).Entry>}
     * @private
     */
    async _getEntry(space) {
      return space
        .getEnvironment(Config.EnvironmentId)
        .then(env => env.getEntry(entryId))
    }

    /**
     * @param {import('contentful-management).Space} space
     * @param {import('contentful-management).Entry} entry
     * @return {Promise<string>}
     * @private
     */
    async _getFieldType(space, entry) {
      const newEntry = entry ?? await this._getEntry(space)
      const contentTypeId = newEntry.sys?.contentType?.sys?.id
      const contentType = await space.getContentType(contentTypeId)
      const currentField = contentType.fields.find(i => i.id === field)

      if (!currentField) {
        throw new RangeError(`Unable to find Field ${field} in Content Type ${contentTypeId}`)
      }

      return currentField.type
    }
  }
}