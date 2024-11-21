import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FileDirectory = ({ fileStruct: initialFileStruct }) => {
  const [fileStruct, setFileStruct] = useState(initialFileStruct || {})
  const [expand, setExpand] = useState(false)

  const getFiles = async () => {
    const res = await axios.get('http://localhost:8000/api/fileStruct/files')
    console.log(res.data.root);
    setFileStruct(res.data.root)
  }

  useEffect(() => {
    if (!initialFileStruct) {
      getFiles()
    }

  }, [initialFileStruct])

  if (fileStruct.isFolder) {
    return (
      <div className='mt-5 ml-5 border-l-2 border-zinc-800'>
        <div className='folder cursor-pointer' onClick={() => setExpand(!expand)}>
          <span>📁 {fileStruct.name}</span>
        </div>

        <div>
          {expand && fileStruct.items.map((folder, index) => (
            <FileDirectory key={index} fileStruct={folder} />
          ))}
        </div>
      </div>
    )
  } else {
    return <span className='file  ml-5 border-l-2 border-zinc-800 cursor-pointer'>📄 {fileStruct.name} <br /></span>
  }
}

export default FileDirectory
