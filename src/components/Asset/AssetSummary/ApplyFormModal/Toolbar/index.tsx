import { type Editor } from '@tiptap/react';
import { ToolbarButton, ToolbarStyle } from './styles';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from 'react-icons/md';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import { AiOutlineStrikethrough } from 'react-icons/ai';

interface ToolbarProps {
  editor: Editor | null;
}
export const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null;
  }
  return (
    <ToolbarStyle>
      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        active={editor.isActive('bold')}
      >
        <MdFormatBold />
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        active={editor.isActive('italic')}
      >
        <MdFormatItalic />
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        active={editor.isActive('underline')}
      >
        <MdFormatUnderlined />
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        active={editor.isActive('strike')}
      >
        <AiOutlineStrikethrough />
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        active={editor.isActive('heading', { level: 1 })}
      >
        <LuHeading1 />
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        active={editor.isActive('heading', { level: 2 })}
      >
        <LuHeading2 />
      </ToolbarButton>
      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        active={editor.isActive('heading', { level: 3 })}
      >
        <LuHeading3 />
      </ToolbarButton>
    </ToolbarStyle>
  );
};
