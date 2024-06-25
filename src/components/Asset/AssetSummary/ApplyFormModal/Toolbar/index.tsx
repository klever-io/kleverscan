import { type Editor } from '@tiptap/react';
import { ToolbarButton, ToolbarStyle, Icon } from './styles';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from 'react-icons/md';
import { RiArrowGoBackLine, RiArrowGoForwardLine } from 'react-icons/ri';
import { MdFormatListNumbered } from 'react-icons/md';
import { MdFormatListBulleted } from 'react-icons/md';

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
          editor.chain().focus().undo().run();
        }}
        active={false}
      >
        <Icon>
          <RiArrowGoBackLine />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        active={false}
      >
        <Icon>
          <RiArrowGoForwardLine />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        active={editor.isActive('bold')}
      >
        <Icon>
          <MdFormatBold />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        active={editor.isActive('italic')}
      >
        <Icon>
          <MdFormatItalic />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        active={editor.isActive('underline')}
      >
        <Icon>
          <MdFormatUnderlined />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        active={editor.isActive('strike')}
      >
        <Icon>
          <AiOutlineStrikethrough />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        active={editor.isActive('heading', { level: 1 })}
      >
        <Icon>
          <LuHeading1 />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        active={editor.isActive('heading', { level: 2 })}
      >
        <Icon>
          <LuHeading2 />
        </Icon>
      </ToolbarButton>
      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        active={editor.isActive('heading', { level: 3 })}
      >
        <Icon>
          <LuHeading3 />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        active={editor.isActive('bulletList')}
      >
        <Icon>
          <MdFormatListBulleted />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        onClick={e => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        active={editor.isActive('orderedList')}
      >
        <Icon>
          <MdFormatListNumbered />
        </Icon>
      </ToolbarButton>
    </ToolbarStyle>
  );
};
