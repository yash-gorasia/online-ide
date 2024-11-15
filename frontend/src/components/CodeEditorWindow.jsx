import React, {act, useState} from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({onChange, language, theme, code}) => {
    const [value, setValue] = useState(code || "");

    const handleEditorChange = (value) => {
        setValue(value);
        onChange("code", value);
    };

  return(
    <div className="overlay rounded-md overflow-hidden h-full w-full shadow-4xl">
      <Editor
      height="85vh"
      width={`100%`}
      language={language || "javascript"}
      value={value}
      theme={theme}
      defaultLanguage="// some content"
      onChange={handleEditorChange}
      
      />
    </div>
  );
}

export default CodeEditorWindow;