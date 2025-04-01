import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TipTapImage from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  CheckSquare,
  Highlighter,
  Underline as UnderlineIcon,
  Upload,
  Info,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

const CustomImage = TipTapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-image-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            "data-image-id": attributes.id,
          };
        },
      },
    };
  },
});

const RichTextEditor = ({
  content = "",
  onChange,
  isDarkMode = false,
  onImagesUploaded,
}) => {
  const fileInputRef = useRef(null);
  const [resizingInfo, setResizingInfo] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageIdCounter, setImageIdCounter] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "inline",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // Use our custom image extension
      CustomImage.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          width: "862",
          height: "384",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange?.(htmlContent);
    },
  });

  useEffect(() => {
    if (onImagesUploaded) {
      onImagesUploaded(uploadedImages);
    }
  }, [uploadedImages, onImagesUploaded]);

  if (!editor) {
    return null;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Show resizing info
        setResizingInfo(true);

        // Generate preview URL
        const previewUrl = URL.createObjectURL(file);

        // Generate a unique ID for this image
        const imageId = `img-${imageIdCounter}`;
        setImageIdCounter((prev) => prev + 1);

        // Add image to editor with the unique ID
        editor
          .chain()
          .focus()
          .setImage({
            src: previewUrl,
            id: imageId,
          })
          .run();

        // Store the file with its ID for later upload
        setUploadedImages((prev) => [
          ...prev,
          { id: imageId, file, previewUrl },
        ]);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Hide resizing message after a delay
        setTimeout(() => setResizingInfo(false), 2000);
      } catch (error) {
        console.error("Error handling image:", error);
        setResizingInfo(false);
      }
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  };

  const toggleHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const getButtonClass = (isActive) => {
    return `relative p-2 rounded-lg transition-all duration-200 ${
      isDarkMode
        ? isActive
          ? "bg-zinc-700 text-white"
          : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
        : isActive
        ? "bg-purple-100 text-purple-600"
        : "text-zinc-700 hover:bg-purple-50 hover:text-purple-600"
    }`;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-700"
          : "bg-white border-purple-100"
      }`}
    >
      {/* Subtle Background Shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-16 -right-16 w-56 h-56 ${
            isDarkMode ? "bg-purple-900" : "bg-purple-200"
          } rounded-full opacity-20 blur-3xl`}
        ></div>
        <div
          className={`absolute -bottom-16 -left-16 w-56 h-56 ${
            isDarkMode ? "bg-blue-900" : "bg-blue-100"
          } rounded-full opacity-20 blur-3xl`}
        ></div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div
        className={`relative z-10 p-3 border-b flex flex-wrap gap-1 ${
          isDarkMode
            ? "bg-zinc-800/70 border-zinc-700"
            : "bg-white/90 border-purple-100"
        }`}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getButtonClass(editor.isActive("underline"))}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={getButtonClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={getButtonClass(editor.isActive("code"))}
          title="Code"
        >
          <Code size={16} />
        </button>

        <div
          className={`w-px h-6 mx-1 ${
            isDarkMode ? "bg-zinc-700" : "bg-purple-100"
          }`}
        />

        <button
          onClick={() => toggleHeading(1)}
          className={getButtonClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => toggleHeading(2)}
          className={getButtonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => toggleHeading(3)}
          className={getButtonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div
          className={`w-px h-6 mx-1 ${
            isDarkMode ? "bg-zinc-700" : "bg-purple-100"
          }`}
        />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getButtonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getButtonClass(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={getButtonClass(editor.isActive("taskList"))}
          title="Task List"
        >
          <CheckSquare size={16} />
        </button>

        <div
          className={`w-px h-6 mx-1 ${
            isDarkMode ? "bg-zinc-700" : "bg-purple-100"
          }`}
        />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={getButtonClass(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={getButtonClass(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={getButtonClass(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={getButtonClass(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>

        <div
          className={`w-px h-6 mx-1 ${
            isDarkMode ? "bg-zinc-700" : "bg-purple-100"
          }`}
        />

        <button
          onClick={addLink}
          className={getButtonClass(editor.isActive("link"))}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          onClick={addImage}
          className={`${getButtonClass(false)} group`}
          title="Upload image (will be resized to 862x384)"
        >
          <Upload size={16} />
          <span
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs w-36 text-center ${
              isDarkMode
                ? "bg-zinc-700 text-zinc-200"
                : "bg-white text-zinc-700 shadow-md"
            } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
          >
            Will resize to 862×384
          </span>
        </button>
        <button
          onClick={addTable}
          className={getButtonClass(editor.isActive("table"))}
          title="Insert Table"
        >
          <TableIcon size={16} />
        </button>

        <div
          className={`w-px h-6 mx-1 ${
            isDarkMode ? "bg-zinc-700" : "bg-purple-100"
          }`}
        />

        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={getButtonClass(editor.isActive("superscript"))}
          title="Superscript"
        >
          <SuperscriptIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={getButtonClass(editor.isActive("subscript"))}
          title="Subscript"
        >
          <SubscriptIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={getButtonClass(editor.isActive("highlight"))}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>

        <div
          className={`w-px h-6 mx-1 ${
            isDarkMode ? "bg-zinc-700" : "bg-purple-100"
          }`}
        />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={getButtonClass(false)}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={getButtonClass(false)}
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div
            className={`shadow-lg rounded-lg border flex gap-1 p-1 ${
              isDarkMode
                ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                : "bg-white border-purple-100"
            }`}
          >
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded ${
                isDarkMode
                  ? editor.isActive("bold")
                    ? "bg-zinc-700"
                    : "hover:bg-zinc-700"
                  : editor.isActive("bold")
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded ${
                isDarkMode
                  ? editor.isActive("italic")
                    ? "bg-zinc-700"
                    : "hover:bg-zinc-700"
                  : editor.isActive("italic")
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <Italic size={14} />
            </button>
            <button
              onClick={addLink}
              className={`p-1 rounded ${
                isDarkMode
                  ? editor.isActive("link")
                    ? "bg-zinc-700"
                    : "hover:bg-zinc-700"
                  : editor.isActive("link")
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <LinkIcon size={14} />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={`relative z-10 prose max-w-none p-4 min-h-[300px] focus:outline-none ${
          isDarkMode ? "prose-invert bg-zinc-900 text-zinc-200" : "bg-white"
        }`}
      />

      {/* Resizing Notification */}
      {resizingInfo && (
        <div
          className={`absolute top-3 right-3 flex items-center gap-2 text-sm px-3 py-2 rounded-lg shadow-md z-20 transition-opacity ${
            isDarkMode
              ? "bg-zinc-800 text-zinc-200"
              : "bg-white text-zinc-800 border border-purple-100"
          }`}
        >
          <Info
            size={14}
            className={isDarkMode ? "text-blue-400" : "text-blue-500"}
          />
          <span>Preparing image preview...</span>
        </div>
      )}

      {/* Footer Info */}
      <div
        className={`relative z-10 flex justify-between items-center px-4 py-2 text-xs ${
          isDarkMode
            ? "bg-zinc-800/70 border-t border-zinc-700 text-zinc-400"
            : "bg-white/90 border-t border-purple-100 text-zinc-500"
        }`}
      >
        <div className="flex items-center gap-1">
          <Info
            size={12}
            className={isDarkMode ? "text-blue-400" : "text-blue-500"}
          />
          <span>Images will be resized to 862×384 pixels</span>
        </div>

        <div
          className={`px-2 py-1 rounded ${
            isDarkMode
              ? "bg-zinc-700/50 text-zinc-300"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {isDarkMode ? "Dark Theme" : "Light Theme"}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
