/* eslint-disable no-unused-vars */
// ** React Imports
// import { useState } from 'react'

// ** Third Party Components
// import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import PropTypes from 'prop-types'

const TextEditor = ({ value, setValue, toolbar }) => {
  // ** State
  // const [value, setValue] = useState(EditorState.createEmpty())

  // const contentState = value.getCurrentContent()
  // const contentRaw = convertToRaw(contentState)

  // const plainText = value.getCurrentContent().getPlainText()

  return (
    <>
      <Editor
        toolbar={toolbar}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorState={value}
        onEditorStateChange={(data) => setValue(data)}
      />
    </>
  )
}

export default TextEditor

TextEditor.propTypes = {
  toolbar: PropTypes.object
}
