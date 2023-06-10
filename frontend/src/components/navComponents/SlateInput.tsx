import React, { useMemo, useRef, useContext, useState, useEffect } from "react";
import {
  Editor,
  BaseEditor,
  createEditor,
  Descendant,
  Transforms,
  Text,
  Range,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  useFocused,
  useSlate,
} from "slate-react";

import { withHistory, HistoryEditor } from "slate-history";
import { EventContext } from "./Messages";
import { is } from "immutable";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string; bold?: true };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

function SlateInput(props: any) {
  const editor = useMemo(() => {
    return withHistory(withReact(createEditor()));
  }, []);

  function sendMessage() {
    let x = JSON.parse(JSON.stringify(editor));

    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });
    setFiles([]);
    props.onMessageSubmit(x.children);
  }

  const handleKeyPress = (event: any) => {
    if (!event.shiftKey && event.which === 13) {
      event.preventDefault();
      sendMessage();
    } else if (event.which === 32) {
      // Spacebar
      event.preventDefault();
      const selection = editor.selection;
      if (!selection) {
        return;
      } // guard against null selection

      const [start] = Editor.edges(editor, selection);
      Transforms.insertText(editor, " ", { at: start });
      Transforms.insertText(editor, " ", { at: start });
      Transforms.delete(editor, { distance: 1, at: start });
    }
  };

  const userData = useContext(EventContext);
  const { room, setFiles } = userData;

  useEffect(() => {
    console.log("focus");
    Transforms.select(editor, { offset: 0, path: [0, 0] });
  }, [editor]);

  useEffect(() => {
    document.getElementById("txtInput")?.focus();
  }, [room]);

  // const placeholderValue: string = "Dont be shy 👀";

  return (
    <div id="outerTxtInput">
      <Slate editor={editor} value={initialValue}>
        <Editable
          spellCheck
          autoFocus
          placeholder="Dont be shy : )"
          onKeyDown={(event) => handleKeyPress(event)}
          id="txtInput"
        />
      </Slate>
    </div>
  );
}

export default SlateInput;
