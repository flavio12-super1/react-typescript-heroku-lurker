import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Editor,
  Transforms,
  Range,
  createEditor,
  Descendant,
  Text,
} from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";

import { MentionElement } from "./custom-types";
import CHARACTERS from "./characters";

const Groups = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );

  const chars = CHARACTERS.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10);

  //this code allows you to select a mention from the popup
  const onKeyDown = useCallback(
    (event: any) => {
      if (target && chars.length > 0) {
        console.log("searching mention");
        // console.log(chars);
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  useEffect(() => {
    console.log(chars);
  }, [chars, target]);

  useEffect(() => {
    if (target && chars.length > 0) {
      console.log("searching...");
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [chars.length, editor, index, search, target]);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={() => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          console.log("selected");

          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);

          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            console.log("setting target and search");
            setTarget(beforeRange);
            //this sets the search depeting on what you typed in
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }

        setTarget(null);
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        placeholder="Enter some text..."
      />
      {target && chars.length > 0 ? (
        <div
          ref={ref}
          style={{
            top: "-9999px",
            left: "-9999px",
            position: "absolute",
            zIndex: 1,
            padding: "3px",
            background: "white",
            borderRadius: "4px",
            boxShadow: "0 1px 5px rgba(0,0,0,.2)",
          }}
          data-cy="mentions-portal"
        >
          {chars.map((char, i) => (
            <div
              key={char}
              onClick={() => {
                Transforms.select(editor, target);
                insertMention(editor, char);
                setTarget(null);
              }}
              style={{
                padding: "1px 3px",
                borderRadius: "3px",
                background: i === index ? "#B4D5FF" : "transparent",
                color: "black",
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ) : null}
    </Slate>
  );
};

const withMentions = (editor: any) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element: any) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element: any) => {
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const insertMention = (editor: any, character: string) => {
  const mention: MentionElement = {
    type: "mention",
    character,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention as any);
  Transforms.move(editor);
};

interface LeafProps extends RenderLeafProps {
  attributes: {
    "data-slate-leaf": true;
    [key: string]: string | true;
  };
  children: ReactNode;
  leaf: Text & {
    bold?: boolean;
    code?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "mention":
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

interface CustomText extends Text {
  bold?: true;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface CustomElement extends Text {
  type: "paragraph";
  character?: string;
  children: CustomText[];
}

interface MentionProps extends RenderElementProps {
  attributes: {
    "data-slate-node": "element";
    "data-slate-inline"?: true;
    "data-slate-void"?: true;
    dir?: "rtl";
    ref: any;
  };
  children: React.ReactNode;
  element: CustomElement;
}

const Mention = ({ attributes, children, element }: MentionProps) => {
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: "3px 3px 2px",
    margin: "0 1px",
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    backgroundColor: "rgb(0 0 0)",
    fontSize: "0.9em",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character?.replace(" ", "-")}`}
      style={style}
    >
      @{element.character}
      {children}
    </span>
  );
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
];

export default Groups;
